import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import { vi } from 'vitest'
import { ToastService } from '../../../core/services/toast.service'
import { DatePickerComponent } from '../../../components/date-picker/date-picker.component'
import { AccountFormComponent } from './account-form.component'

describe('AccountFormComponent', () => {
  let fixture: ComponentFixture<AccountFormComponent>
  let toast: { message: ReturnType<typeof vi.fn> }

  beforeEach(async () => {
    toast = { message: vi.fn() }
    await TestBed.configureTestingModule({
      imports: [AccountFormComponent],
      providers: [{ provide: ToastService, useValue: toast }],
    }).compileComponents()
    fixture = TestBed.createComponent(AccountFormComponent)
    fixture.detectChanges()
  })

  function host(): HTMLElement {
    return fixture.nativeElement as HTMLElement
  }

  function component(): AccountFormComponent {
    return fixture.componentInstance
  }

  function submit(): void {
    const form = host().querySelector('form')
    if (!form) throw new Error('form not found')
    form.dispatchEvent(new Event('submit'))
    fixture.detectChanges()
  }

  it('blocks submit when required fields are empty and shows errors', () => {
    submit()
    const text = host().textContent ?? ''
    expect(text).toContain('Please enter your name.')
    expect(text).toContain('Please select your date of birth.')
    expect(text).toContain('Please select a language.')
    expect(toast.message).not.toHaveBeenCalled()
  })

  it('wires the date picker selectedChange output to the dob control', () => {
    const picker = fixture.debugElement.query(By.directive(DatePickerComponent))
    expect(picker).not.toBeNull()
    const picked = new Date(1990, 4, 20)
    picker.triggerEventHandler('selectedChange', picked)
    fixture.detectChanges()
    expect(component().dob.value).toEqual(picked)
    expect(component().dob.valid).toBe(true)
  })

  it('wires the language combobox selection to the language control', () => {
    expect(component().language.value).toBe('')
    component().selectLanguage('en')
    fixture.detectChanges()
    expect(component().language.value).toBe('en')
    expect(host().textContent).toContain('English')
  })

  it('shows a min-length error for a short name', () => {
    component().name.setValue('a')
    component().name.markAsTouched()
    fixture.detectChanges()
    expect(host().textContent).toContain('Name must be at least 2 characters.')
  })

  it('submits valid values via showSubmittedData', () => {
    component().name.setValue('John Doe')
    component().dob.setValue(new Date(1990, 4, 20))
    component().language.setValue('en')
    submit()
    expect(toast.message).toHaveBeenCalledTimes(1)
    const payload = JSON.parse(toast.message.mock.calls[0][1] as string)
    expect(payload.name).toBe('John Doe')
    expect(payload.language).toBe('en')
    expect(new Date(payload.dob).getFullYear()).toBe(1990)
  })
})
