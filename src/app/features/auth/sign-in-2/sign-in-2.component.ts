import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { LogoComponent } from '../../../assets/logo/logo.component'
import { UserAuthFormComponent } from '../sign-in/user-auth-form.component'

/**
 * Standalone split-layout sign-in ported from
 * `shadcn-admin/src/features/auth/sign-in/sign-in-2.tsx`: left column with
 * the logo, the "Sign in" heading, the shared `UserAuthForm` and the
 * Terms footer; right column (below `lg` hidden) with the dashboard
 * screenshots for the light/dark themes. Deliberately NOT wrapped in
 * `AuthLayout` — the source renders this layout on its own.
 */
@Component({
  selector: 'app-sign-in-2',
  standalone: true,
  imports: [RouterLink, LogoComponent, UserAuthFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="relative container grid h-svh flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0"
    >
      <div class="lg:p-8">
        <div
          class="mx-auto flex w-full flex-col justify-center space-y-2 py-8 sm:w-120 sm:p-8"
        >
          <div class="mb-4 flex items-center justify-center">
            <app-logo className="me-2" />
            <h1 class="text-xl font-medium">Alecto Admin</h1>
          </div>
        </div>
        <div
          class="mx-auto flex w-full max-w-sm flex-col justify-center space-y-2"
        >
          <div class="flex flex-col space-y-2 text-start">
            <h2 class="text-lg font-semibold tracking-tight">Sign in</h2>
            <p class="text-muted-foreground text-sm">
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
          <app-user-auth-form />
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
      </div>

      <div
        class="bg-muted relative h-full overflow-hidden max-lg:hidden [&>img]:absolute [&>img]:top-[15%] [&>img]:left-20 [&>img]:h-full [&>img]:w-full [&>img]:object-cover [&>img]:object-top-left [&>img]:select-none"
      >
        <img
          src="/images/dashboard-light.png"
          class="dark:hidden"
          width="1024"
          height="1151"
          alt="Shadcn-Admin"
        />
        <img
          src="/images/dashboard-dark.png"
          class="hidden dark:block"
          width="1024"
          height="1138"
          alt="Shadcn-Admin"
        />
      </div>
    </div>
  `,
})
export class SignIn2Component {}
