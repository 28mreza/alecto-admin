import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { RefreshButtonComponent } from './refresh-button.component'

describe('RefreshButtonComponent', () => {
  let fixture: ComponentFixture<RefreshButtonComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RefreshButtonComponent],
      providers: [provideRouter([])],
    }).compileComponents()
    fixture = TestBed.createComponent(RefreshButtonComponent)
    fixture.detectChanges()
  })

  function button(): HTMLButtonElement {
    return fixture.nativeElement.querySelector(
      'button[aria-label="Reload page"]'
    ) as HTMLButtonElement
  }

  it('renders the refresh icon with the shortcut hint', () => {
    expect(button()).not.toBeNull()
    expect(
      fixture.nativeElement.querySelector('ng-icon[name="lucideRefreshCw"]')
    ).not.toBeNull()
    // jsdom user agent is not macOS, so the Windows/Linux hint applies.
    // The hint renders through the Spartan tooltip (like the sidebar menu
    // tooltips), not a native title attribute.
    expect(button().getAttribute('title')).toBeNull()
    expect(button().textContent).toContain('Hard refresh (Ctrl+Shift+R)')
  })
})
