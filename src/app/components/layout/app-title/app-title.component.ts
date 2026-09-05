import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { RouterLink } from '@angular/router'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucideMenu, lucideX } from '@ng-icons/lucide'
import { LogoComponent } from '../../../assets/logo/logo.component'
import { SidebarService } from '../../../core/services/sidebar.service'

@Component({
  selector: 'app-app-title',
  standalone: true,
  imports: [RouterLink, NgIcon, LogoComponent],
  providers: [provideIcons({ lucideMenu, lucideX })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ul class="flex w-full min-w-0 flex-col gap-1" data-slot="sidebar-menu">
      <li class="group/menu-item relative" data-slot="sidebar-menu-item">
        <div
          class="peer/menu-button ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground flex h-12 w-full items-center gap-0 overflow-hidden rounded-md p-2 py-0 text-start text-sm outline-hidden transition-[width,height,padding] group-has-data-[sidebar=menu-action]/menu-item:pe-8 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-0! group-data-[collapsible=icon]:p-2! hover:bg-transparent focus-visible:ring-2 active:bg-transparent disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:font-medium"
        >
          <a
            routerLink="/"
            (click)="closeMobile()"
            class="grid flex-1 text-start text-sm leading-tight"
          >
            <app-logo class="text-sidebar-primary size-6" />
            <span class="truncate font-bold">Shadcn-Admin</span>
            <span class="truncate text-xs">Vite + ShadcnUI</span>
          </a>
          <button
            type="button"
            data-sidebar="trigger"
            data-slot="sidebar-trigger"
            (click)="toggle()"
            class="aspect-square size-8 shrink-0 max-md:scale-125"
          >
            <span class="sr-only">Toggle Sidebar</span>
            <ng-icon name="lucideX" class="md:hidden" />
            <ng-icon name="lucideMenu" class="max-md:hidden" />
          </button>
        </div>
      </li>
    </ul>
  `,
})
export class AppTitleComponent {
  private readonly sidebarService = inject(SidebarService)

  protected closeMobile(): void {
    this.sidebarService.setMobileOpen(false)
  }

  protected toggle(): void {
    if (this.sidebarService.isMobile()) {
      this.sidebarService.toggleMobileOpen()
    } else {
      this.sidebarService.toggleOpen()
    }
  }
}
