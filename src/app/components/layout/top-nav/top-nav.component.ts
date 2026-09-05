import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core'
import { RouterLink } from '@angular/router'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucideMenu } from '@ng-icons/lucide'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu'

export interface TopNavLink {
  title: string
  href: string
  isActive: boolean
  disabled?: boolean
}

@Component({
  selector: 'app-top-nav',
  standalone: true,
  imports: [RouterLink, NgIcon, HlmButtonImports, HlmDropdownMenuImports],
  providers: [provideIcons({ lucideMenu })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // className goes on the HOST (the flex item in the header row), so layout
  // classes like `me-auto` push sibling controls to the far end — mirroring
  // the source where TopNav is a fragment and className lands on the nav
  // that is itself the flex item. Same pattern as SearchComponent.
  host: {
    '[class]': 'className()',
  },
  template: `
    <button
      hlmBtn
      size="icon"
      variant="outline"
      type="button"
      [class]="triggerClasses()"
      hlmDropdownMenuTrigger
      [hlmDropdownMenuTrigger]="menu"
      side="bottom"
      align="start"
    >
      <ng-icon name="lucideMenu" />
      <span class="sr-only">Toggle navigation menu</span>
    </button>

    <ng-template #menu>
      <div hlmDropdownMenu sideOffset="1" align="start">
        @for (link of links(); track link.title + link.href) {
          @if (link.disabled) {
            <span
              hlmDropdownMenuItem
              disabled
              [class]="!link.isActive ? 'text-muted-foreground' : ''"
            >
              {{ link.title }}
            </span>
          } @else {
            <a
              hlmDropdownMenuItem
              [routerLink]="link.href"
              [class]="!link.isActive ? 'text-muted-foreground' : ''"
            >
              {{ link.title }}
            </a>
          }
        }
      </div>
    </ng-template>

    <nav [class]="navClasses()">
      @for (link of links(); track $index) {
        @if (link.disabled) {
          <span
            aria-disabled="true"
            class="text-muted-foreground pointer-events-none text-sm font-medium opacity-50"
          >
            {{ link.title }}
          </span>
        } @else {
          <a [routerLink]="link.href" [class]="linkClasses(link.isActive)">
            {{ link.title }}
          </a>
        }
      }
    </nav>
  `,
})
export class TopNavComponent {
  readonly links = input<TopNavLink[]>([])

  readonly className = input('')

  protected readonly triggerClasses = computed(() =>
    ['md:size-7 lg:hidden'].filter(Boolean).join(' ')
  )

  protected readonly navClasses = computed(() =>
    ['hidden items-center space-x-4 lg:flex lg:space-x-4 xl:space-x-6']
      .filter(Boolean)
      .join(' ')
  )

  protected linkClasses(isActive: boolean): string {
    return [
      'text-sm font-medium transition-colors hover:text-primary',
      isActive ? '' : 'text-muted-foreground',
    ]
      .filter(Boolean)
      .join(' ')
  }
}
