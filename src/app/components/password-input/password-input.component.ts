import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  input,
  signal,
} from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucideEye, lucideEyeOff } from '@ng-icons/lucide'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmInputImports } from '@spartan-ng/helm/input'
import { cn } from '../../shared/utils/cn'

/**
 * Password input with a show/hide toggle.
 *
 * Ported from `shadcn-admin/src/components/password-input.tsx` and shared
 * (Task 23 will reuse it): an `hlm-input` of type password/text with an
 * Eye/EyeOff ghost button. Implements `ControlValueAccessor` (registered
 * via `NG_VALUE_ACCESSOR`) so `formControlName="password"` works directly
 * in Reactive Forms; a plain `disabled` input mirrors the attribute for
 * template-driven `[disabled]` uses (e.g. the users action dialog disables
 * "Confirm Password" until the password is touched). The toggle button is
 * `type="button"` so it never submits the surrounding form.
 */
@Component({
  selector: 'app-password-input',
  standalone: true,
  imports: [NgIcon, HlmButtonImports, HlmInputImports],
  providers: [
    provideIcons({ lucideEye, lucideEyeOff }),
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PasswordInputComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="wrapperClass()">
      <input
        hlmInput
        [type]="showPassword() ? 'text' : 'password'"
        [value]="value()"
        [placeholder]="placeholder()"
        [disabled]="isDisabled()"
        (input)="onInput($event)"
        (blur)="onTouched()"
      />
      <button
        hlmBtn
        type="button"
        size="icon"
        variant="ghost"
        [disabled]="isDisabled()"
        class="text-muted-foreground absolute inset-e-1 top-1/2 h-6 w-6 -translate-y-1/2 rounded-md"
        (click)="toggleVisibility()"
      >
        <ng-icon
          [name]="showPassword() ? 'lucideEye' : 'lucideEyeOff'"
          aria-hidden="true"
          class="size-[18px]"
        />
        <span class="sr-only">
          {{ showPassword() ? 'Hide password' : 'Show password' }}
        </span>
      </button>
    </div>
  `,
})
export class PasswordInputComponent implements ControlValueAccessor {
  readonly placeholder = input('')
  readonly className = input('')
  /** Template-driven disabled flag (mirrors the native attribute). */
  readonly disabled = input(false)

  protected readonly value = signal('')
  protected readonly showPassword = signal(false)
  protected readonly controlDisabled = signal(false)

  protected isDisabled(): boolean {
    return this.disabled() || this.controlDisabled()
  }

  protected wrapperClass(): string {
    return cn('relative rounded-md', this.className())
  }

  private onChange: (value: string) => void = () => undefined
  protected onTouched: () => void = () => undefined

  writeValue(value: string | null): void {
    this.value.set(value ?? '')
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn
  }

  setDisabledState(disabled: boolean): void {
    this.controlDisabled.set(disabled)
  }

  protected onInput(event: Event): void {
    const target = event.target as HTMLInputElement | null
    const next = target?.value ?? ''
    this.value.set(next)
    this.onChange(next)
  }

  protected toggleVisibility(): void {
    this.showPassword.update((visible) => !visible)
  }
}
