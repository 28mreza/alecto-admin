import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  signal,
} from '@angular/core'
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  type AbstractControl,
} from '@angular/forms'
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmCardImports } from '@spartan-ng/helm/card'
import { HlmDialogImports } from '@spartan-ng/helm/dialog'
import { HlmInputImports } from '@spartan-ng/helm/input'
import { HlmLabelImports } from '@spartan-ng/helm/label'
import { HlmSeparatorImports } from '@spartan-ng/helm/separator'
import { HlmSwitchImports } from '@spartan-ng/helm/switch'
import { HlmTabsImports } from '@spartan-ng/helm/tabs'
import { HlmTextareaImports } from '@spartan-ng/helm/textarea'
import { Subject, takeUntil } from 'rxjs'
import { PasswordInputComponent } from '../../components/password-input/password-input.component'
import { ToastService } from '../../core/services/toast.service'
import { sleep } from '../../shared/utils/sleep'
import { CountryCodeDialogComponent } from './country-code-dialog.component'
import { FileUploadFieldComponent } from './file-upload-field.component'
import { SearchSelectFieldComponent } from './search-select-field.component'
import {
  BANKS,
  CURRENCIES,
  DATA_CATEGORIES,
  DEFAULT_COUNTRY_DIAL,
  PROFILE_TYPES,
  RECIPIENT_TYPES,
  VENDOR_TYPES,
} from './registration-options'
import {
  emailValidator,
  passwordMatchGroupValidator,
  phoneValidator,
  requiredValidator,
  uploadValidator,
} from './registration-validators'

const DEFAULTS = {
  vendorType: 'ID_COMPANY',
  vendorProfile: {
    name: '',
    type: '',
    dataCategory: '',
    address: '',
    registrationEmail: '',
    password: '',
    confirmPassword: '',
    pic: { name: '', email: '', phoneCountryCode: DEFAULT_COUNTRY_DIAL, phoneNumber: '' },
  },
  bankAccount: {
    bankName: '',
    accountHolderName: '',
    accountNumber: '',
    currency: '',
    recipientType: '',
    bankDocument: null as File | null,
  },
  taxIdentification: {
    npwp: '',
    npwpName: '',
    useVendorNameAsNpwpName: false,
    npwpAddress: '',
    npwpDocument: null as File | null,
    sppkp: '',
    sppkpDocument: null as File | null,
  },
}

function fileSummary(file: File | null): { name: string; size: number; type: string } | null {
  if (!file) return null
  return { name: file.name, size: file.size, type: file.type }
}

interface PicControls {
  name: FormControl<string>
  email: FormControl<string>
  phoneCountryCode: FormControl<string>
  phoneNumber: FormControl<string>
}

interface VendorProfileControls {
  name: FormControl<string>
  type: FormControl<string>
  dataCategory: FormControl<string>
  address: FormControl<string>
  registrationEmail: FormControl<string>
  password: FormControl<string>
  confirmPassword: FormControl<string>
  pic: FormGroup<PicControls>
}

interface BankAccountControls {
  bankName: FormControl<string>
  accountHolderName: FormControl<string>
  accountNumber: FormControl<string>
  currency: FormControl<string>
  recipientType: FormControl<string>
  bankDocument: FormControl<File | null>
}

interface TaxIdentificationControls {
  npwp: FormControl<string>
  npwpName: FormControl<string>
  useVendorNameAsNpwpName: FormControl<boolean>
  npwpAddress: FormControl<string>
  npwpDocument: FormControl<File | null>
  sppkp: FormControl<string>
  sppkpDocument: FormControl<File | null>
}

/**
 * Public vendor-registration page (standalone route `/registration`).
 * Single reactive form split across three Helm cards; vendor-type tabs
 * switch the `vendorType` control without resetting the form.
 */
