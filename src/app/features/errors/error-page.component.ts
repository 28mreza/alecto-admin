import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { ActivatedRoute } from '@angular/router'
import { map } from 'rxjs'
import { ConfigDrawerComponent } from '../../components/config-drawer/config-drawer.component'
import { HeaderComponent } from '../../components/layout/header/header.component'
import { ProfileDropdownComponent } from '../../components/profile-dropdown/profile-dropdown.component'
import { RefreshButtonComponent } from '../../components/refresh-button/refresh-button.component'
import { SearchComponent } from '../../components/search/search.component'
import { ThemeSwitchComponent } from '../../components/theme-switch/theme-switch.component'
import { ForbiddenErrorComponent } from './forbidden-error.component'
import { GeneralErrorComponent } from './general-error.component'
import { MaintenanceErrorComponent } from './maintenance-error.component'
import { NotFoundErrorComponent } from './not-found-error.component'
import { UnauthorizedErrorComponent } from './unauthorized-error.component'

/**
 * In-app error shell ported from
 * `shadcn-admin/src/routes/_authenticated/errors/$error.tsx`: fixed header
 * (search + theme switch + config drawer + profile) with the error component
 * for the `:error` param rendered in the flex-1 content area. Unknown params
 * fall back to the 404 page (like the source).
 */
@Component({
  selector: 'app-error-page',
  standalone: true,
  imports: [
    HeaderComponent,
    SearchComponent,
    RefreshButtonComponent,
    ThemeSwitchComponent,
    ConfigDrawerComponent,
    ProfileDropdownComponent,
    UnauthorizedErrorComponent,
    ForbiddenErrorComponent,
    NotFoundErrorComponent,
    GeneralErrorComponent,
    MaintenanceErrorComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-header [fixed]="true" [className]="'border-b'">
      <app-search [className]="'me-auto'" />
      <app-refresh-button />
      <app-theme-switch />
      <app-config-drawer />
      <app-profile-dropdown />
    </app-header>
    <div class="flex min-h-[calc(100svh-4rem)] flex-1 flex-col justify-center">
      @switch (error()) {
        @case ('unauthorized') {
          <app-unauthorized-error [className]="'h-auto'" />
        }
        @case ('forbidden') {
          <app-forbidden-error [className]="'h-auto'" />
        }
        @case ('not-found') {
          <app-not-found-error [className]="'h-auto'" />
        }
        @case ('internal-server-error') {
          <app-general-error [className]="'h-auto'" />
        }
        @case ('maintenance-error') {
          <app-maintenance-error [className]="'h-auto'" />
        }
        @default {
          <app-not-found-error [className]="'h-auto'" />
        }
      }
    </div>
  `,
})
export class ErrorPageComponent {
  protected readonly error = toSignal(
    inject(ActivatedRoute).paramMap.pipe(
      map((params) => params.get('error') ?? '')
    ),
    { initialValue: '' }
  )
}
