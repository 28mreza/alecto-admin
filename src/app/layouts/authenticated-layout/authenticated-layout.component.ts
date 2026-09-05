import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { CommandMenuComponent } from '../../components/command-menu/command-menu.component'
import { SkipToMainComponent } from '../../components/skip-to-main/skip-to-main.component'
import { HlmToasterImports } from '@spartan-ng/helm/sonner'
import { AppSidebarComponent } from '../../components/layout/app-sidebar/app-sidebar.component'
import { SidebarInsetComponent } from '../../components/layout/sidebar/sidebar-inset.component'

@Component({
  selector: 'app-authenticated-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    SkipToMainComponent,
    CommandMenuComponent,
    AppSidebarComponent,
    SidebarInsetComponent,
    HlmToasterImports,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-skip-to-main />
    <app-command-menu />
    <div
      class="has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full"
      style="--sidebar-width: 16rem; --sidebar-width-icon: 3rem"
    >
      <app-app-sidebar />
      <app-sidebar-inset
        [className]="'@container/content has-data-[layout=fixed]:h-svh peer-data-[variant=inset]:has-data-[layout=fixed]:h-[calc(100svh-(var(--spacing)*4))]'"
      >
        <router-outlet />
      </app-sidebar-inset>
    </div>
    <hlm-toaster [duration]="5000" />
  `,
})
export class AuthenticatedLayoutComponent {}
