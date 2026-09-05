import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core'
import { Router, RouterLink, RouterLinkActive } from '@angular/router'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { HlmBadge } from '@spartan-ng/helm/badge'
import { HlmCollapsibleImports } from '@spartan-ng/helm/collapsible'
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu'
import { HlmTooltipImports } from '@spartan-ng/helm/tooltip'
import { SidebarService } from '../../../core/services/sidebar.service'
import { SIDEBAR_ICONS } from '../sidebar/sidebar-icons'
import { type NavCollapsible, type NavGroup, type NavItem } from '../types'

function checkIsActive(
  currentUrl: string,
  item: NavItem,
  mainNav = false
): boolean {
  const url = currentUrl.split('?')[0]
  return (
    url === item.url ||
    url.split('?')[0] === item.url ||
    !!item.items?.some((i) => i.url === url) ||
    (mainNav &&
      url.split('/')[1] !== '' &&
      url.split('/')[1] === item.url?.split('/')[1])
  )
}

@Component({
  selector: 'app-nav-group',
  standalone: true,
  imports: [
    NgIcon,
    RouterLink,
    RouterLinkActive,
    HlmBadge,
    HlmCollapsibleImports,
    HlmDropdownMenuImports,
    HlmTooltipImports,
  ],
  providers: [provideIcons(SIDEBAR_ICONS)],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="relative flex w-full min-w-0 flex-col p-2"
      data-slot="sidebar-group"
      data-sidebar="group"
    >
      <div
        class="text-sidebar-foreground/70 ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opacity] duration-200 ease-linear group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0 focus-visible:ring-2"
        data-slot="sidebar-group-label"
        data-sidebar="group-label"
      >
        {{ group().title }}
      </div>
      <ul
        class="flex w-full min-w-0 flex-col gap-1"
        data-slot="sidebar-menu"
        data-sidebar="menu"
      >
        @for (item of group().items; track item.title) {
          <li
            class="group/menu-item relative"
            data-slot="sidebar-menu-item"
            data-sidebar="menu-item"
          >
            @if (!item.items) {
              <a
                [routerLink]="item.url"
                routerLinkActive="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                [routerLinkActiveOptions]="{ exact: true }"
                #rla="routerLinkActive"
                [attr.data-active]="rla.isActive ? 'true' : 'false'"
                [attr.data-size]="'default'"
                [hlmTooltip]="linkTip"
                position="right"
                [tooltipDisabled]="!collapsed()"
                (click)="closeMobile()"
                class="peer/menu-button ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground flex h-8 w-full items-center gap-2 overflow-hidden rounded-md p-2 text-start text-sm outline-hidden transition-[width,height,padding] group-has-data-[sidebar=menu-action]/menu-item:pe-8 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:font-medium"
              >
                <ng-template #linkTip>{{ item.title }}</ng-template>
                @if (item.icon) {
                  <ng-icon [name]="item.icon" class="size-4 shrink-0" />
                }
                <span class="truncate">{{ item.title }}</span>
                @if (item.badge) {
                  <hlm-badge class="rounded-full px-1 py-0 text-xs">{{
                    item.badge
                  }}</hlm-badge>
                }
              </a>
            } @else if (collapsed()) {
              <button
                type="button"
                hlmDropdownMenuTrigger
                [hlmDropdownMenuTrigger]="dropdown"
                side="right"
                align="start"
                [attr.data-active]="isActive(item) ? 'true' : 'false'"
                [attr.data-size]="'default'"
                [hlmTooltip]="groupTip"
                position="right"
                [tooltipDisabled]="!collapsed()"
                class="peer/menu-button ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground flex h-8 w-full items-center gap-2 overflow-hidden rounded-md p-2 text-start text-sm outline-hidden transition-[width,height,padding] group-has-data-[sidebar=menu-action]/menu-item:pe-8 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:font-medium"
              >
                <ng-template #groupTip>{{ item.title }}</ng-template>
                @if (item.icon) {
                  <ng-icon [name]="item.icon" class="size-4 shrink-0" />
                }
                <span class="truncate">{{ item.title }}</span>
                @if (item.badge) {
                  <hlm-badge class="rounded-full px-1 py-0 text-xs">{{
                    item.badge
                  }}</hlm-badge>
                }
                <ng-icon
                  name="lucideChevronRight"
                  class="ms-auto size-4 shrink-0 transition-transform duration-200"
                />
              </button>
              <ng-template #dropdown>
                <div hlmDropdownMenu [sideOffset]="4">
                  <div hlmDropdownMenuLabel>
                    {{ item.title }}
                    @if (item.badge) {
                      ({{ item.badge }})
                    }
                  </div>
                  <hr hlmDropdownMenuSeparator />
                  @for (sub of item.items; track sub.title) {
                    <a
                      hlmDropdownMenuItem
                      [routerLink]="sub.url"
                      routerLinkActive="bg-secondary"
                      [routerLinkActiveOptions]="{ exact: true }"
                      class="max-w-52 text-wrap"
                    >
                      @if (sub.icon) {
                        <ng-icon [name]="sub.icon" class="size-4 shrink-0" />
                      }
                      <span class="max-w-52 text-wrap">{{ sub.title }}</span>
                      @if (sub.badge) {
                        <span class="ms-auto text-xs">{{ sub.badge }}</span>
                      }
                    </a>
                  }
                </div>
              </ng-template>
            } @else {
              <hlm-collapsible
                [expanded]="defaultOpen(item)"
                class="group/collapsible"
              >
                <button
                  type="button"
                  hlmCollapsibleTrigger
                  [attr.data-size]="'default'"
                  class="peer/menu-button ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground flex h-8 w-full items-center gap-2 overflow-hidden rounded-md p-2 text-start text-sm outline-hidden transition-[width,height,padding] group-has-data-[sidebar=menu-action]/menu-item:pe-8 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:font-medium"
                >
                  @if (item.icon) {
                    <ng-icon [name]="item.icon" class="size-4 shrink-0" />
                  }
                  <span class="truncate">{{ item.title }}</span>
                  @if (item.badge) {
                    <hlm-badge class="rounded-full px-1 py-0 text-xs">{{
                      item.badge
                    }}</hlm-badge>
                  }
                  <ng-icon
                    name="lucideChevronRight"
                    class="ms-auto size-4 shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                  />
                </button>
                <div hlmCollapsibleContent>
                  <ul
                    class="border-sidebar-border mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-s px-2.5 py-0.5 group-data-[collapsible=icon]:hidden"
                    data-slot="sidebar-menu-sub"
                    data-sidebar="menu-sub"
                  >
                    @for (subItem of item.items; track subItem.title) {
                      <li
                        class="group/menu-sub-item relative"
                        data-slot="sidebar-menu-sub-item"
                        data-sidebar="menu-sub-item"
                      >
                        <a
                          [routerLink]="subItem.url"
                          routerLinkActive="bg-sidebar-accent text-sidebar-accent-foreground"
                          [routerLinkActiveOptions]="{ exact: true }"
                          #subRla="routerLinkActive"
                          [attr.data-active]="
                            subRla.isActive ? 'true' : 'false'
                          "
                          (click)="closeMobile()"
                          class="text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sm outline-hidden group-data-[collapsible=icon]:hidden focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate"
                        >
                          @if (subItem.icon) {
                            <ng-icon
                              [name]="subItem.icon"
                              class="size-4 shrink-0"
                            />
                          }
                          <span class="truncate">{{ subItem.title }}</span>
                          @if (subItem.badge) {
                            <hlm-badge class="rounded-full px-1 py-0 text-xs">{{
                              subItem.badge
                            }}</hlm-badge>
                          }
                        </a>
                      </li>
                    }
                  </ul>
                </div>
              </hlm-collapsible>
            }
          </li>
        }
      </ul>
    </div>
  `,
})
export class NavGroupComponent {
  readonly group = input.required<NavGroup>()

  private readonly router = inject(Router)
  private readonly sidebarService = inject(SidebarService)

  readonly collapsed = computed(
    () => !this.sidebarService.open() && !this.sidebarService.isMobile()
  )

  protected defaultOpen(item: NavCollapsible): boolean {
    return checkIsActive(this.router.url, item, true)
  }

  protected isActive(item: NavItem): boolean {
    return checkIsActive(this.router.url, item)
  }

  protected closeMobile(): void {
    this.sidebarService.setMobileOpen(false)
  }
}
