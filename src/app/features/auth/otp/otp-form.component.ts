import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Injector,
  runInInjectionContext,
  signal,
} from '@angular/core'
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { Router } from '@angular/router'
import { BrnInputOtp } from '@spartan-ng/brain/input-otp'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmInputOtpImports } from '@spartan-ng/helm/input-otp'
import { HlmLabelImports } from '@spartan-ng/helm/label'
import { showSubmittedData } from '../../../shared/utils/show-submitted-data'
import { otpLengthValidator } from '../validators'

/**
 * OTP form ported from
 * `shadcn-admin/src/features/auth/otp/components/otp-form.tsx`: a 6-slot
 * `brn-input-otp` (spartan helm, grouped 2-2-2 with separators) bound to a
 * Reactive FormControl, plus a "Verify" button disabled until all 6 chars
 * are entered. Submit shows the submitted data and navigates to `/` after
 * a short delay, mirroring the source flow.
 */
@Component({
  selector: 'app-otp-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    BrnInputOtp,
    HlmButtonImports,
    HlmInputOtpImports,
    HlmLabelImports,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="grid gap-2">
      <div class="grid gap-2">
        <label hlmLabel for="otp-input" class="sr-only">
          One-Time Password
        </label>
        <brn-input-otp
          hlmInputOtp
          id="otp-input"
          [length]="6"
          formControlName="otp"
          class="justify-between sm:[&>[data-slot='input-otp-group']>div]:w-12"
        >
          <hlm-input-otp-group>
            <hlm-input-otp-slot [index]="0" />
            <hlm-input-otp-slot [index]="1" />
          </hlm-input-otp-group>
          <hlm-input-otp-separator />
          <hlm-input-otp-group>
            <hlm-input-otp-slot [index]="2" />
            <hlm-input-otp-slot [index]="3" />
          </hlm-input-otp-group>
          <hlm-input-otp-separator />
          <hlm-input-otp-group>
            <hlm-input-otp-slot [index]="4" />
            <hlm-input-otp-slot [index]="5" />
          </hlm-input-otp-group>
        </brn-input-otp>
        @if (otp.invalid && (otp.touched || otp.dirty)) {
          <p class="text-destructive text-sm">{{ otp.errors?.['otp'] }}</p>
        }
      </div>
      <button
        hlmBtn
        type="submit"
        class="mt-2"
        [disabled]="(otp.value?.length ?? 0) < 6 || isLoading()"
      >
        Verify
      </button>
    </form>
  `,
})
export class OtpFormComponent {
  protected readonly isLoading = signal(false)

  protected readonly form = new FormGroup({
    otp: new FormControl('', {
      nonNullable: true,
      validators: [otpLengthValidator],
    }),
  })

  protected get otp(): FormControl<string> {
    return this.form.controls.otp
  }

  private readonly router = inject(Router)
  private readonly injector = inject(Injector)

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      return
    }
    this.isLoading.set(true)
    const data = this.form.getRawValue()
    // showSubmittedData() injects ToastService, so it must run inside an
    // injection context (submit handlers are not one).
    runInInjectionContext(this.injector, () => showSubmittedData(data))

    setTimeout(() => {
      this.isLoading.set(false)
      void this.router.navigate(['/'])
    }, 1000)
  }
}
