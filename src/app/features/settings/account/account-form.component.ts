import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Injector,
  runInInjectionContext,
  signal,
  viewChild,
} from '@angular/core'
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucideCheck, lucideChevronsUpDown } from '@ng-icons/lucide'
import { BrnPopover } from '@spartan-ng/brain/popover'
import type { BrnOverlayState } from '@spartan-ng/brain/overlay'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmCommandImports } from '@spartan-ng/helm/command'
import { HlmInputImports } from '@spartan-ng/helm/input'
import { HlmLabelImports } from '@spartan-ng/helm/label'
import { HlmPopoverImports } from '@spartan-ng/helm/popover'
import { showSubmittedData } from '../../../shared/utils/show-submitted-data'
import { DatePickerComponent } from '../../../components/date-picker/date-picker.component'

const LANGUAGES = [
  { label: 'English', value: 'en' },
  { label: 'French', value: 'fr' },
  { label: 'German', value: 'de' },
  { label: 'Spanish', value: 'es' },
  { label: 'Portuguese', value: 'pt' },
  { label: 'Russian', value: 'ru' },
  { label: 'Japanese', value: 'ja' },
  { label: 'Korean', value: 'ko' },
  { label: 'Chinese', value: 'zh' },
] as const

/**
 * Account form ported from
 * `shadcn-admin/src/features/settings/account/account-form.tsx`.
 * Name input, date-of-birth picker and a language combobox (popover +
 * command list).
 */
@Component({
  selector: 'app-account-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIcon,
    DatePickerComponent,
    HlmButtonImports,
    HlmCommandImports,
    HlmInputImports,
    HlmLabelImports,
    HlmPopoverImports,
  ],
  providers: [provideIcons({ lucideCheck, lucideChevronsUpDown })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-8">
      <div class="grid gap-2">
        <label hlmLabel for="account-name">Name</label>
        <input
          hlmInput
          id="account-name"
          placeholder="Your name"
          formControlName="name"
        />
        <p class="text-muted-foreground text-sm">
          This is the name that will be displayed on your profile and in emails.
        </p>
        @if (name.invalid && (name.touched || name.dirty)) {
          <p class="text-destructive text-sm">{{ nameError }}</p>
        }
      </div>

      <div class="flex flex-col gap-2">
        <label hlmLabel for="account-dob-trigger">Date of birth</label>
        <app-date-picker
          buttonId="account-dob-trigger"
          [selected]="dob.value ?? undefined"
          (selectedChange)="onDobChange($event)"
        />
        <p class="text-muted-foreground text-sm">
          Your date of birth is used to calculate your age.
        </p>
        @if (dob.invalid && (dob.touched || dob.dirty)) {
          <p class="text-destructive text-sm">
            Please select your date of birth.
          </p>
        }
      </div>

      <div class="flex flex-col gap-2">
        <label hlmLabel for="account-language-trigger">Language</label>
        <hlm-popover
          [state]="languagePopoverState()"
          (stateChanged)="languagePopoverState.set($event)"
        >
          <button
            hlmBtn
            hlmPopoverTrigger
            variant="outline"
            role="combobox"
            type="button"
            id="account-language-trigger"
            aria-controls="account-language-list"
            [attr.aria-expanded]="languagePopoverState() === 'open'"
            [class]="
              'w-50 justify-between' +
              (!language.value ? ' text-muted-foreground' : '')
            "
          >
            {{ languageLabel() }}
            <ng-icon
              name="lucideChevronsUpDown"
              aria-hidden="true"
              class="ms-2 h-4 w-4 shrink-0 opacity-50"
            />
          </button>
          <hlm-popover-content
            *hlmPopoverPortal
            id="account-language-list"
            class="w-50 p-0"
          >
            <hlm-command>
              <hlm-command-input placeholder="Search language..." />
              <div hlmCommandEmpty>No language found.</div>
              <div hlmCommandGroup>
                <div hlmCommandList>
                  @for (option of languages; track option.value) {
                    <button
                      hlmCommandItem
                      type="button"
                      [value]="option.label"
                      (selected)="selectLanguage(option.value)"
                    >
                      <ng-icon
                        name="lucideCheck"
                        aria-hidden="true"
                        [class]="
                          'size-4 ' +
                          (option.value === language.value
                            ? 'opacity-100'
                            : 'opacity-0')
                        "
                      />
                      {{ option.label }}
                    </button>
                  }
                </div>
              </div>
            </hlm-command>
          </hlm-popover-content>
        </hlm-popover>
        <p class="text-muted-foreground text-sm">
          This is the language that will be used in the dashboard.
        </p>
        @if (language.invalid && (language.touched || language.dirty)) {
          <p class="text-destructive text-sm">Please select a language.</p>
        }
      </div>

      <button hlmBtn type="submit">Update account</button>
    </form>
  `,
})
export class AccountFormComponent {
  protected readonly languages = LANGUAGES

  private readonly popover = viewChild(BrnPopover)

  private readonly injector = inject(Injector)

  protected readonly languagePopoverState = signal<BrnOverlayState | null>(null)

  readonly form = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(30),
      ],
    }),
    dob: new FormControl<Date | null>(null, {
      validators: [Validators.required],
    }),
    language: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  })

  get name(): FormControl<string> {
    return this.form.controls.name
  }

  get dob(): FormControl<Date | null> {
    return this.form.controls.dob
  }

  get language(): FormControl<string> {
    return this.form.controls.language
  }

  protected languageLabel(): string {
    return (
      LANGUAGES.find((option) => option.value === this.language.value)?.label ??
      'Select language'
    )
  }

  protected get nameError(): string {
    if (this.name.hasError('required')) return 'Please enter your name.'
    if (this.name.hasError('minlength'))
      return 'Name must be at least 2 characters.'
    return 'Name must not be longer than 30 characters.'
  }

  protected onDobChange(date: Date | undefined): void {
    this.dob.setValue(date ?? null)
    this.dob.markAsTouched()
  }

  selectLanguage(value: string): void {
    this.language.setValue(value)
    this.language.markAsTouched()
    this.popover()?.close()
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
