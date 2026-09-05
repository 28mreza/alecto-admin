import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  computed,
  inject,
} from '@angular/core'
import { LayoutService } from '../../../core/services/layout.service'
import { SidebarService } from '../../../core/services/sidebar.service'
import { sidebarData } from '../data/sidebar-data'
import { NavGroupComponent } from '../nav-group/nav-group.component'
import { NavUserComponent } from '../nav-user/nav-user.component'
import { SidebarComponent } from '../sidebar/sidebar.component'
import { SidebarContentComponent } from '../sidebar/sidebar-content.component'
import { SidebarFooterComponent } from '../sidebar/sidebar-footer.component'
import { SidebarHeaderComponent } from '../sidebar/sidebar-header.component'
import { SidebarRailComponent } from '../sidebar/sidebar-rail.component'
import { TeamSwitcherComponent } from '../team-switcher/team-switcher.component'

@Component({
  selector: 'app-app-sidebar',
  standalone: true,
  imports: [
    SidebarComponent,
    SidebarHeaderComponent,
    SidebarContentComponent,
    SidebarFooterComponent,
    SidebarRailComponent,
    TeamSwitcherComponent,
    NavGroupComponent,
    NavUserComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'group peer',
    '[attr.data-variant]': 'layoutService.variant()',
    '[attr.data-collapsible]': 'collapsedCollapsible()',
    '[attr.data-state]': "sidebarService.open() ? 'expanded' : 'collapsed'",
    '[attr.data-side]': "'left'",
  },
  template: `
    <app-sidebar
      [collapsible]="layoutService.collapsible()"
      [variant]="layoutService.variant()"
    >
      <app-sidebar-header>
        <app-team-switcher [teams]="sidebarData.teams" />
      </app-sidebar-header>
      <app-sidebar-content>
        @for (group of sidebarData.navGroups; track group.title) {
          <app-nav-group [group]="group" />
        }
      </app-sidebar-content>
      <app-sidebar-footer>
        <app-nav-user [user]="sidebarData.user" />
      </app-sidebar-footer>
      <app-sidebar-rail />
    </app-sidebar>
    @if (sidebarService.isMobile() && sidebarService.mobileOpen()) {
      <!-- Explicit mobile sheet (NOT projected): <ng-content /> inside an
        overlay-stamped template resolves empty, which rendered the mobile
        sheet blank. Explicit composition renders every open. -->
      <!-- z-[60]: above the sticky header (z-50) which comes later in DOM
        order and would otherwise paint over the panel on equal z-index.
        CDK overlays (toaster, dialogs, command menu at z-1000) stay on top. -->
      <div
        class="fixed inset-0 z-[60]"
        role="dialog"
        aria-modal="true"
        aria-label="Sidebar navigation"
      >
        <div
          class="absolute inset-0 bg-black/80"
          aria-hidden="true"
          (click)="closeMobile()"
        ></div>
        <div
          class="bg-sidebar text-sidebar-foreground absolute inset-y-0 start-0 flex w-72 flex-col shadow-lg"
          data-sidebar="sidebar"
          data-mobile="true"
        >
          <app-sidebar-header>
            <app-team-switcher [teams]="sidebarData.teams" />
          </app-sidebar-header>
          <app-sidebar-content>
            @for (group of sidebarData.navGroups; track group.title) {
              <app-nav-group [group]="group" />
            }
          </app-sidebar-content>
          <app-sidebar-footer>
            <app-nav-user [user]="sidebarData.user" />
          </app-sidebar-footer>
        </div>
      </div>
    }
  `,
})
export class AppSidebarComponent {
  protected readonly layoutService = inject(LayoutService)
  protected readonly sidebarService = inject(SidebarService)
  protected readonly sidebarData = sidebarData

  readonly collapsedCollapsible = computed(() =>
    !this.sidebarService.open() ? this.layoutService.collapsible() : ''
  )

  protected closeMobile(): void {
    this.sidebarService.setMobileOpen(false)
  }

  @HostListener('window:keydown.escape')
  protected onEscape(): void {
    if (this.sidebarService.isMobile() && this.sidebarService.mobileOpen()) {
      this.closeMobile()
    }
  }
}
