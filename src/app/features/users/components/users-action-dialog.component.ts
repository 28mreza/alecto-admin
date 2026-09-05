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
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmDialogImports } from '@spartan-ng/helm/dialog'
import { HlmInputImports } from '@spartan-ng/helm/input'
import { HlmLabelImports } from '@spartan-ng/helm/label'
import { HlmSelectImports } from '@spartan-ng/helm/select'
import type { BrnDialogState } from '@spartan-ng/brain/dialog'
import { PasswordInputComponent } from '../../../components/password-input/password-input.component'
import { showSubmittedData } from '../../../shared/utils/show-submitted-data'
import { roles } from '../data/data'
import type { User } from '../data/schema'
import { UsersStoreService } from '../store/users-store.service'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Password-rule validation for the add/edit user form.
 *
 * Mirrors the refine chain of the source zod schema in
 * `users-action-dialog.tsx`: on add (`isEdit: false`) the password is
 * required, min 8 chars, must contain a lowercase letter and a number, and
 * must match the confirmation; on edit an empty password skips every rule.
 * Exported as pure helpers for focused unit tests.
 */
export function validateUserPassword(
  password: string,
  isEdit: boolean
): string | null {
  const value = password.trim()
  if (isEdit && !value) return null
  if (!value) return 'Password is required.'
  if (value.length < 8) return 'Password must be at least 8 characters long.'
  if (!/[a-z]/.test(value)) {
    return 'Password must contain at least one lowercase letter.'
  }
  if (!/\d/.test(value)) return 'Password must contain at least one number.'
  return null
}

export function validateUserConfirmPassword(
  password: string,
  confirmPassword: string,
  isEdit: boolean
): string | null {
  if (isEdit && !password.trim()) return null
  if (password.trim() !== confirmPassword.trim()) {
    return "Passwords don't match."
  }
  return null
}

/** Group-level validator wiring the password rules into Reactive Forms. */
export function userPasswordGroupValidator(
  group: AbstractControl
): ValidationErrors | null {
  const isEdit = (group.get('isEdit')?.value ?? false) === true
  const password = String(group.get('password')?.value ?? '')
  const confirmPassword = String(group.get('confirmPassword')?.value ?? '')
  const passwordError = validateUserPassword(password, isEdit)
  const confirmError = validateUserConfirmPassword(
    password,
    confirmPassword,
    isEdit
  )
  if (!passwordError && !confirmError) return null
  return {
    ...(passwordError ? { password: passwordError } : null),
    ...(confirmError ? { confirmPassword: confirmError } : null),
  }
}

/**
 * Add/edit user dialog.
 *
 * Ported from `users-action-dialog.tsx` (read in full, incl. the form
 * layout past line 121): `sm:max-w-lg` dialog with the grid-laid-out
 * firstName/lastName/username/email/phoneNumber/role/password/
 * confirmPassword fields, hlm-select as the SelectDropdown equivalent and
 * the shared `app-password-input` for both password fields ("Confirm
 * Password" stays disabled until the password is touched, as in the
 * source). Add submits via `store.addUser`, edit via `store.updateUser`;
 * both toast the submitted values and close.
 */
