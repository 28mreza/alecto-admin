import '@angular/compiler'
import { TestBed } from '@angular/core/testing'
import { vi } from 'vitest'
import { ToastService } from '../../core/services/toast.service'
import { RegistrationComponent } from './registration.component'

vi.mock('../../shared/utils/sleep', () => ({ sleep: () => Promise.resolve(undefined) }))

function stubToast(): { promise: ReturnType<typeof vi.fn> } {
  return {
    promise: vi.fn((promise: Promise<unknown>, messages: { success: string | ((v: unknown) => string) }) => {
      void Promise.resolve(promise).then(() => {
        if (typeof messages.success === 'function') messages.success(undefined)
      })
    }),
  }
}

function makeFile(name = 'doc.pdf'): File {
  return new File(['x'], name, { type: 'application/pdf' })
}

async function setup() {
  await TestBed.configureTestingModule({
    imports: [RegistrationComponent],
    providers: [{ provide: ToastService, useValue: stubToast() }],
  }).compileComponents()
  const fixture = TestBed.createComponent(RegistrationComponent)
  fixture.detectChanges()
  return fixture
}

function fillValid(c: RegistrationComponent): void {
  c.form.controls.vendorProfile.setValue({
    name: '  Acme Corp  ',
    type: 'CORPORATE',
    dataCategory: 'SUPPLIER',
    address: '  Main Street 1  ',
    registrationEmail: 'info@acme.test',
    password: 'secret12',
    confirmPassword: 'secret12',
    pic: { name: 'Jane', email: 'jane@acme.test', phoneCountryCode: '+62', phoneNumber: '8123456789' },
  })
  c.form.controls.bankAccount.controls.bankName.setValue('BCA')
  c.form.controls.bankAccount.controls.accountHolderName.setValue('Acme Corp')
  c.form.controls.bankAccount.controls.accountNumber.setValue('1234567890')
  c.form.controls.bankAccount.controls.currency.setValue('IDR')
  c.form.controls.bankAccount.controls.recipientType.setValue('CORPORATE')
  c.form.controls.bankAccount.controls.bankDocument.setValue(makeFile('bank.pdf'))
  c.form.controls.taxIdentification.controls.npwp.setValue('12345')
  c.form.controls.taxIdentification.controls.npwpName.setValue('  Acme NPWP  ')
  c.form.controls.taxIdentification.controls.npwpAddress.setValue('Tax Street 2')
  c.form.controls.taxIdentification.controls.npwpDocument.setValue(makeFile('npwp.pdf'))
}

describe('RegistrationComponent', () => {
  it('creates with 3 tabs and invalid empty form', async () => {
    const f = await setup()
    expect(f.componentInstance.form.invalid).toBe(true)
    const html = f.nativeElement as HTMLElement
    expect(html.querySelectorAll('[data-testid="vendor-tab"]').length).toBe(3)
  })
  it('marks Indonesian Company as the default active tab', async () => {
    const f = await setup()
    const html = f.nativeElement as HTMLElement
    const active = html.querySelector('[data-testid="vendor-tab"][data-state="active"]')
    expect(active?.textContent?.trim()).toBe('Indonesian Company')
  })
  it('blocks submit when invalid and accepts a valid payload shape', async () => {
    const f = await setup()
    const c = f.componentInstance
    expect(c.canSubmit()).toBe(false)
  })
  it('logs trimmed payload with File summaries', async () => {
    const f = await setup()
    const c = f.componentInstance
    fillValid(c)
    expect(c.form.valid).toBe(true)
    const log = vi.spyOn(console, 'log').mockReturnValue(undefined)
    c.onSubmit()
    const payload = log.mock.calls[0][1] as {
      vendorProfile: { name: string; address: string }
      bankAccount: { bankDocument: { name: string; size: number; type: string } }
      taxIdentification: { npwpName: string }
    }
    expect(log.mock.calls[0][0]).toBe('vendor-registration')
    expect(payload.vendorProfile.name).toBe('Acme Corp')
    expect(payload.vendorProfile.address).toBe('Main Street 1')
    expect(payload.taxIdentification.npwpName).toBe('Acme NPWP')
    expect(payload.bankAccount.bankDocument).toMatchObject({ name: 'bank.pdf', type: 'application/pdf' })
    log.mockRestore()
  })
  it('syncs NPWP name while switch is ON and re-enables on OFF', async () => {
    const f = await setup()
    const c = f.componentInstance
    const tax = c.taxIdentification.controls
    c.vendorProfile.controls.name.setValue('Acme Corp')
    tax.useVendorNameAsNpwpName.setValue(true)
    expect(tax.npwpName.value).toBe('Acme Corp')
    expect(tax.npwpName.disabled).toBe(true)
    c.vendorProfile.controls.name.setValue('New Name')
    expect(tax.npwpName.value).toBe('New Name')
    tax.useVendorNameAsNpwpName.setValue(false)
    expect(tax.npwpName.enabled).toBe(true)
  })
  it('re-enables NPWP name when reset while switch is ON', async () => {
    const f = await setup()
    const c = f.componentInstance
    const tax = c.taxIdentification.controls
    tax.useVendorNameAsNpwpName.setValue(true)
    expect(tax.npwpName.disabled).toBe(true)
    c.confirmReset()
    expect(tax.useVendorNameAsNpwpName.value).toBe(false)
    expect(tax.npwpName.enabled).toBe(true)
  })
  it('resets isLoading after successful submit', async () => {
    const f = await setup()
    const c = f.componentInstance
    fillValid(c)
    c.onSubmit()
    expect(c.isLoading()).toBe(true)
    await vi.waitFor(() => expect(c.isLoading()).toBe(false))
    expect(c.canSubmit()).toBe(true)
  })
  it('preserves input when switching tabs', async () => {
    const f = await setup()
    const c = f.componentInstance
    c.vendorProfile.controls.name.setValue('Acme Corp')
    c.vendorType.setValue('ID_INDIVIDUAL')
    c.vendorType.setValue('ID_COMPANY')
    expect(c.vendorProfile.controls.name.value).toBe('Acme Corp')
  })
})
