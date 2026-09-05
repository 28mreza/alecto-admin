import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core'
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucideLoader2, lucideUserPlus } from '@ng-icons/lucide'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmInputImports } from '@spartan-ng/helm/input'
import { HlmLabelImports } from '@spartan-ng/helm/label'
import { PasswordInputComponent } from '../../../components/password-input/password-input.component'
import { ToastService } from '../../../core/services/toast.service'
import { BrandIconComponent } from '../../../shared/icons/brand/brand-icon.component'
import { sleep } from '../../../shared/utils/sleep'
import {
  authEmailValidator,
  authPasswordValidator,
  signUpGroupValidator,
} from '../validators'

/**
 * Sign-up form ported from
 * `shadcn-admin/src/features/auth/sign-up/components/sign-up-form.tsx`:
 * email + password (min 7) + confirm password (required, must match —
 * enforced by the shared `signUpGroupValidator`), the "Create Account"
 * submit with spinner, the "Or continue with" divider and the
 * GitHub/Facebook outline buttons. Submit toasts via
 * `ToastService.promise`, mirroring the source flow.
 */
@Component({
  selector: 'app-sign-up-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIcon,
    HlmButtonImports,
    HlmInputImports,
    HlmLabelImports,
    PasswordInputComponent,
    BrandIconComponent,
  ],
  providers: [provideIcons({ lucideLoader2, lucideUserPlus })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="grid gap-3">
      <div class="grid gap-2">
        <label hlmLabel for="sign-up-email">Email</label>
        <input
          hlmInput
          id="sign-up-email"
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

      <div class="grid gap-2">
        <label hlmLabel for="sign-up-password">Password</label>
        <app-password-input placeholder="********" formControlName="password" />
        @if (password.invalid && (password.touched || password.dirty)) {
          <p class="text-destructive text-sm">
            {{ password.errors?.['authPassword'] }}
          </p>
        }
      </div>

      <div class="grid gap-2">
        <label hlmLabel for="sign-up-confirm">Confirm Password</label>
        <app-password-input
          placeholder="********"
          formControlName="confirmPassword"
        />
        @if (confirmError(); as message) {
          <p class="text-destructive text-sm">{{ message }}</p>
        }
      </div>

      <button hlmBtn type="submit" class="mt-2" [disabled]="isLoading()">
        @if (isLoading()) {
          <ng-icon name="lucideLoader2" class="animate-spin" />
        } @else {
          <ng-icon name="lucideUserPlus" />
        }
        Create Account
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
        <button
          hlmBtn
          variant="outline"
          class="w-full"
          type="button"
          [disabled]="isLoading()"
        >
          <app-brand-icon name="github" className="h-4 w-4" />
          GitHub
        </button>
        <button
          hlmBtn
          variant="outline"
          class="w-full"
          type="button"
          [disabled]="isLoading()"
        >
          <app-brand-icon name="facebook" className="h-4 w-4" />
          Facebook
        </button>
      </div>
    </form>
  `,
})
export class SignUpFormComponent {
  protected readonly isLoading = signal(false)

  protected readonly form = new FormGroup(
    {
      email: new FormControl('', {
        nonNullable: true,
        validators: [authEmailValidator],
      }),
      password: new FormControl('', {
        nonNullable: true,
        validators: [authPasswordValidator],
      }),
      confirmPassword: new FormControl('', { nonNullable: true }),
    },
    { validators: [signUpGroupValidator] }
  )

  protected get email(): FormControl<string> {
    return this.form.controls.email
  }

  protected get password(): FormControl<string> {
    return this.form.controls.password
  }

  protected get confirmPassword(): FormControl<string> {
    return this.form.controls.confirmPassword
  }

  /** Group-level confirm error, shown once the field is touched. */
  protected confirmError(): string | null {
    const touched =
      this.confirmPassword.touched ||
      this.confirmPassword.dirty ||
      this.form.touched
    if (!touched) return null
    const error = this.form.errors?.['confirmPassword']
    return typeof error === 'string' ? error : null
  }

  private readonly toast = inject(ToastService)

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      return
    }
    const email = this.email.value
    this.isLoading.set(true)
    this.toast.promise(sleep(2000), {
      loading: 'Creating account...',
      success: () => {
        this.isLoading.set(false)
        return `Account created for ${email}.`
      },
      error: 'Error',
    })
  }
}
