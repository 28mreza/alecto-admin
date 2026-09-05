import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  Injector,
  input,
  output,
  runInInjectionContext,
} from '@angular/core'
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucideMailPlus, lucideSend } from '@ng-icons/lucide'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmDialogImports } from '@spartan-ng/helm/dialog'
import { HlmInputImports } from '@spartan-ng/helm/input'
import { HlmLabelImports } from '@spartan-ng/helm/label'
import { HlmSelectImports } from '@spartan-ng/helm/select'
import { HlmTextareaImports } from '@spartan-ng/helm/textarea'
import type { BrnDialogState } from '@spartan-ng/brain/dialog'
import { showSubmittedData } from '../../../shared/utils/show-submitted-data'
import { roles } from '../data/data'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export interface UserInviteValue {
  email: string
  role: string
  desc: string
}

/**
 * Pure invite-form validation (mirrors the source zod schema in
 * `users-invite-dialog.tsx`: email required + valid, role required, desc
 * optional). Exported for focused unit tests.
 */
export function validateUserInvite(value: UserInviteValue): {
  email?: string
  role?: string
} {
  const errors: { email?: string; role?: string } = {}
  if (!value.email.trim()) {
    errors.email = 'Please enter an email to invite.'
  } else if (!EMAIL_PATTERN.test(value.email.trim())) {
    errors.email = 'Please enter a valid email address.'
  }
  if (!value.role) {
    errors.role = 'Role is required.'
  }
  return errors
}

/**
 * Invite-user dialog.
 *
 * Ported from `users-invite-dialog.tsx`: `sm:max-w-md` dialog with a
 * MailPlus title, email + role (hlm-select as the SelectDropdown
 * equivalent) + optional description fields, and Cancel + Invite/Send
 * footer actions. Submit toasts the values and closes.
 */
@Component({
  selector: 'app-users-invite-dialog',
  standalone: true,
  imports: [
    NgIcon,
    ReactiveFormsModule,
    HlmButtonImports,
    HlmDialogImports,
    HlmInputImports,
    HlmLabelImports,
    HlmSelectImports,
    HlmTextareaImports,
  ],
  providers: [provideIcons({ lucideMailPlus, lucideSend })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <hlm-dialog
      [state]="open() ? 'open' : 'closed'"
      (stateChanged)="onStateChanged($event)"
    >
      <hlm-dialog-content *hlmDialogPortal class="sm:max-w-md">
        <div hlmDialogHeader class="text-start">
          <h2 hlmDialogTitle class="flex items-center gap-2">
            <ng-icon name="lucideMailPlus" aria-hidden="true" />
            Invite User
          </h2>
          <p hlmDialogDescription>
            Invite new user to join your team by sending them an email
            invitation. Assign a role to define their access level.
          </p>
        </div>
        <form
          id="user-invite-form"
          [formGroup]="form"
          (ngSubmit)="onSubmit()"
          class="space-y-4"
        >
          <div class="grid gap-2">
            <label hlmLabel for="user-invite-email">Email</label>
            <input
              hlmInput
              id="user-invite-email"
              type="email"
              placeholder="eg: john.doe@gmail.com"
              formControlName="email"
            />
            @if (email.invalid && (email.touched || email.dirty)) {
              <p class="text-destructive text-sm">{{ emailError() }}</p>
            }
          </div>
          <div class="grid gap-2">
            <label hlmLabel for="user-invite-role">Role</label>
            <hlm-select formControlName="role" id="user-invite-role">
              <hlm-select-trigger>
                <hlm-select-value placeholder="Select a role" />
              </hlm-select-trigger>
              <hlm-select-content *hlmSelectPortal>
                @for (role of roles; track role.value) {
                  <hlm-select-item [value]="role.value">
                    {{ role.label }}
                  </hlm-select-item>
                }
              </hlm-select-content>
            </hlm-select>
            @if (role.invalid && (role.touched || role.dirty)) {
              <p class="text-destructive text-sm">Role is required.</p>
            }
          </div>
          <div class="grid gap-2">
            <label hlmLabel for="user-invite-desc">
              Description (optional)
            </label>
            <textarea
              hlmTextarea
              id="user-invite-desc"
              class="resize-none"
              placeholder="Add a personal note to your invitation (optional)"
              formControlName="desc"
            ></textarea>
          </div>
        </form>
        <div hlmDialogFooter class="gap-y-2">
          <button hlmBtn variant="outline" type="button" hlmDialogClose>
            Cancel
          </button>
          <button hlmBtn type="submit" form="user-invite-form">
            Invite
            <ng-icon name="lucideSend" aria-hidden="true" />
          </button>
        </div>
      </hlm-dialog-content>
    </hlm-dialog>
  `,
})
export class UsersInviteDialogComponent {
  readonly open = input(false)
  readonly closed = output<void>()

  protected readonly roles = roles

  private readonly injector = inject(Injector)

  readonly form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(EMAIL_PATTERN)],
    }),
    role: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    desc: new FormControl('', { nonNullable: true }),
  })

  constructor() {
    // Mirror the source dialog's `form.reset()` on open-change.
    effect(() => {
      this.open()
      this.form.reset({ email: '', role: '', desc: '' })
    })
  }

  get email(): FormControl<string> {
    return this.form.controls.email
  }

  get role(): FormControl<string> {
    return this.form.controls.role
  }

  protected emailError(): string {
    if (this.email.hasError('required')) {
      return 'Please enter an email to invite.'
    }
    return 'Please enter a valid email address.'
  }

  protected onStateChanged(state: BrnDialogState): void {
    if (state === 'closed') this.closed.emit()
  }

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      return
    }
    const value = this.form.getRawValue()
    // showSubmittedData() injects ToastService, so it must run inside an
    // injection context (submit handlers are not one).
    runInInjectionContext(this.injector, () => showSubmittedData(value))
    this.form.reset({ email: '', role: '', desc: '' })
    this.closed.emit()
  }
}
