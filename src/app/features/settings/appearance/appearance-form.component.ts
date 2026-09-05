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
import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucideChevronDown } from '@ng-icons/lucide'
import { buttonVariants, HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmLabelImports } from '@spartan-ng/helm/label'
import { HlmRadioGroupImports } from '@spartan-ng/helm/radio-group'
import { showSubmittedData } from '../../../shared/utils/show-submitted-data'
import { fonts, type Font } from '../../../config/fonts'
import { FontService } from '../../../core/services/font.service'
import { ThemeService } from '../../../core/services/theme.service'

/**
 * Appearance form ported from
 * `shadcn-admin/src/features/settings/appearance/appearance-form.tsx`.
 * Font select (native select styled like an outline button) + theme
 * radio-group with Light/Dark visual preview cards. Submit persists via
 * FontService/ThemeService.
 */
@Component({
  selector: 'app-appearance-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIcon,
    HlmButtonImports,
    HlmLabelImports,
    HlmRadioGroupImports,
  ],
  providers: [provideIcons({ lucideChevronDown })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-8">
      <div class="grid gap-2">
        <label hlmLabel for="appearance-font">Font</label>
        <div class="relative w-max">
          <select
            id="appearance-font"
            formControlName="font"
            [class]="fontSelectClass"
          >
            @for (option of fontOptions; track option) {
              <option [value]="option">{{ option }}</option>
            }
          </select>
          <ng-icon
            name="lucideChevronDown"
            aria-hidden="true"
            class="absolute inset-e-3 top-2.5 h-4 w-4 opacity-50"
          />
        </div>
        <p class="text-muted-foreground font-manrope text-sm">
          Set the font you want to use in the dashboard.
        </p>
        @if (font.invalid && (font.touched || font.dirty)) {
          <p class="text-destructive text-sm">Please select a font.</p>
        }
      </div>

      <div class="grid gap-2">
        <span hlmLabel>Theme</span>
        <p class="text-muted-foreground text-sm">
          Select the theme for the dashboard.
        </p>
        @if (theme.invalid && (theme.touched || theme.dirty)) {
          <p class="text-destructive text-sm">Please select a theme.</p>
        }
        <hlm-radio-group
          formControlName="theme"
          class="grid max-w-md grid-cols-2 gap-8 pt-2"
        >
          <div>
            <label
              hlmLabel
              for="appearance-theme-light"
              class="[&:has([data-state=checked])>div]:border-primary"
            >
              <hlm-radio
                inputId="appearance-theme-light"
                value="light"
                class="sr-only"
              />
              <div
                class="border-muted hover:border-accent items-center rounded-md border-2 p-1"
              >
                <div class="space-y-2 rounded-sm bg-[#ecedef] p-2">
                  <div class="space-y-2 rounded-md bg-white p-2 shadow-xs">
                    <div class="h-2 w-20 rounded-lg bg-[#ecedef]"></div>
                    <div class="h-2 w-25 rounded-lg bg-[#ecedef]"></div>
                  </div>
                  <div
                    class="flex items-center space-x-2 rounded-md bg-white p-2 shadow-xs"
                  >
                    <div class="h-4 w-4 rounded-full bg-[#ecedef]"></div>
                    <div class="h-2 w-25 rounded-lg bg-[#ecedef]"></div>
                  </div>
                  <div
                    class="flex items-center space-x-2 rounded-md bg-white p-2 shadow-xs"
                  >
                    <div class="h-4 w-4 rounded-full bg-[#ecedef]"></div>
                    <div class="h-2 w-25 rounded-lg bg-[#ecedef]"></div>
                  </div>
                </div>
              </div>
              <span class="block w-full p-2 text-center font-normal">
                Light
              </span>
            </label>
          </div>
          <div>
            <label
              hlmLabel
              for="appearance-theme-dark"
              class="[&:has([data-state=checked])>div]:border-primary"
            >
              <hlm-radio
                inputId="appearance-theme-dark"
                value="dark"
                class="sr-only"
              />
              <div
                class="border-muted bg-popover hover:bg-accent hover:text-accent-foreground items-center rounded-md border-2 p-1"
              >
                <div class="space-y-2 rounded-sm bg-slate-950 p-2">
                  <div class="space-y-2 rounded-md bg-slate-800 p-2 shadow-xs">
                    <div class="h-2 w-20 rounded-lg bg-slate-400"></div>
                    <div class="h-2 w-25 rounded-lg bg-slate-400"></div>
                  </div>
                  <div
                    class="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-xs"
                  >
                    <div class="h-4 w-4 rounded-full bg-slate-400"></div>
                    <div class="h-2 w-25 rounded-lg bg-slate-400"></div>
                  </div>
                  <div
                    class="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-xs"
                  >
                    <div class="h-4 w-4 rounded-full bg-slate-400"></div>
                    <div class="h-2 w-25 rounded-lg bg-slate-400"></div>
                  </div>
                </div>
              </div>
              <span class="block w-full p-2 text-center font-normal">
                Dark
              </span>
            </label>
          </div>
        </hlm-radio-group>
      </div>

      <button hlmBtn type="submit">Update preferences</button>
    </form>
  `,
})
export class AppearanceFormComponent {
  private readonly fontService = inject(FontService)
  private readonly themeService = inject(ThemeService)
  private readonly injector = inject(Injector)

  protected readonly fontOptions = fonts

  protected readonly fontSelectClass =
    buttonVariants({ variant: 'outline' }) +
    ' w-50 appearance-none font-normal capitalize dark:bg-background dark:hover:bg-background'

  readonly form = new FormGroup({
    font: new FormControl<Font>(this.fontService.font(), {
      nonNullable: true,
      validators: [Validators.required],
    }),
    theme: new FormControl<'light' | 'dark'>(
      this.themeService.resolvedTheme(),
      {
        nonNullable: true,
        validators: [Validators.required],
      }
    ),
  })

  get font(): FormControl<Font> {
    return this.form.controls.font
  }

  get theme(): FormControl<'light' | 'dark'> {
    return this.form.controls.theme
  }

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      return
    }
    const value = this.form.getRawValue()
    if (value.font !== this.fontService.font()) {
      this.fontService.setFont(value.font)
    }
    if (value.theme !== this.themeService.resolvedTheme()) {
      this.themeService.setTheme(value.theme)
    }
    // showSubmittedData() injects ToastService, so it must run inside an
    // injection context (submit handlers are not one).
    runInInjectionContext(this.injector, () => showSubmittedData(value))
  }
}
