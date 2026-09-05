import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from '@angular/core'
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { Router, RouterLink } from '@angular/router'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucideLoader2, lucideLogIn } from '@ng-icons/lucide'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmInputImports } from '@spartan-ng/helm/input'
import { HlmLabelImports } from '@spartan-ng/helm/label'
import { PasswordInputComponent } from '../../../components/password-input/password-input.component'
import { ToastService } from '../../../core/services/toast.service'
import { BrandIconComponent } from '../../../shared/icons/brand/brand-icon.component'
import { sleep } from '../../../shared/utils/sleep'
import { authEmailValidator, authPasswordValidator } from '../validators'

/**
 * Sign-in form ported from
 * `shadcn-admin/src/features/auth/sign-in/components/user-auth-form.tsx`:
 * email + password (shared `app-password-input`) with the "Forgot password?"
 * link, a submit button showing a spinner while `isLoading`, the
 * "Or continue with" divider and the GitHub/Facebook outline buttons.
 * Submit toasts via `ToastService.promise` and navigates to `redirectTo`
 * (or `/`) on success, mirroring the source `toast.promise` flow.
 */
@Component({
  selector: 'app-user-auth-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    NgIcon,
    HlmButtonImports,
    HlmInputImports,
    HlmLabelImports,
    PasswordInputComponent,
    BrandIconComponent,
  ],
  providers: [provideIcons({ lucideLoader2, lucideLogIn })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="grid gap-3">
      <div class="grid gap-2">
        <label hlmLabel for="sign-in-email">Email</label>
        <input
          hlmInput
          id="sign-in-email"
          type="email"
          placeholder="name@example.com"
          formControlName="email"
        />
        @if (email.invalid && (email.touched || email.dirty)) {
          <p class="text-destructive text-sm">
            {{ email.errors?.['authEmail'] }}
          </p>
        }
      </div>

      <div class="relative grid gap-2">
        <label hlmLabel for="sign-in-password">Password</label>
        <app-password-input placeholder="********" formControlName="password" />
        @if (password.invalid && (password.touched || password.dirty)) {
          <p class="text-destructive text-sm">
            {{ password.errors?.['authPassword'] }}
          </p>
        }
        <a
          routerLink="/forgot-password"
          class="text-muted-foreground absolute inset-e-0 -top-0.5 text-sm font-medium hover:opacity-75"
        >
          Forgot password?
        </a>
      </div>

      <button hlmBtn type="submit" class="mt-2" [disabled]="isLoading()">
        @if (isLoading()) {
          <ng-icon name="lucideLoader2" class="animate-spin" />
        } @else {
          <ng-icon name="lucideLogIn" />
        }
        Sign in
      </button>

      <div class="relative my-2">
        <div class="absolute inset-0 flex items-center">
          <span class="w-full border-t"></span>
        </div>
        <div class="relative flex justify-center text-xs uppercase">
          <span class="bg-background text-muted-foreground px-2">
            Or continue with
          </span>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-2">
        <button hlmBtn variant="outline" type="button" [disabled]="isLoading()">
          <app-brand-icon name="github" className="h-4 w-4" />
          GitHub
        </button>
        <button hlmBtn variant="outline" type="button" [disabled]="isLoading()">
          <app-brand-icon name="facebook" className="h-4 w-4" />
          Facebook
        </button>
      </div>
    </form>
  `,
})
export class UserAuthFormComponent {
  /** Post-login target from the `redirect` query param (defaults to `/`). */
  readonly redirectTo = input<string>('')

  protected readonly isLoading = signal(false)

  protected readonly form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [authEmailValidator],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [authPasswordValidator],
    }),
  })

  protected get email(): FormControl<string> {
    return this.form.controls.email
  }

  protected get password(): FormControl<string> {
    return this.form.controls.password
  }

  private readonly router = inject(Router)
  private readonly toast = inject(ToastService)

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      return
    }
    const email = this.email.value
    this.isLoading.set(true)
    this.toast.promise(sleep(2000), {
      loading: 'Signing in...',
      success: () => {
        this.isLoading.set(false)
        const target = this.redirectTo().trim() || '/'
        void this.router.navigateByUrl(target)
        return `Welcome back, ${email}!`
      },
      error: 'Error',
    })
  }
}
