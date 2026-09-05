import { OverlayContainer } from '@angular/cdk/overlay'
import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter, Router } from '@angular/router'
import { vi } from 'vitest'
import { CommandMenuComponent } from './command-menu.component'
import { ensureScrollIntoViewStub } from '../../../test-helpers'
import { SearchService } from '../../core/services/search.service'
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

function groupLabels(container: HTMLElement): string[] {
  return Array.from(
    container.querySelectorAll('[data-slot="command-group-label"]')
  ).map((el) => el.textContent?.trim() ?? '')
}

function commandItemButtons(container: HTMLElement): HTMLButtonElement[] {
  return Array.from(
    container.querySelectorAll<HTMLButtonElement>(
      'button[data-slot="command-item"]'
    )
  )
}

function findItem(container: HTMLElement, text: string): HTMLButtonElement {
  const found = commandItemButtons(container).find((button) =>
    button.textContent?.includes(text)
  )
  if (!found) throw new Error(`command item "${text}" not found`)
  return found
}

describe('CommandMenuComponent', () => {
  let fixture: ComponentFixture<CommandMenuComponent>
  let searchService: SearchService
  let overlay: HTMLElement

  beforeEach(() => {
    mockMatchMedia(false)
    window.localStorage.clear()
    ensureScrollIntoViewStub()
    TestBed.configureTestingModule({
      imports: [CommandMenuComponent],
      providers: [provideRouter([])],
    })
    fixture = TestBed.createComponent(CommandMenuComponent)
    searchService = TestBed.inject(SearchService)
    searchService.setOpen(false)
    overlay = TestBed.inject(OverlayContainer).getContainerElement()
    fixture.detectChanges()
  })

  it('renders no command content while closed', () => {
    expect(overlay.querySelector('[data-slot="command"]')).toBeNull()
  })

  it('opens the palette with nav groups and the theme section', async () => {
    searchService.setOpen(true)
    fixture.detectChanges()
    await fixture.whenStable()

    const labels = groupLabels(overlay)
    expect(labels).toEqual(
      expect.arrayContaining(['General', 'Pages', 'Other', 'Theme'])
    )
    expect(
      overlay
        .querySelector('[data-slot="command-input"]')
        ?.getAttribute('placeholder')
    ).toBe('Type a command or search...')
    expect(commandItemButtons(overlay).length).toBeGreaterThan(0)
  })

  it('navigates to the item url and closes on selection', async () => {
    const router = TestBed.inject(Router)
    const navigate = vi.spyOn(router, 'navigate')
    searchService.setOpen(true)
    fixture.detectChanges()
    await fixture.whenStable()

    findItem(overlay, 'Tasks').click()
    fixture.detectChanges()

    expect(navigate).toHaveBeenCalledWith(['/tasks'])
    expect(searchService.open()).toBe(false)
  })

  it('navigates to a sub-item url on selection', async () => {
    const router = TestBed.inject(Router)
    const navigate = vi.spyOn(router, 'navigate')
    searchService.setOpen(true)
    fixture.detectChanges()
    await fixture.whenStable()

    findItem(overlay, 'OTP').click()
    fixture.detectChanges()

    expect(navigate).toHaveBeenCalledWith(['/otp'])
    expect(searchService.open()).toBe(false)
  })

  it('sets the theme and closes on theme selection', async () => {
    const themeService = TestBed.inject(ThemeService)
    searchService.setOpen(true)
    fixture.detectChanges()
    await fixture.whenStable()

    findItem(overlay, 'Dark').click()
    fixture.detectChanges()

    expect(themeService.theme()).toBe('dark')
    expect(searchService.open()).toBe(false)
  })

  it('shows the empty state when nothing matches', async () => {
    searchService.setOpen(true)
    fixture.detectChanges()
    await fixture.whenStable()

    const input = overlay.querySelector<HTMLInputElement>(
      '[data-slot="command-input"]'
    )
    expect(input).not.toBeNull()
    input!.value = 'zzz-no-such-command'
    input!.dispatchEvent(new Event('input'))
    fixture.detectChanges()
    await fixture.whenStable()

    expect(overlay.textContent).toContain('No results found.')
    const visibleItems = commandItemButtons(overlay).filter(
      (button) => button.getAttribute('data-hidden') !== 'true'
    )
    expect(visibleItems).toHaveLength(0)
  })
})
