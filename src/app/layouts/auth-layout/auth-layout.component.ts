import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { HlmToasterImports } from '@spartan-ng/helm/sonner'
import { LogoComponent } from '../../assets/logo/logo.component'

/**
 * Public auth shell ported from `shadcn-admin/src/features/auth/auth-layout.tsx`:
 * full-viewport centered container with the Logo + "Alecto Admin" row above
 * the active auth page (rendered through the router outlet, since the auth
 * pages are child routes). Sign-in-2 intentionally stays outside this shell
 * — the source renders it as a standalone split layout without AuthLayout.
 */
@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet, HlmToasterImports, LogoComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="container grid h-svh max-w-none items-center justify-center">
      <div
        class="mx-auto flex w-full flex-col justify-center space-y-2 py-8 sm:p-8"
      >
        <div class="mb-4 flex items-center justify-center">
          <app-logo className="me-2" />
          <h1 class="text-xl font-medium">Alecto Admin</h1>
        </div>
        <router-outlet />
      </div>
      <hlm-toaster [duration]="5000" />
    </div>
  `,
})
export class AuthLayoutComponent {}