@Component({
  selector: 'app-users-action-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HlmButtonImports,
    HlmDialogImports,
    HlmInputImports,
    HlmLabelImports,
    HlmSelectImports,
    PasswordInputComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <hlm-dialog
      [state]="open() ? 'open' : 'closed'"
      (stateChanged)="onStateChanged($event)"
    >
      <hlm-dialog-content *hlmDialogPortal class="sm:max-w-lg">
        <div hlmDialogHeader class="text-start">
          <h2 hlmDialogTitle>{{ isEdit ? 'Edit User' : 'Add New User' }}</h2>
          <p hlmDialogDescription>
            {{ isEdit ? 'Update the user here. ' : 'Create new user here. ' }}
            Click save when you&apos;re done.
          </p>
        </div>
        <div class="h-105 w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3">
          <form
            id="user-form"
            [formGroup]="form"
            (ngSubmit)="onSubmit()"
            class="space-y-4 px-0.5"
          >
            <div
              class="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1"
            >
              <label hlmLabel for="user-first-name" class="col-span-2 text-end">
                First Name
              </label>
              <input
                hlmInput
                id="user-first-name"
                placeholder="John"
                class="col-span-4"
                autocomplete="off"
                formControlName="firstName"
              />
              @if (showError('firstName')) {
                <p class="text-destructive col-span-4 col-start-3 text-sm">
                  First Name is required.
                </p>
              }
            </div>
            <div
              class="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1"
            >
              <label hlmLabel for="user-last-name" class="col-span-2 text-end">
                Last Name
              </label>
              <input
                hlmInput
                id="user-last-name"
                placeholder="Doe"
                class="col-span-4"
                autocomplete="off"
                formControlName="lastName"
              />
              @if (showError('lastName')) {
                <p class="text-destructive col-span-4 col-start-3 text-sm">
                  Last Name is required.
                </p>
              }
            </div>
            <div
              class="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1"
            >
              <label hlmLabel for="user-username" class="col-span-2 text-end">
                Username
              </label>
              <input
                hlmInput
                id="user-username"
                placeholder="john_doe"
                class="col-span-4"
                formControlName="username"
              />
              @if (showError('username')) {
                <p class="text-destructive col-span-4 col-start-3 text-sm">
                  Username is required.
                </p>
              }
            </div>
            <div
              class="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1"
            >
              <label hlmLabel for="user-email" class="col-span-2 text-end">
                Email
              </label>
              <input
                hlmInput
                id="user-email"
                placeholder="john.doe@gmail.com"
                class="col-span-4"
                formControlName="email"
              />
              @if (showError('email')) {
                <p class="text-destructive col-span-4 col-start-3 text-sm">
                  {{ emailError() }}
                </p>
              }
            </div>
            <div
              class="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1"
            >
              <label hlmLabel for="user-phone" class="col-span-2 text-end">
                Phone Number
              </label>
              <input
                hlmInput
                id="user-phone"
                placeholder="+123456789"
                class="col-span-4"
                formControlName="phoneNumber"
              />
              @if (showError('phoneNumber')) {
                <p class="text-destructive col-span-4 col-start-3 text-sm">
                  Phone number is required.
                </p>
              }
            </div>
            <div
              class="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1"
            >
              <label hlmLabel for="user-role" class="col-span-2 text-end">
                Role
              </label>
              <hlm-select
                formControlName="role"
                id="user-role"
                class="col-span-4"
              >
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
              @if (showError('role')) {
                <p class="text-destructive col-span-4 col-start-3 text-sm">
                  Role is required.
                </p>
              }
            </div>
            <div
              class="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1"
            >
              <label hlmLabel for="user-password" class="col-span-2 text-end">
                Password
              </label>
              <app-password-input
                className="col-span-4"
                placeholder="e.g., S3cur3P@ssw0rd"
                formControlName="password"
              />
              @if (passwordGroupError(); as message) {
                <p class="text-destructive col-span-4 col-start-3 text-sm">
                  {{ message }}
                </p>
              }
            </div>
            <div
              class="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1"
            >
              <label hlmLabel for="user-confirm" class="col-span-2 text-end">
                Confirm Password
              </label>
              <app-password-input
                className="col-span-4"
                placeholder="e.g., S3cur3P@ssw0rd"
                formControlName="confirmPassword"
                [disabled]="!isPasswordTouched()"
              />
              @if (confirmGroupError(); as message) {
                <p class="text-destructive col-span-4 col-start-3 text-sm">
                  {{ message }}
                </p>
              }
            </div>
          </form>
        </div>
        <div hlmDialogFooter>
          <button hlmBtn type="submit" form="user-form">Save changes</button>
        </div>
      </hlm-dialog-content>
    </hlm-dialog>
  `,
})
export class UsersActionDialogComponent {
  readonly open = input(false)
  readonly currentRow = input<User | null>(null)
  readonly closed = output<void>()

  protected readonly roles = roles

  private readonly store = inject(UsersStoreService)
  private readonly injector = inject(Injector)

  readonly form = new FormGroup(
    {
      firstName: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      lastName: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      username: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      email: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.pattern(EMAIL_PATTERN)],
      }),
      phoneNumber: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      role: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      password: new FormControl('', { nonNullable: true }),
      confirmPassword: new FormControl('', { nonNullable: true }),
      isEdit: new FormControl(false, { nonNullable: true }),
    },
    { validators: [userPasswordGroupValidator] }
  )

  constructor() {
    // Reset the form whenever the edited row changes or the dialog opens,
    // mirroring the source dialog's `form.reset()` on open-change.
    effect(() => {
      const row = this.currentRow()
      this.open()
      this.form.reset({
        firstName: row?.firstName ?? '',
        lastName: row?.lastName ?? '',
        username: row?.username ?? '',
        email: row?.email ?? '',
        phoneNumber: row?.phoneNumber ?? '',
        role: row?.role ?? '',
        password: '',
        confirmPassword: '',
        isEdit: row !== null,
      })
    })
  }

  protected get isEdit(): boolean {
    return this.currentRow() !== null
  }

  protected isPasswordTouched(): boolean {
    const control = this.form.controls.password
    return control.dirty || control.touched || control.value !== ''
  }

  protected showError(
    name:
      'firstName' | 'lastName' | 'username' | 'email' | 'phoneNumber' | 'role'
  ): boolean {
    const control = this.form.controls[name]
    return control.invalid && (control.touched || control.dirty)
  }

  protected emailError(): string {
    if (this.form.controls.email.hasError('required')) {
      return 'Email is required.'
    }
    return 'Please enter a valid email address.'
  }

  protected passwordGroupError(): string | null {
    const errors = this.form.errors
    if (!errors || typeof errors['password'] !== 'string') return null
    const control = this.form.controls.password
    return control.touched || control.dirty || this.form.touched
      ? (errors['password'] as string)
      : null
  }

  protected confirmGroupError(): string | null {
    const errors = this.form.errors
    if (!errors || typeof errors['confirmPassword'] !== 'string') return null
    const control = this.form.controls.confirmPassword
    return control.touched || control.dirty || this.form.touched
      ? (errors['confirmPassword'] as string)
      : null
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
    const row = this.currentRow()
    if (row) {
      this.store.updateUser(row.id, {
        firstName: value.firstName,
        lastName: value.lastName,
        username: value.username,
        email: value.email,
        phoneNumber: value.phoneNumber,
        role: value.role as User['role'],
      })
    } else {
      this.store.addUser({
        firstName: value.firstName,
        lastName: value.lastName,
        username: value.username,
        email: value.email,
        phoneNumber: value.phoneNumber,
        status: 'active',
        role: value.role as User['role'],
      })
    }
    // showSubmittedData() injects ToastService, so it must run inside an
    // injection context (submit handlers are not one).
    runInInjectionContext(this.injector, () =>
      showSubmittedData({ ...value, password: '***', confirmPassword: '***' })
    )
    this.closed.emit()
  }
}
