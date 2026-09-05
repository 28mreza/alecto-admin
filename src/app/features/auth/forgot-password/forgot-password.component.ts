import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { HlmCardImports } from '@spartan-ng/helm/card'
import { ForgotPasswordFormComponent } from './forgot-password-form.component'

/**
 * Forgot-password page ported from
 * `shadcn-admin/src/features/auth/forgot-password/index.tsx`: `max-w-sm`
 * card with the "Forgot Password" title, the reset-link description, the
 * `ForgotPasswordForm` content and the Sign up footer.
 */
@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [RouterLink, HlmCardImports, ForgotPasswordFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section hlmCard class="max-w-sm gap-4 sm:min-w-sm">
      <div hlmCardHeader>
        <h2 hlmCardTitle class="text-lg tracking-tight">Forgot Password</h2>
        <p hlmCardDescription>
          Enter your registered email and <br />
          we will send you a link to reset your password.
        </p>
      </div>
      <div hlmCardContent>
        <app-forgot-password-form />
      </div>
      <div hlmCardFooter>
        <p
          class="text-muted-foreground mx-auto px-8 text-center text-sm text-balance"
        >
          Don't have an account?
          <a
            routerLink="/sign-up"
            class="hover:text-primary underline underline-offset-4"
          >
            Sign up
          </a>
          .
        </p>
      </div>
    </section>
  `,
})
export class ForgotPasswordComponent {}
