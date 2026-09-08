import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { ActivatedRoute, RouterLink } from '@angular/router'
import { HlmCardImports } from '@spartan-ng/helm/card'
import { UserAuthFormComponent } from './user-auth-form.component'

/**
 * Sign-in page ported from `shadcn-admin/src/features/auth/sign-in/index.tsx`:
 * `max-w-sm` card with the "Sign in" title, the Sign Up description link,
 * the `UserAuthForm` content and the Terms/Privacy footer. The `redirect`
 * query param is forwarded to the form as its post-login target.
 */
@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [RouterLink, HlmCardImports, UserAuthFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section hlmCard class="max-w-sm gap-4">
      <div hlmCardHeader>
        <h2 hlmCardTitle class="text-lg tracking-tight">Sign in</h2>
        <p hlmCardDescription>
          Enter your email and password below to log into your account.
          <br class="max-sm:hidden" />
          Don't have an account?
          <a
            routerLink="/sign-up"
            class="hover:text-primary text-nowrap underline underline-offset-4"
          >
            Sign Up
          </a>
        </p>
      </div>
      <div hlmCardContent>
        <app-user-auth-form [redirectTo]="redirectTo" />
      </div>
      <div hlmCardFooter>
        <p class="text-muted-foreground px-8 text-center text-sm">
          By clicking sign in, you agree to our
          <a
            href="/terms"
            class="hover:text-primary underline underline-offset-4"
          >
            Terms of Service
          </a>
          and
          <a
            href="/privacy"
            class="hover:text-primary underline underline-offset-4"
          >
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </section>
  `,
})
export class SignInComponent {
  protected readonly redirectTo =
    inject(ActivatedRoute).snapshot.queryParamMap.get('redirect') ?? ''
}
