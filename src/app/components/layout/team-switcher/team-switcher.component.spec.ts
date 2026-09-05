import { OverlayContainer } from '@angular/cdk/overlay'
import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { vi } from 'vitest'
import { ThemeService } from '../../../core/services/theme.service'
import { type Team } from '../types'
import { TeamSwitcherComponent } from './team-switcher.component'

function mockMatchMedia(matches: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }),
  })
}

const TEAMS: Team[] = [
  { name: 'Alecto Admin', logo: '/images/logo.webp', plan: 'Angular + Spartan' },
  { name: 'Alecto Inc', logo: 'lucideGalleryVerticalEnd', plan: 'Enterprise' },
]

describe('TeamSwitcherComponent', () => {
  let fixture: ComponentFixture<TeamSwitcherComponent>
  let overlay: HTMLElement

  beforeEach(async () => {
    mockMatchMedia(false)
    window.localStorage.clear()
    await TestBed.configureTestingModule({
      imports: [TeamSwitcherComponent],
      providers: [provideRouter([])],
    }).compileComponents()
    fixture = TestBed.createComponent(TeamSwitcherComponent)
    fixture.componentRef.setInput('teams', TEAMS)
    overlay = TestBed.inject(OverlayContainer).getContainerElement()
    fixture.detectChanges()
  })

  it('renders the light logo img for the brand team by default', () => {
    const img = fixture.nativeElement.querySelector(
      'img[src="/images/logo-light.webp"]'
    ) as HTMLImageElement | null
    expect(img).not.toBeNull()
    expect(img?.getAttribute('alt')).toBe('Alecto Admin')
    expect(
      fixture.nativeElement.querySelector(
        'button ng-icon[name="lucideCommand"]'
      )
    ).toBeNull()
  })

  it('renders the dark logo img when the resolved theme is dark', () => {
    TestBed.inject(ThemeService).setTheme('dark')
    fixture.detectChanges()
    const img = fixture.nativeElement.querySelector(
      'img[src="/images/logo-dark.webp"]'
    ) as HTMLImageElement | null
    expect(img).not.toBeNull()
  })

  it('renders ng-icon for icon-name logos in the dropdown', async () => {
    const trigger = fixture.nativeElement.querySelector(
      'button[hlmDropdownMenuTrigger]'
    ) as HTMLButtonElement
    trigger.click()
    fixture.detectChanges()
    await fixture.whenStable()
    await new Promise((resolve) => setTimeout(resolve, 200))
    fixture.detectChanges()
    const items = [
      ...overlay.querySelectorAll<HTMLButtonElement>(
        'button[data-slot="dropdown-menu-item"]'
      ),
    ]
    // NOTE: dynamic [name] bindings do not reflect to the DOM attribute
    // (only static name="..." does), so locate the Alecto row by its text and
    // assert it carries an ng-icon (not an img).
    const acme = items.find((el) => el.textContent?.includes('Alecto Inc'))
    expect(acme).not.toBeUndefined()
    expect(acme?.querySelector('ng-icon')).not.toBeNull()
    expect(acme?.querySelector('img')).toBeNull()
  })
})
