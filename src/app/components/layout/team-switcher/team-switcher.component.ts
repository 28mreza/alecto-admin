import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucideChevronsUpDown, lucidePlus } from '@ng-icons/lucide'
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu'
import { SidebarService } from '../../../core/services/sidebar.service'
import { ThemeService } from '../../../core/services/theme.service'
import { SIDEBAR_ICONS } from '../sidebar/sidebar-icons'
import { type Team } from '../types'

@Component({
  selector: 'app-team-switcher',
  standalone: true,
  imports: [NgIcon, HlmDropdownMenuImports],
  providers: [
    provideIcons({ ...SIDEBAR_ICONS, lucideChevronsUpDown, lucidePlus }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ul class="flex w-full min-w-0 flex-col gap-1" data-slot="sidebar-menu">
      <li class="group/menu-item relative" data-slot="sidebar-menu-item">
        <button
          type="button"
          hlmDropdownMenuTrigger
          [hlmDropdownMenuTrigger]="menu"
          [side]="isMobile() ? 'bottom' : 'right'"
          align="start"
          [attr.data-state]="menuOpen() ? 'open' : 'closed'"
          class="peer/menu-button ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground flex h-12 w-full items-center gap-2 overflow-hidden rounded-md p-2 text-start text-sm outline-hidden transition-[width,height,padding] group-has-data-[sidebar=menu-action]/menu-item:pe-8 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-0! focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:font-medium"
          (hlmDropdownMenuOpened)="menuOpen.set(true)"
          (hlmDropdownMenuClosed)="menuOpen.set(false)"
        >
          <div
            class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 shrink-0 items-center justify-center overflow-hidden rounded-sm"
          >
            @if (isImageLogo(activeTeam().logo)) {
              <img
                [src]="teamLogoSrc(activeTeam().logo)"
                [alt]="activeTeam().name"
                class="size-8 object-cover"
              />
            } @else {
              <ng-icon [name]="activeTeam().logo" class="size-4" />
            }
          </div>
          <div
            class="grid flex-1 text-start text-sm leading-tight group-data-[collapsible=icon]:hidden"
          >
            <span class="truncate font-semibold">{{ activeTeam().name }}</span>
            <span class="truncate text-xs">{{ activeTeam().plan }}</span>
          </div>
          <ng-icon
            name="lucideChevronsUpDown"
            class="ms-auto size-4 shrink-0 group-data-[collapsible=icon]:hidden"
          />
        </button>

        <ng-template #menu>
          <div hlmDropdownMenu [sideOffset]="4" class="w-56 rounded-lg">
            <div hlmDropdownMenuLabel class="text-muted-foreground text-xs">
              Teams
            </div>
            @for (team of teams(); track team.name; let index = $index) {
              <button
                type="button"
                hlmDropdownMenuItem
                class="gap-2 p-2"
                (click)="selectTeam(team)"
              >
                <div
                  class="flex size-6 items-center justify-center overflow-hidden rounded-sm border"
                >
                  @if (isImageLogo(team.logo)) {
                    <img
                      [src]="teamLogoSrc(team.logo)"
                      [alt]="team.name"
                      class="size-6 object-cover"
                    />
                  } @else {
                    <ng-icon [name]="team.logo" class="size-4 shrink-0" />
                  }
                </div>
                {{ team.name }}
                <span hlmDropdownMenuShortcut>⌘{{ index + 1 }}</span>
              </button>
            }
            <hr hlmDropdownMenuSeparator />
            <button type="button" hlmDropdownMenuItem class="gap-2 p-2">
              <div
                class="bg-background flex size-6 items-center justify-center rounded-md border"
              >
                <ng-icon name="lucidePlus" class="size-4" />
              </div>
              <div class="text-muted-foreground font-medium">Add team</div>
            </button>
          </div>
        </ng-template>
      </li>
    </ul>
  `,
})
export class TeamSwitcherComponent {
  readonly teams = input.required<Team[]>()

  readonly menuOpen = signal(false)

  private readonly sidebarService = inject(SidebarService)
  private readonly themeService = inject(ThemeService)

  protected readonly isMobile = this.sidebarService.isMobile

  private readonly selectedIndex = signal(0)

  protected readonly activeTeam = computed(
    () => this.teams()[this.selectedIndex()] ?? this.teams()[0]
  )

  protected selectTeam(team: Team): void {
    const index = this.teams().indexOf(team)
    this.selectedIndex.set(index === -1 ? 0 : index)
  }

  protected isImageLogo(logo: string): boolean {
    return (
      logo.startsWith('/') ||
      logo.startsWith('http') ||
      /\.(png|jpe?g|svg|gif|webp)$/i.test(logo)
    )
  }

  /**
   * Resolves the theme-aware brand logo: the light/dark logo pair follows
   * the resolved theme, every other path passes through unchanged.
   */
  protected teamLogoSrc(logo: string): string {
    if (
      logo === '/images/logo-light.webp' ||
      logo === '/images/logo-dark.webp' ||
      logo === '/images/logo.webp'
    ) {
      return this.themeService.resolvedTheme() === 'dark'
        ? '/images/logo-dark.webp'
        : '/images/logo-light.webp'
    }
    return logo
  }
}
