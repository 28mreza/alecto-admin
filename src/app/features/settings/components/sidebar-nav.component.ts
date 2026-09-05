import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router'
import { NgIcon, provideIcons } from '@ng-icons/core'
import {
  lucideBell,
  lucideMonitor,
  lucidePalette,
  lucideUserCog,
  lucideWrench,
} from '@ng-icons/lucide'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmScrollAreaImports } from '@spartan-ng/helm/scroll-area'
import { HlmSelectImports } from '@spartan-ng/helm/select'
import { NgScrollbar } from 'ngx-scrollbar'
import { filter } from 'rxjs'

export interface SettingsNavItem {
  title: string
  href: string
  icon: string
}

/**
 * Settings sidebar navigation ported from
 * `shadcn-admin/src/features/settings/components/sidebar-nav.tsx`.
 * Mobile: hlm-select dropdown; desktop: scrollable ghost-button nav where the
 * active link (`router.url === href`) gets `bg-muted`.
 */
@Component({
  selector: 'app-settings-sidebar-nav',
  standalone: true,
  imports: [
    NgIcon,
    RouterLink,
    RouterLinkActive,
    HlmButtonImports,
    HlmScrollAreaImports,
    HlmSelectImports,
    NgScrollbar,
  ],
  providers: [
    provideIcons({
      lucideBell,
      lucideMonitor,
      lucidePalette,
      lucideUserCog,
      lucideWrench,
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-1 md:hidden">
      <hlm-select [value]="selectedHref()" (valueChange)="navigate($event)">
        <hlm-select-trigger class="h-12 sm:w-48">
          <hlm-select-value placeholder="Select a section" />
        </hlm-select-trigger>
        <hlm-select-content *hlmSelectPortal>
          @for (item of items(); track item.href) {
            <hlm-select-item [value]="item.href">
              <div class="flex gap-x-4 px-2 py-1">
                <span class="scale-125">
                  <ng-icon [name]="item.icon" aria-hidden="true" />
                </span>
                <span class="text-md">{{ item.title }}</span>
              </div>
            </hlm-select-item>
          }
        </hlm-select-content>
      </hlm-select>
    </div>

    <ng-scrollbar
      hlm
      class="bg-background hidden w-full min-w-40 px-1 py-2 md:block"
    >
      <nav class="flex space-x-2 py-1 lg:flex-col lg:space-y-1 lg:space-x-0">
        @for (item of items(); track item.href) {
          <a
            hlmBtn
            variant="ghost"
            [routerLink]="item.href"
            routerLinkActive
            #rla="routerLinkActive"
            [routerLinkActiveOptions]="{ exact: true }"
            [class]="linkClass(rla.isActive)"
          >
            <span class="me-2">
              <ng-icon [name]="item.icon" size="18" aria-hidden="true" />
            </span>
            {{ item.title }}
          </a>
        }
      </nav>
    </ng-scrollbar>
  `,
})
export class SidebarNavComponent {
  readonly items = input.required<SettingsNavItem[]>()

  private readonly router = inject(Router)

  protected readonly selectedHref = signal<string>(this.router.url)

  constructor() {
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        ),
        takeUntilDestroyed()
      )
      .subscribe((event) => {
        this.selectedHref.set(event.urlAfterRedirects)
      })
  }

  protected navigate(href: string | null | undefined): void {
    if (!href) return
    this.selectedHref.set(href)
    void this.router.navigateByUrl(href)
  }

  protected linkClass(isActive: boolean): string {
    return isActive
      ? 'justify-start bg-muted hover:bg-accent'
      : 'justify-start hover:bg-accent hover:underline'
  }
}
