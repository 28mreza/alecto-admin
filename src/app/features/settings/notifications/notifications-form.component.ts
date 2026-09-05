import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Injector,
  runInInjectionContext,
} from '@angular/core'
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'
import { RouterLink } from '@angular/router'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox'
import { HlmLabelImports } from '@spartan-ng/helm/label'
import { HlmRadioGroupImports } from '@spartan-ng/helm/radio-group'
import { HlmSwitchImports } from '@spartan-ng/helm/switch'
import { showSubmittedData } from '../../../shared/utils/show-submitted-data'

type NotificationType = 'all' | 'mentions' | 'none'

/**
 * Notifications form ported from
 * `shadcn-admin/src/features/settings/notifications/notifications-form.tsx`.
 * Notify-about radio group, four email-notification switches (security is
 * read-only) and a mobile-settings checkbox.
 */
@Component({
  selector: 'app-notifications-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    HlmButtonImports,
    HlmCheckboxImports,
    HlmLabelImports,
    HlmRadioGroupImports,
    HlmSwitchImports,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-8">
      <div class="relative space-y-3">
        <span hlmLabel>Notify me about...</span>
        <hlm-radio-group formControlName="type" class="flex flex-col gap-2">
          <div class="flex items-center">
            <hlm-radio inputId="notifications-type-all" value="all">
              <hlm-radio-indicator />
            </hlm-radio>
            <label hlmLabel for="notifications-type-all" class="font-normal">
              All new messages
            </label>
          </div>
          <div class="flex items-center">
            <hlm-radio inputId="notifications-type-mentions" value="mentions">
              <hlm-radio-indicator />
            </hlm-radio>
            <label
              hlmLabel
              for="notifications-type-mentions"
              class="font-normal"
            >
              Direct messages and mentions
            </label>
          </div>
          <div class="flex items-center">
            <hlm-radio inputId="notifications-type-none" value="none">
              <hlm-radio-indicator />
            </hlm-radio>
            <label hlmLabel for="notifications-type-none" class="font-normal">
              Nothing
            </label>
          </div>
        </hlm-radio-group>
        @if (type.invalid && (type.touched || type.dirty)) {
          <p class="text-destructive text-sm">
            Please select a notification type.
          </p>
        }
      </div>

      <div class="relative">
        <h3 class="mb-4 text-lg font-medium">Email Notifications</h3>
        <div class="space-y-4">
          <div
            class="flex flex-row items-center justify-between rounded-lg border p-4"
          >
            <div class="space-y-0.5">
              <label
                hlmLabel
                for="notifications-communication"
                class="text-base"
              >
                Communication emails
              </label>
              <p class="text-muted-foreground text-sm">
                Receive emails about your account activity.
              </p>
            </div>
            <hlm-switch
              inputId="notifications-communication"
              formControlName="communication_emails"
            />
          </div>
          <div
            class="flex flex-row items-center justify-between rounded-lg border p-4"
          >
            <div class="space-y-0.5">
              <label hlmLabel for="notifications-marketing" class="text-base">
                Marketing emails
              </label>
              <p class="text-muted-foreground text-sm">
                Receive emails about new products, features, and more.
              </p>
            </div>
            <hlm-switch
              inputId="notifications-marketing"
              formControlName="marketing_emails"
            />
          </div>
          <div
            class="flex flex-row items-center justify-between rounded-lg border p-4"
          >
            <div class="space-y-0.5">
              <label hlmLabel for="notifications-social" class="text-base">
                Social emails
              </label>
              <p class="text-muted-foreground text-sm">
                Receive emails for friend requests, follows, and more.
              </p>
            </div>
            <hlm-switch
              inputId="notifications-social"
              formControlName="social_emails"
            />
          </div>
          <div
            class="flex flex-row items-center justify-between rounded-lg border p-4"
          >
            <div class="space-y-0.5">
              <label hlmLabel for="notifications-security" class="text-base">
                Security emails
              </label>
              <p class="text-muted-foreground text-sm">
                Receive emails about your account activity and security.
              </p>
            </div>
            <hlm-switch
              inputId="notifications-security"
              formControlName="security_emails"
              aria-readonly="true"
            />
          </div>
        </div>
      </div>

      <div class="relative flex flex-row items-start">
        <hlm-checkbox inputId="notifications-mobile" formControlName="mobile" />
        <div class="space-y-1 leading-none">
          <label hlmLabel for="notifications-mobile">
            Use different settings for my mobile devices
          </label>
          <p class="text-muted-foreground text-sm">
            You can manage your mobile notifications in the
            <a
              routerLink="/settings"
              class="underline decoration-dashed underline-offset-4 hover:decoration-solid"
            >
              mobile settings
            </a>
            page.
          </p>
        </div>
      </div>

      <button hlmBtn type="submit">Update notifications</button>
    </form>
  `,
})
export class NotificationsFormComponent {
  private readonly injector = inject(Injector)

  readonly form = new FormGroup({
    type: new FormControl<NotificationType | null>(null, {
      validators: [Validators.required],
    }),
    mobile: new FormControl(false, { nonNullable: true }),
    communication_emails: new FormControl(false, { nonNullable: true }),
    marketing_emails: new FormControl(false, { nonNullable: true }),
    social_emails: new FormControl(true, { nonNullable: true }),
    security_emails: new FormControl(
      { value: true, disabled: true },
      {
        nonNullable: true,
      }
    ),
  })

  get type(): FormControl<NotificationType | null> {
    return this.form.controls.type
  }

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      return
    }
    // showSubmittedData() injects ToastService, so it must run inside an
    // injection context (submit handlers are not one).
    runInInjectionContext(this.injector, () =>
      showSubmittedData(this.form.getRawValue())
    )
  }
}
