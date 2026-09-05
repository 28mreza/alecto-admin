import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Injector,
  runInInjectionContext,
} from '@angular/core'
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'
import { RouterLink } from '@angular/router'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmInputImports } from '@spartan-ng/helm/input'
import { HlmLabelImports } from '@spartan-ng/helm/label'
import { HlmSelectImports } from '@spartan-ng/helm/select'
import { HlmTextareaImports } from '@spartan-ng/helm/textarea'
import { showSubmittedData } from '../../../shared/utils/show-submitted-data'

const URL_PATTERN = /^(https?:\/\/)[^\s/$.?#].[^\s]*$/i

const EMAIL_OPTIONS = ['m@example.com', 'm@google.com', 'm@support.com']

export interface ProfileFormValue {
  username: string
  email: string
  bio: string
  urls: string[]
}

/**
 * Profile form ported from
 * `shadcn-admin/src/features/settings/profile/profile-form.tsx`.
 * Reactive FormGroup with username/email/bio controls plus a urls FormArray.
 */
@Component({
  selector: 'app-profile-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    HlmButtonImports,
    HlmInputImports,
    HlmLabelImports,
    HlmSelectImports,
    HlmTextareaImports,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-8">
      <div class="grid gap-2">
        <label hlmLabel for="profile-username">Username</label>
        <input
          hlmInput
          id="profile-username"
          placeholder="shadcn"
          formControlName="username"
        />
        <p class="text-muted-foreground text-sm">
          This is your public display name. It can be your real name or a
          pseudonym. You can only change this once every 30 days.
        </p>
        @if (username.invalid && (username.touched || username.dirty)) {
          <p class="text-destructive text-sm">{{ usernameError }}</p>
        }
      </div>

      <div class="grid gap-2">
        <label hlmLabel for="profile-email">Email</label>
        <hlm-select formControlName="email" id="profile-email">
          <hlm-select-trigger>
            <hlm-select-value
              placeholder="Select a verified email to display"
            />
          </hlm-select-trigger>
          <hlm-select-content *hlmSelectPortal>
            @for (option of emailOptions; track option) {
              <hlm-select-item [value]="option">{{ option }}</hlm-select-item>
            }
          </hlm-select-content>
        </hlm-select>
        <p class="text-muted-foreground text-sm">
          You can manage verified email addresses in your
          <a routerLink="/" class="underline">email settings</a>.
        </p>
        @if (email.invalid && (email.touched || email.dirty)) {
          <p class="text-destructive text-sm">
            Please select an email to display.
          </p>
        }
      </div>

      <div class="grid gap-2">
        <label hlmLabel for="profile-bio">Bio</label>
        <textarea
          hlmTextarea
          id="profile-bio"
          placeholder="Tell us a little bit about yourself"
          class="resize-none"
          formControlName="bio"
        ></textarea>
        <p class="text-muted-foreground text-sm">
          You can <span>&#64;mention</span> other users and organizations to
          link to them.
        </p>
        @if (bio.invalid && (bio.touched || bio.dirty)) {
          <p class="text-destructive text-sm">{{ bioError }}</p>
        }
      </div>

      <div formArrayName="urls">
        @for (control of urls.controls; track $index; let i = $index) {
          <div class="grid gap-2">
            <label
              hlmLabel
              [class.sr-only]="i !== 0"
              [for]="'profile-url-' + i"
            >
              URLs
            </label>
            <p class="text-muted-foreground text-sm" [class.sr-only]="i !== 0">
              Add links to your website, blog, or social media profiles.
            </p>
            <input
              hlmInput
              [id]="'profile-url-' + i"
              [class.mt-1.5]="i !== 0"
              [formControlName]="i"
            />
            @if (control.invalid && (control.touched || control.dirty)) {
              <p class="text-destructive text-sm">Please enter a valid URL.</p>
            }
          </div>
        }
        <button
          hlmBtn
          type="button"
          variant="outline"
          size="sm"
          class="mt-2"
          (click)="addUrl()"
        >
          Add URL
        </button>
      </div>

      <button hlmBtn type="submit">Update profile</button>
    </form>
  `,
})
export class ProfileFormComponent {
  protected readonly emailOptions = EMAIL_OPTIONS

  private readonly injector = inject(Injector)

  readonly form = new FormGroup({
    username: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(30),
      ],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    bio: new FormControl('I own a computer.', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(160),
      ],
    }),
    urls: new FormArray([
      new FormControl('https://shadcn.com', {
        nonNullable: true,
        validators: [Validators.required, Validators.pattern(URL_PATTERN)],
      }),
      new FormControl('http://twitter.com/shadcn', {
        nonNullable: true,
        validators: [Validators.required, Validators.pattern(URL_PATTERN)],
      }),
    ]),
  })

  get username(): FormControl<string> {
    return this.form.controls.username
  }

  get email(): FormControl<string> {
    return this.form.controls.email
  }

  get bio(): FormControl<string> {
    return this.form.controls.bio
  }

  get urls(): FormArray<FormControl<string>> {
    return this.form.controls.urls
  }

  protected get usernameError(): string {
    if (this.username.hasError('required')) return 'Please enter your username.'
    if (this.username.hasError('minlength'))
      return 'Username must be at least 2 characters.'
    return 'Username must not be longer than 30 characters.'
  }

  protected get bioError(): string {
    if (this.bio.hasError('required')) return 'Please enter your bio.'
    if (this.bio.hasError('minlength'))
      return 'Bio must be at least 4 characters.'
    return 'Bio must not be longer than 160 characters.'
  }

  protected addUrl(): void {
    this.urls.push(
      new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.pattern(URL_PATTERN)],
      })
    )
  }

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      return
    }
    const value = this.form.getRawValue()
    const data: ProfileFormValue = {
      username: value.username,
      email: value.email,
      bio: value.bio,
      urls: value.urls,
    }
    // showSubmittedData() injects ToastService, so it must run inside an
    // injection context (submit handlers are not one).
    runInInjectionContext(this.injector, () => showSubmittedData(data))
  }
}
