import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { HlmCardImports } from '@spartan-ng/helm/card'
import { SignUpFormComponent } from './sign-up-form.component'

/**
 * Sign-up page ported from `shadcn-admin/src/features/auth/sign-up/index.tsx`:
 * `max-w-sm` card with the "Create an account" title, the Sign In
 * description link, the `SignUpForm` content and the Terms/Privacy footer.
 */
@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [RouterLink, HlmCardImports, SignUpFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section hlmCard class="max-w-sm gap-4">
      <div hlmCardHeader>
        <h2 hlmCardTitle class="text-lg tracking-tight">Create an account</h2>
        <p hlmCardDescription>
          Enter your email and password to create an account. <br />
          Already have an account?
          <a
            routerLink="/sign-in"
            class="hover:text-primary underline underline-offset-4"
          >
            Sign In
          </a>
        </p>
      </div>
      <div hlmCardContent>
        <app-sign-up-form />
      </div>
      <div hlmCardFooter>
        <p class="text-muted-foreground px-8 text-center text-sm">
          By creating an account, you agree to our
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
export class SignUpComponent {}
