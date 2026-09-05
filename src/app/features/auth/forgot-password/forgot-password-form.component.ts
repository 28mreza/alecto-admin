import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core'
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { Router } from '@angular/router'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucideArrowRight, lucideLoader2 } from '@ng-icons/lucide'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmInputImports } from '@spartan-ng/helm/input'
import { HlmLabelImports } from '@spartan-ng/helm/label'
import { ToastService } from '../../../core/services/toast.service'
import { sleep } from '../../../shared/utils/sleep'
import { authEmailValidator } from '../validators'

/**
 * Forgot-password form ported from
 * `shadcn-admin/src/features/auth/forgot-password/components/forgot-password-form.tsx`:
 * email field with the "Continue" submit (spinner while `isLoading`).
 * Submit toasts via `ToastService.promise`, resets the form and navigates
 * to `/otp` on success, mirroring the source flow.
 */
@Component({
  selector: 'app-forgot-password-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIcon,
    HlmButtonImports,
    HlmInputImports,
    HlmLabelImports,
  ],
  providers: [provideIcons({ lucideArrowRight, lucideLoader2 })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="grid gap-2">
      <div class="grid gap-2">
        <label hlmLabel for="forgot-password-email">Email</label>
        <input
          hlmInput
          id="forgot-password-email"
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
      <button hlmBtn type="submit" class="mt-2" [disabled]="isLoading()">
        Continue
        @if (isLoading()) {
          <ng-icon name="lucideLoader2" class="animate-spin" />
        } @else {
          <ng-icon name="lucideArrowRight" />
        }
      </button>
    </form>
  `,
})
export class ForgotPasswordFormComponent {
  protected readonly isLoading = signal(false)

  protected readonly form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [authEmailValidator],
    }),
  })

  protected get email(): FormControl<string> {
    return this.form.controls.email
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
      loading: 'Sending email...',
      success: () => {
        this.isLoading.set(false)
        this.form.reset()
        void this.router.navigate(['/otp'])
        return `Email sent to ${email}`
      },
      error: 'Error',
    })
  }
}
