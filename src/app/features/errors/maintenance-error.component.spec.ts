import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { MaintenanceErrorComponent } from './maintenance-error.component'

describe('MaintenanceErrorComponent', () => {
  let fixture: ComponentFixture<MaintenanceErrorComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MaintenanceErrorComponent],
      providers: [provideRouter([])],
    })
    fixture = TestBed.createComponent(MaintenanceErrorComponent)
    fixture.detectChanges()
  })

  function host(): HTMLElement {
    return fixture.nativeElement as HTMLElement
  }

  it('renders the 503 code and title', () => {
    expect(host().querySelector('h1')?.textContent).toContain('503')
    expect(host().textContent).toContain('Website is under maintenance!')
    expect(host().textContent).toContain('The site is not available')
  })

  it('renders a single Learn more button', () => {
    const buttons = Array.from(host().querySelectorAll('button'))
    expect(buttons.length).toBe(1)
    expect(buttons[0].textContent?.trim()).toBe('Learn more')
  })
})
