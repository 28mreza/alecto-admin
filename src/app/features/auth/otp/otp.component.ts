import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { HlmCardImports } from '@spartan-ng/helm/card'
import { OtpFormComponent } from './otp-form.component'

/**
 * OTP page ported from `shadcn-admin/src/features/auth/otp/index.tsx`:
 * `max-w-md` card with the "Two-factor Authentication" title, the
 * code-sent description, the `OtpForm` content and the resend footer.
 */
@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [RouterLink, HlmCardImports, OtpFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section hlmCard class="max-w-md gap-4">
      <div hlmCardHeader>
        <h2 hlmCardTitle class="text-base tracking-tight">
          Two-factor Authentication
        </h2>
        <p hlmCardDescription>
          Please enter the authentication code. <br />
          We have sent the authentication code to your email.
        </p>
      </div>
      <div hlmCardContent>
        <app-otp-form />
      </div>
      <div hlmCardFooter>
        <p class="text-muted-foreground px-8 text-center text-sm">
          Haven't received it?
          <a
            routerLink="/sign-in"
            class="hover:text-primary underline underline-offset-4"
          >
            Resend a new code.
          </a>
          .
        </p>
      </div>
    </section>
  `,
})
export class OtpComponent {}
