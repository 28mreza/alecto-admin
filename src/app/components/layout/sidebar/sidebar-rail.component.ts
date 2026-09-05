import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { SidebarService } from '../../../core/services/sidebar.service'

@Component({
  selector: 'app-sidebar-rail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      data-slot="sidebar-rail"
      data-sidebar="rail"
      aria-label="Toggle Sidebar"
      [attr.tabindex]="'-1'"
      title="Toggle Sidebar"
      (click)="toggle()"
      class="hover:after:bg-sidebar-border hover:group-data-[collapsible=offcanvas]:bg-sidebar absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear group-data-[collapsible=offcanvas]:translate-x-0 group-data-[side=left]:-inset-e-4 after:absolute after:inset-y-0 after:inset-s-1/2 after:w-0.5 group-data-[collapsible=offcanvas]:after:start-full sm:flex [[data-side=left][data-collapsible=offcanvas]_&]:-inset-e-2"
    ></button>
  `,
})
export class SidebarRailComponent {
  private readonly sidebarService = inject(SidebarService)

  protected toggle(): void {
    if (this.sidebarService.isMobile()) {
      this.sidebarService.toggleMobileOpen()
    } else {
      this.sidebarService.toggleOpen()
    }
  }
}