@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HlmAlertDialogImports,
    HlmButtonImports,
    HlmCardImports,
    HlmDialogImports,
    HlmInputImports,
    HlmLabelImports,
    HlmSeparatorImports,
    HlmSwitchImports,
    HlmTabsImports,
    HlmTextareaImports,
    PasswordInputComponent,
    FileUploadFieldComponent,
    CountryCodeDialogComponent,
    SearchSelectFieldComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="w-full px-4 py-8 sm:px-6 lg:px-8">
      <form [formGroup]="form" (ngSubmit)="onSubmit()" novalidate class="grid gap-4">
        <hlm-tabs
          [tab]="vendorType.value"
          (tabActivated)="vendorType.setValue($event)"
          class="space-y-4"
        >
          <hlm-tabs-list class="grid w-full grid-cols-1 sm:grid-cols-3">
            @for (t of vendorTypes; track t.value) {
              <button
                type="button"
                [hlmTabsTrigger]="t.value"
                data-testid="vendor-tab"
                class="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                {{ t.label }}
              </button>
            }
          </hlm-tabs-list>
        </hlm-tabs>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <section hlmCard formGroupName="vendorProfile">
            <div hlmCardHeader>
              <h2 hlmCardTitle class="text-center text-2xl">Vendor Profile</h2>
            </div>
            <div hlmCardContent class="grid gap-3">
              <div class="grid gap-2">
                <label hlmLabel for="reg-name">Vendor Name <span class="text-destructive" aria-hidden="true">*</span></label>
                <input hlmInput id="reg-name" formControlName="name" placeholder="Company or individual name" />
                <p class="text-muted-foreground text-xs">
                  Do not use PT/CV/UD for companies. Do not include titles for individuals.
                </p>
                @if (showError(vendorProfile.controls.name)) {
                  <p class="text-destructive text-sm">This field is required.</p>
                }
              </div>
              <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div class="grid gap-2">
                  <label hlmLabel for="reg-type">Vendor Type <span class="text-destructive" aria-hidden="true">*</span></label>
                  <app-search-select-field
                    formControlName="type"
                    [options]="profileTypes"
                    placeholder="Select vendor type"
                  />
                  @if (showError(vendorProfile.controls.type)) {
                    <p class="text-destructive text-sm">This field is required.</p>
                  }
                </div>
                <div class="grid gap-2">
                  <label hlmLabel for="reg-category">Data Category <span class="text-destructive" aria-hidden="true">*</span></label>
                  <app-search-select-field
                    formControlName="dataCategory"
                    [options]="dataCategories"
                    placeholder="Select data category"
                  />
                  @if (showError(vendorProfile.controls.dataCategory)) {
                    <p class="text-destructive text-sm">This field is required.</p>
                  }
                </div>
              </div>
              <div class="grid gap-2">
                <label hlmLabel for="reg-address">Address <span class="text-destructive" aria-hidden="true">*</span></label>
                <textarea hlmTextarea id="reg-address" formControlName="address" placeholder="Full address" class="resize-none"></textarea>
                @if (showError(vendorProfile.controls.address)) {
                  <p class="text-destructive text-sm">This field is required.</p>
                }
              </div>
              <div class="grid gap-2">
                <label hlmLabel for="reg-email">Registration Email <span class="text-destructive" aria-hidden="true">*</span></label>
                <input hlmInput id="reg-email" type="email" formControlName="registrationEmail" placeholder="name@example.com" />
                <p class="text-muted-foreground text-xs">
                  This email will be used for all registration notifications.
                </p>
                @if (showError(vendorProfile.controls.registrationEmail)) {
                  <p class="text-destructive text-sm">{{ vendorProfile.controls.registrationEmail.errors?.['email'] ?? 'This field is required.' }}</p>
                }
              </div>
              <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div class="grid gap-2">
                  <label hlmLabel for="reg-password">Password <span class="text-destructive" aria-hidden="true">*</span></label>
                  <app-password-input formControlName="password" placeholder="Minimum 7 characters" />
                  @if (showError(vendorProfile.controls.password)) {
                    <p class="text-destructive text-sm">Password must be at least 7 characters.</p>
                  }
                </div>
                <div class="grid gap-2">
                  <label hlmLabel for="reg-confirm">Confirm Password <span class="text-destructive" aria-hidden="true">*</span></label>
                  <app-password-input formControlName="confirmPassword" placeholder="Repeat password" />
                  @if (confirmError(); as message) {
                    <p class="text-destructive text-sm">{{ message }}</p>
                  }
                </div>
              </div>
              <div class="flex items-center gap-3 pt-1">
                <h3 class="text-sm font-semibold whitespace-nowrap">PIC Information</h3>
                <div hlmSeparator class="flex-1"></div>
              </div>
              <div formGroupName="pic" class="grid gap-3">
                <div class="grid gap-2">
                  <label hlmLabel for="reg-pic-name">PIC Name <span class="text-destructive" aria-hidden="true">*</span></label>
                  <input hlmInput id="reg-pic-name" formControlName="name" placeholder="Person in charge" />
                  @if (showError(pic.controls.name)) {
                    <p class="text-destructive text-sm">This field is required.</p>
                  }
                </div>
                <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div class="grid gap-2">
                    <label hlmLabel for="reg-pic-email">PIC Email <span class="text-destructive" aria-hidden="true">*</span></label>
                    <input hlmInput id="reg-pic-email" type="email" formControlName="email" placeholder="pic@example.com" />
                    @if (showError(pic.controls.email)) {
                      <p class="text-destructive text-sm">{{ pic.controls.email.errors?.['email'] ?? 'This field is required.' }}</p>
                    }
                  </div>
                  <div class="grid gap-2">
                    <label hlmLabel for="reg-pic-phone">PIC Phone <span class="text-destructive" aria-hidden="true">*</span></label>
                    <div class="flex gap-2">
                      <hlm-dialog>
                        <button hlmDialogTrigger hlmBtn type="button" variant="outline">
                          {{ pic.controls.phoneCountryCode.value || '+62' }}
                        </button>
                        <hlm-dialog-content *hlmDialogPortal>
                          <app-country-code-dialog
                            [selectedDial]="pic.controls.phoneCountryCode.value"
                            (picked)="onCountryPicked($event)"
                          />
                        </hlm-dialog-content>
                      </hlm-dialog>
                      <input hlmInput id="reg-pic-phone" formControlName="phoneNumber" placeholder="8123456789" class="flex-1" />
                    </div>
                    @if (showError(pic.controls.phoneNumber)) {
                      <p class="text-destructive text-sm">Enter a valid phone number.</p>
                    }
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section hlmCard formGroupName="bankAccount">
            <div hlmCardHeader>
              <h2 hlmCardTitle class="text-center text-2xl">Bank Account</h2>
            </div>
            <div hlmCardContent class="grid gap-3">
              <div class="grid gap-2">
                <label hlmLabel for="reg-bank">Bank Name <span class="text-destructive" aria-hidden="true">*</span></label>
                <app-search-select-field
                  formControlName="bankName"
                  [options]="banks"
                  placeholder="Select bank"
                />
                @if (showError(bankAccount.controls.bankName)) {
                  <p class="text-destructive text-sm">This field is required.</p>
                }
              </div>
              <div class="grid gap-2">
                <label hlmLabel for="reg-holder">Account Holder Name <span class="text-destructive" aria-hidden="true">*</span></label>
                <input hlmInput id="reg-holder" formControlName="accountHolderName" placeholder="As printed on the account" />
                <p class="text-muted-foreground text-xs">
                  Must match the name registered at the bank.
                </p>
                @if (showError(bankAccount.controls.accountHolderName)) {
                  <p class="text-destructive text-sm">This field is required.</p>
                }
              </div>
              <div class="grid gap-2">
                <label hlmLabel for="reg-account">Account Number <span class="text-destructive" aria-hidden="true">*</span></label>
                <input hlmInput id="reg-account" formControlName="accountNumber" placeholder="Account number" />
                @if (showError(bankAccount.controls.accountNumber)) {
                  <p class="text-destructive text-sm">This field is required.</p>
                }
              </div>
              <div class="grid gap-2">
                <label hlmLabel for="reg-currency">Currency <span class="text-destructive" aria-hidden="true">*</span></label>
                <app-search-select-field
                  formControlName="currency"
                  [options]="currencies"
                  placeholder="Select currency"
                />
                @if (showError(bankAccount.controls.currency)) {
                  <p class="text-destructive text-sm">This field is required.</p>
                }
              </div>
              <div class="grid gap-2">
                <label hlmLabel for="reg-recipient">Recipient Type <span class="text-destructive" aria-hidden="true">*</span></label>
                <app-search-select-field
                  formControlName="recipientType"
                  [options]="recipientTypes"
                  placeholder="Select recipient type"
                />
                @if (showError(bankAccount.controls.recipientType)) {
                  <p class="text-destructive text-sm">This field is required.</p>
                }
              </div>
              <app-file-upload-field
                formControlName="bankDocument"
                label="Bank Statement"
                hint="Accepted: JPG, PNG, PDF. Max 5 MB."
                [required]="true"
              >
                @if (showError(bankAccount.controls.bankDocument)) {
                  <p class="text-destructive text-sm">{{ bankAccount.controls.bankDocument.errors?.['upload'] ?? 'This field is required.' }}</p>
                }
              </app-file-upload-field>
            </div>
          </section>

          <section hlmCard formGroupName="taxIdentification">
            <div hlmCardHeader>
              <h2 hlmCardTitle class="text-center text-2xl">Tax Identification</h2>
            </div>
            <div hlmCardContent class="grid gap-3">
              <div class="grid gap-2">
                <label hlmLabel for="reg-npwp">NPWP Number <span class="text-destructive" aria-hidden="true">*</span></label>
                <input hlmInput id="reg-npwp" formControlName="npwp" placeholder="NPWP number" />
                @if (showError(taxIdentification.controls.npwp)) {
                  <p class="text-destructive text-sm">This field is required.</p>
                }
              </div>
              <div class="grid gap-2">
                <label hlmLabel for="reg-npwp-name">NPWP Name <span class="text-destructive" aria-hidden="true">*</span></label>
                <input hlmInput id="reg-npwp-name" formControlName="npwpName" placeholder="Name on NPWP" />
                @if (showError(taxIdentification.controls.npwpName)) {
                  <p class="text-destructive text-sm">This field is required.</p>
                }
              </div>
              <div class="flex flex-row items-center justify-between rounded-lg border p-3">
                <label hlmLabel for="reg-npwp-sync" class="text-sm font-normal">
                  Use vendor name as NPWP name
                </label>
                <hlm-switch inputId="reg-npwp-sync" formControlName="useVendorNameAsNpwpName" />
              </div>
              <div class="grid gap-2">
                <label hlmLabel for="reg-npwp-address">NPWP Address <span class="text-destructive" aria-hidden="true">*</span></label>
                <textarea hlmTextarea id="reg-npwp-address" formControlName="npwpAddress" placeholder="Address on NPWP" class="resize-none"></textarea>
                @if (showError(taxIdentification.controls.npwpAddress)) {
                  <p class="text-destructive text-sm">This field is required.</p>
                }
              </div>
              <app-file-upload-field
                formControlName="npwpDocument"
                label="NPWP Document"
                hint="Accepted: JPG, PNG, PDF. Max 5 MB."
                [required]="true"
              >
                @if (showError(taxIdentification.controls.npwpDocument)) {
                  <p class="text-destructive text-sm">{{ taxIdentification.controls.npwpDocument.errors?.['upload'] ?? 'This field is required.' }}</p>
                }
              </app-file-upload-field>
              <div class="grid gap-2">
                <label hlmLabel for="reg-sppkp">SPPKP Number</label>
                <input hlmInput id="reg-sppkp" formControlName="sppkp" placeholder="Optional" />
              </div>
              <app-file-upload-field
                formControlName="sppkpDocument"
                label="SPPKP Document"
                hint="Accepted: JPG, PNG, PDF. Max 5 MB."
                [required]="false"
              >
                @if (showError(taxIdentification.controls.sppkpDocument)) {
                  <p class="text-destructive text-sm">{{ taxIdentification.controls.sppkpDocument.errors?.['upload'] ?? '' }}</p>
                }
              </app-file-upload-field>
            </div>
          </section>
        </div>

        <div class="sticky bottom-0 mt-6 flex items-center justify-end gap-2 border-t bg-background py-4">
          <hlm-alert-dialog [state]="resetOpen() ? 'open' : 'closed'" (stateChanged)="onResetState($event)">
            <button hlmAlertDialogTrigger hlmBtn type="button" variant="outline">Reset</button>
            <hlm-alert-dialog-content *hlmAlertDialogPortal class="max-w-md">
              <div hlmAlertDialogHeader class="text-start">
                <h2 hlmAlertDialogTitle>Reset this form?</h2>
                <p hlmAlertDialogDescription>All entered data will be cleared.</p>
              </div>
              <div hlmAlertDialogFooter>
                <button hlmAlertDialogCancel type="button">Cancel</button>
                <button hlmAlertDialogAction variant="destructive" type="button" (click)="confirmReset()">
                  Reset
                </button>
              </div>
            </hlm-alert-dialog-content>
          </hlm-alert-dialog>
          <button hlmBtn type="submit" [disabled]="isLoading()">
            @if (isLoading()) {
              <span class="animate-spin">...</span>
            }
            Register
          </button>
        </div>
      </form>
    </main>
  `,
})
export class RegistrationComponent implements OnDestroy {
  protected readonly isLoading = signal(false)
  protected readonly resetOpen = signal(false)

  protected readonly vendorTypes = VENDOR_TYPES
  protected readonly profileTypes = PROFILE_TYPES
  protected readonly dataCategories = DATA_CATEGORIES
  protected readonly banks = BANKS
  protected readonly currencies = CURRENCIES
  protected readonly recipientTypes = RECIPIENT_TYPES

  readonly form = new FormGroup({
    vendorType: new FormControl<string>(DEFAULTS.vendorType, { nonNullable: true }),
    vendorProfile: new FormGroup<VendorProfileControls>(
      {
        name: new FormControl('', { nonNullable: true, validators: [requiredValidator] }),
        type: new FormControl('', { nonNullable: true, validators: [requiredValidator] }),
        dataCategory: new FormControl('', { nonNullable: true, validators: [requiredValidator] }),
        address: new FormControl('', { nonNullable: true, validators: [requiredValidator] }),
        registrationEmail: new FormControl('', { nonNullable: true, validators: [emailValidator] }),
        password: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required, Validators.minLength(7)],
        }),
        confirmPassword: new FormControl('', { nonNullable: true }),
        pic: new FormGroup<PicControls>({
          name: new FormControl('', { nonNullable: true, validators: [requiredValidator] }),
          email: new FormControl('', { nonNullable: true, validators: [emailValidator] }),
          phoneCountryCode: new FormControl(DEFAULT_COUNTRY_DIAL, { nonNullable: true }),
          phoneNumber: new FormControl('', { nonNullable: true, validators: [phoneValidator] }),
        }),
      },
      { validators: [passwordMatchGroupValidator] },
    ),
    bankAccount: new FormGroup<BankAccountControls>({
      bankName: new FormControl('', { nonNullable: true, validators: [requiredValidator] }),
      accountHolderName: new FormControl('', { nonNullable: true, validators: [requiredValidator] }),
      accountNumber: new FormControl('', { nonNullable: true, validators: [requiredValidator] }),
      currency: new FormControl('', { nonNullable: true, validators: [requiredValidator] }),
      recipientType: new FormControl('', { nonNullable: true, validators: [requiredValidator] }),
      bankDocument: new FormControl<File | null>(null, { validators: [uploadValidator(true)] }),
    }),
    taxIdentification: new FormGroup<TaxIdentificationControls>({
      npwp: new FormControl('', { nonNullable: true, validators: [requiredValidator] }),
      npwpName: new FormControl('', { nonNullable: true, validators: [requiredValidator] }),
      useVendorNameAsNpwpName: new FormControl(false, { nonNullable: true }),
      npwpAddress: new FormControl('', { nonNullable: true, validators: [requiredValidator] }),
      npwpDocument: new FormControl<File | null>(null, { validators: [uploadValidator(true)] }),
      sppkp: new FormControl('', { nonNullable: true }),
      sppkpDocument: new FormControl<File | null>(null, { validators: [uploadValidator(false)] }),
    }),
  })

  private readonly toast = inject(ToastService)
  private readonly host = inject(ElementRef)
  private readonly destroyed = new Subject<void>()

  constructor() {
    const useVendorName = this.taxIdentification.controls.useVendorNameAsNpwpName
    const npwpName = this.taxIdentification.controls.npwpName
    const vendorName = this.vendorProfile.controls.name
    useVendorName.valueChanges.pipe(takeUntil(this.destroyed)).subscribe((on) => {
      if (on) {
        npwpName.setValue(vendorName.value)
        npwpName.disable()
      } else {
        npwpName.enable()
      }
    })
    vendorName.valueChanges.pipe(takeUntil(this.destroyed)).subscribe((value) => {
      if (useVendorName.value) npwpName.setValue(value)
    })
  }

  ngOnDestroy(): void {
    this.destroyed.next()
    this.destroyed.complete()
  }

  get vendorType(): FormControl<string> {
    return this.form.controls.vendorType
  }

  get vendorProfile(): FormGroup<VendorProfileControls> {
    return this.form.controls.vendorProfile
  }

  get bankAccount(): FormGroup<BankAccountControls> {
    return this.form.controls.bankAccount
  }

  get taxIdentification(): FormGroup<TaxIdentificationControls> {
    return this.form.controls.taxIdentification
  }

  get pic(): FormGroup<PicControls> {
    return this.vendorProfile.controls.pic
  }

  canSubmit(): boolean {
    return this.form.valid && !this.isLoading()
  }

  protected confirmError(): string | null {
    const confirm = this.vendorProfile.controls.confirmPassword
    const touched = confirm.touched || confirm.dirty || this.vendorProfile.touched
    if (!touched) return null
    const error = this.vendorProfile.errors?.['confirmPassword']
    return typeof error === 'string' ? error : null
  }

  protected showError(control: AbstractControl): boolean {
    return control.invalid && (control.touched || control.dirty || this.form.touched)
  }

  protected onCountryPicked(dialCode: string): void {
    this.pic.controls.phoneCountryCode.setValue(dialCode)
  }

  protected onResetState(state: string): void {
    if (state === 'closed') this.resetOpen.set(false)
  }

  protected confirmReset(): void {
    this.resetOpen.set(false)
    this.form.reset(DEFAULTS)
    this.taxIdentification.controls.npwpName.enable()
  }

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      const firstError = this.host.nativeElement.querySelector('.text-destructive') as HTMLElement | null
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      firstError?.focus?.()
      return
    }
    const raw = this.form.getRawValue()
    const trim = (value: string): string => value.trim()
    const payload = {
      vendorType: raw.vendorType,
      vendorProfile: {
        name: trim(raw.vendorProfile.name),
        type: trim(raw.vendorProfile.type),
        dataCategory: trim(raw.vendorProfile.dataCategory),
        address: trim(raw.vendorProfile.address),
        registrationEmail: trim(raw.vendorProfile.registrationEmail),
        password: raw.vendorProfile.password,
        confirmPassword: raw.vendorProfile.confirmPassword,
        pic: {
          name: trim(raw.vendorProfile.pic.name),
          email: trim(raw.vendorProfile.pic.email),
          phoneCountryCode: raw.vendorProfile.pic.phoneCountryCode,
          phoneNumber: trim(raw.vendorProfile.pic.phoneNumber),
        },
      },
      bankAccount: {
        bankName: trim(raw.bankAccount.bankName),
        accountHolderName: trim(raw.bankAccount.accountHolderName),
        accountNumber: trim(raw.bankAccount.accountNumber),
        currency: trim(raw.bankAccount.currency),
        recipientType: trim(raw.bankAccount.recipientType),
        bankDocument: fileSummary(raw.bankAccount.bankDocument),
      },
      taxIdentification: {
        npwp: trim(raw.taxIdentification.npwp),
        npwpName: trim(raw.taxIdentification.npwpName),
        useVendorNameAsNpwpName: raw.taxIdentification.useVendorNameAsNpwpName,
        npwpAddress: trim(raw.taxIdentification.npwpAddress),
        npwpDocument: fileSummary(raw.taxIdentification.npwpDocument),
        sppkp: trim(raw.taxIdentification.sppkp),
        sppkpDocument: fileSummary(raw.taxIdentification.sppkpDocument),
      },
    }
    this.isLoading.set(true)
    const request = sleep(1500)
    this.toast.promise(request, {
      loading: 'Submitting registration…',
      success: () => {
        this.isLoading.set(false)
        return 'Registration submitted successfully.'
      },
      error: 'Registration failed.',
    })
    request.catch(() => this.isLoading.set(false))
    console.log('vendor-registration', payload)
  }
}
