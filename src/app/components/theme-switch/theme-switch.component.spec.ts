import { OverlayContainer } from '@angular/cdk/overlay'
import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { vi } from 'vitest'
import { ThemeSwitchComponent } from './theme-switch.component'
import { ThemeService } from '../../core/services/theme.service'

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

function menuItems(container: HTMLElement): HTMLButtonElement[] {
  return Array.from(
    container.querySelectorAll<HTMLButtonElement>(
      'button[data-slot="dropdown-menu-item"]'
    )
  )
}

describe('ThemeSwitchComponent', () => {
  let fixture: ComponentFixture<ThemeSwitchComponent>
  let themeService: ThemeService
  let overlay: HTMLElement

  beforeEach(() => {
    mockMatchMedia(false)
    window.localStorage.clear()
    TestBed.configureTestingModule({
      imports: [ThemeSwitchComponent],
      providers: [provideRouter([])],
    })
    fixture = TestBed.createComponent(ThemeSwitchComponent)
    themeService = TestBed.inject(ThemeService)
    overlay = TestBed.inject(OverlayContainer).getContainerElement()
    fixture.detectChanges()
  })

  function trigger(): HTMLButtonElement {
    return fixture.nativeElement.querySelector(
      'button[data-slot="dropdown-menu-trigger"]'
    ) as HTMLButtonElement
  }

  async function openMenu(): Promise<void> {
    trigger().click()
    fixture.detectChanges()
    await fixture.whenStable()
  }

  it('renders the Sun/Moon toggle icons with an accessible label', () => {
    expect(
      fixture.nativeElement.querySelector('ng-icon[name="lucideSun"]')
    ).not.toBeNull()
    expect(
      fixture.nativeElement.querySelector('ng-icon[name="lucideMoon"]')
    ).not.toBeNull()
    expect(trigger().textContent).toContain('Toggle theme')
  })

  it('opens a menu with Light, Dark and System options', async () => {
    await openMenu()
    const texts = menuItems(overlay).map((item) => item.textContent?.trim())
    expect(texts).toEqual(
      expect.arrayContaining([
        expect.stringContaining('Light'),
        expect.stringContaining('Dark'),
        expect.stringContaining('System'),
      ])
    )
  })

  it('calls setTheme when a menu item is clicked', async () => {
    await openMenu()
    const dark = menuItems(overlay).find((item) =>
      item.textContent?.includes('Dark')
    )
    expect(dark).not.toBeUndefined()
    dark!.click()
    fixture.detectChanges()
    expect(themeService.theme()).toBe('dark')
  })

  it('marks only the active theme with a visible check', async () => {
    themeService.setTheme('system')
    fixture.detectChanges()
    await openMenu()

    const checks = menuItems(overlay).map((item) => ({
      text: item.textContent?.trim() ?? '',
      hasCheck: item.querySelector('ng-icon[name="lucideCheck"]') !== null,
    }))
    expect(
      checks.find((check) => check.text.includes('System'))?.hasCheck
    ).toBe(true)
    expect(checks.find((check) => check.text.includes('Light'))?.hasCheck).toBe(
      false
    )
    expect(checks.find((check) => check.text.includes('Dark'))?.hasCheck).toBe(
      false
    )
  })
})
