import { Component, signal } from '@angular/core'
import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import { HlmCalendar } from '@spartan-ng/helm/calendar'
import { DatePickerComponent } from './date-picker.component'
import { ensureScrollIntoViewStub } from '../../../test-helpers'

@Component({
  standalone: true,
  imports: [DatePickerComponent],
  template: `
    <app-date-picker
      [selected]="date()"
      [placeholder]="placeholder()"
      (selectedChange)="date.set($event)"
    />
  `,
})
class DatePickerHostComponent {
  readonly date = signal<Date | undefined>(undefined)
  readonly placeholder = signal('Pick a date')
}

describe('DatePickerComponent', () => {
  let fixture: ComponentFixture<DatePickerHostComponent>

  function triggerButton(): HTMLButtonElement {
    const button = fixture.nativeElement.querySelector(
      'button[data-slot="popover-trigger"]'
    ) as HTMLButtonElement | null
    if (!button) throw new Error('date picker trigger button not found')
    return button
  }

  beforeEach(async () => {
    // jsdom has no scrollIntoView; overlay/calendar focus handling may call it.
    ensureScrollIntoViewStub()
    await TestBed.configureTestingModule({
      imports: [DatePickerHostComponent],
    }).compileComponents()
    fixture = TestBed.createComponent(DatePickerHostComponent)
    fixture.detectChanges()
  })

  it('renders the placeholder when no date is selected', () => {
    const button = triggerButton()
    expect(button.textContent).toContain('Pick a date')
    expect(button.getAttribute('data-empty')).toBe('true')
  })

  it('renders a custom placeholder', () => {
    fixture.componentInstance.placeholder.set('Select birth date')
    fixture.detectChanges()
    expect(triggerButton().textContent).toContain('Select birth date')
  })

  it('renders the formatted date when selected', () => {
    fixture.componentInstance.date.set(new Date(2024, 0, 15))
    fixture.detectChanges()
    const button = triggerButton()
    expect(button.textContent).toContain('Jan 15, 2024')
    expect(button.textContent).not.toContain('Pick a date')
    expect(button.getAttribute('data-empty')).toBe('false')
  })

  it('emits selectedChange when a date is picked in the calendar', () => {
    triggerButton().click()
    fixture.detectChanges()

    const calendar = fixture.debugElement.query(By.directive(HlmCalendar))
    expect(calendar).not.toBeNull()

    const picked = new Date(2024, 5, 20)
    calendar.triggerEventHandler('dateChange', picked)
    fixture.detectChanges()

    expect(fixture.componentInstance.date()).toEqual(picked)
    expect(triggerButton().textContent).toContain('Jun 20, 2024')
  })
})
