import { TestBed } from '@angular/core/testing'
import { vi } from 'vitest'
import { ConfigDrawerComponent } from './config-drawer.component'
import { LayoutService } from '../../core/services/layout.service'
import { SidebarService } from '../../core/services/sidebar.service'
import { ThemeService } from '../../core/services/theme.service'

function mockMatchMedia(matches: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      matches,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }),
  })
}

function sheetContent(): HTMLElement | null {
  return document.body.querySelector('hlm-sheet-content')
}

async function openDrawer(fixture: {
  detectChanges: () => void
  whenStable: () => Promise<unknown>
  nativeElement: HTMLElement
}) {
  const trigger = fixture.nativeElement.querySelector(
    'button[aria-label="Open theme settings"]'
  ) as HTMLButtonElement
  expect(trigger).not.toBeNull()
  trigger.click()
  fixture.detectChanges()
  await fixture.whenStable()
  fixture.detectChanges()
}

describe('ConfigDrawerComponent', () => {
  beforeEach(async () => {
    mockMatchMedia(false)
    window.localStorage.clear()
    document.body.innerHTML = ''
    await TestBed.configureTestingModule({
      imports: [ConfigDrawerComponent],
    }).compileComponents()
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('creates and renders the trigger', () => {
    const fixture = TestBed.createComponent(ConfigDrawerComponent)
    fixture.detectChanges()
    expect(fixture.componentInstance).toBeTruthy()
    expect(
      fixture.nativeElement.querySelector(
        'button[aria-label="Open theme settings"]'
      )
    ).not.toBeNull()
  })

  it('renders all four sections when the drawer opens', async () => {
    const fixture = TestBed.createComponent(ConfigDrawerComponent)
    fixture.detectChanges()
    await openDrawer(fixture)

    const content = sheetContent()
    expect(content).not.toBeNull()
    const text = content?.textContent ?? ''
    expect(text).toContain('Theme Settings')
    expect(
      content?.querySelector('[aria-label="Select theme preference"]')
    ).not.toBeNull()
    expect(
      content?.querySelector('[aria-label="Select sidebar style"]')
    ).not.toBeNull()
    expect(
      content?.querySelector('[aria-label="Select layout style"]')
    ).not.toBeNull()
    expect(
      content?.querySelector('[aria-label="Select content width"]')
    ).not.toBeNull()
    // 3 + 3 + 3 + 2 options
    expect(content?.querySelectorAll('[role="radio"]').length).toBe(11)
  })

  it('changing the theme radio updates ThemeService', async () => {
    const fixture = TestBed.createComponent(ConfigDrawerComponent)
    const theme = TestBed.inject(ThemeService)
    fixture.detectChanges()
    await openDrawer(fixture)

    const dark = sheetContent()?.querySelector(
      '[aria-label="Select dark"]'
    ) as HTMLButtonElement
    expect(dark).not.toBeNull()
    dark.click()
    fixture.detectChanges()

    expect(theme.theme()).toBe('dark')
    expect(dark.getAttribute('data-state')).toBe('checked')
    expect(dark.getAttribute('aria-checked')).toBe('true')
  })

  it('shows the per-section theme reset only when non-default', async () => {
    const fixture = TestBed.createComponent(ConfigDrawerComponent)
    fixture.detectChanges()
    await openDrawer(fixture)

    expect(
      sheetContent()?.querySelector(
        '[aria-label="Reset theme preference to default"]'
      )
    ).toBeNull()

    const dark = sheetContent()?.querySelector(
      '[aria-label="Select dark"]'
    ) as HTMLButtonElement
    dark.click()
    fixture.detectChanges()
    await fixture.whenStable()
    fixture.detectChanges()

    expect(
      sheetContent()?.querySelector(
        '[aria-label="Reset theme preference to default"]'
      )
    ).not.toBeNull()
  })

  it('layout radio drives SidebarService.open + LayoutService.collapsible', async () => {
    const fixture = TestBed.createComponent(ConfigDrawerComponent)
    const layout = TestBed.inject(LayoutService)
    const sidebar = TestBed.inject(SidebarService)
    fixture.detectChanges()
    await openDrawer(fixture)

    const compact = sheetContent()?.querySelector(
      '[aria-label="Select compact"]'
    ) as HTMLButtonElement
    compact.click()
    fixture.detectChanges()

    expect(sidebar.open()).toBe(false)
    expect(layout.collapsible()).toBe('icon')

    const full = sheetContent()?.querySelector(
      '[aria-label="Select full layout"]'
    ) as HTMLButtonElement
    full.click()
    fixture.detectChanges()

    expect(sidebar.open()).toBe(false)
    expect(layout.collapsible()).toBe('offcanvas')
  })

  it('Reset restores defaults (theme light, variant floating, collapsible icon, sidebar closed)', async () => {
    const fixture = TestBed.createComponent(ConfigDrawerComponent)
    const theme = TestBed.inject(ThemeService)
    const layout = TestBed.inject(LayoutService)
    const sidebar = TestBed.inject(SidebarService)

    theme.setTheme('dark')
    layout.setVariant('inset')
    layout.setCollapsible('offcanvas')
    sidebar.setOpen(true)

    fixture.detectChanges()
    await openDrawer(fixture)

    const reset = sheetContent()?.querySelector(
      '[aria-label="Reset all settings to default values"]'
    ) as HTMLButtonElement
    expect(reset).not.toBeNull()
    reset.click()
    fixture.detectChanges()

    expect(theme.theme()).toBe('light')
    expect(layout.variant()).toBe('floating')
    expect(layout.collapsible()).toBe('icon')
    expect(sidebar.open()).toBe(false)
  })

  function pressKey(target: Element, key: string) {
    target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))
  }

  function themeRadio(value: string): HTMLButtonElement {
    const el = sheetContent()?.querySelector(
      `[aria-label="Select theme preference"] [data-value="${value}"]`
    ) as HTMLButtonElement
    expect(el).not.toBeNull()
    return el
  }

  it('uses roving tabindex: only the checked option is tabbable', async () => {
    const fixture = TestBed.createComponent(ConfigDrawerComponent)
    fixture.detectChanges()
    await openDrawer(fixture)

    expect(themeRadio('light').getAttribute('tabindex')).toBe('0')
    expect(themeRadio('system').getAttribute('tabindex')).toBe('-1')
    expect(themeRadio('dark').getAttribute('tabindex')).toBe('-1')

    themeRadio('dark').click()
    fixture.detectChanges()

    expect(themeRadio('light').getAttribute('tabindex')).toBe('-1')
    expect(themeRadio('dark').getAttribute('tabindex')).toBe('0')
  })

  it('ArrowRight moves selection to the next option and focuses it', async () => {
    const fixture = TestBed.createComponent(ConfigDrawerComponent)
    const theme = TestBed.inject(ThemeService)
    fixture.detectChanges()
    await openDrawer(fixture)

    const light = themeRadio('light')
    light.focus()
    pressKey(light, 'ArrowRight')
    fixture.detectChanges()

    expect(theme.theme()).toBe('dark')
    const dark = themeRadio('dark')
    expect(dark.getAttribute('data-state')).toBe('checked')
    expect(dark.getAttribute('tabindex')).toBe('0')
    expect(document.activeElement).toBe(dark)
  })

  it('ArrowLeft wraps around from first to last', async () => {
    const fixture = TestBed.createComponent(ConfigDrawerComponent)
    const theme = TestBed.inject(ThemeService)
    theme.setTheme('system')
    fixture.detectChanges()
    await openDrawer(fixture)

    const system = themeRadio('system')
    pressKey(system, 'ArrowLeft')
    fixture.detectChanges()

    expect(theme.theme()).toBe('dark')
    expect(document.activeElement).toBe(themeRadio('dark'))
  })

  it('Home/End jump to first/last option', async () => {
    const fixture = TestBed.createComponent(ConfigDrawerComponent)
    const theme = TestBed.inject(ThemeService)
    fixture.detectChanges()
    await openDrawer(fixture)

    pressKey(themeRadio('system'), 'End')
    fixture.detectChanges()
    expect(theme.theme()).toBe('dark')
    expect(document.activeElement).toBe(themeRadio('dark'))

    pressKey(themeRadio('dark'), 'Home')
    fixture.detectChanges()
    expect(theme.theme()).toBe('system')
    expect(document.activeElement).toBe(themeRadio('system'))
  })

  it('arrow keys work cross-group (sidebar variant ArrowDown)', async () => {
    const fixture = TestBed.createComponent(ConfigDrawerComponent)
    const layout = TestBed.inject(LayoutService)
    layout.setVariant('inset')
    fixture.detectChanges()
    await openDrawer(fixture)

    const inset = sheetContent()?.querySelector(
      '[aria-label="Select sidebar style"] [data-value="inset"]'
    ) as HTMLButtonElement
    pressKey(inset, 'ArrowDown')
    fixture.detectChanges()

    expect(layout.variant()).toBe('floating')
    const floating = sheetContent()?.querySelector(
      '[aria-label="Select sidebar style"] [data-value="floating"]'
    ) as HTMLButtonElement
    expect(document.activeElement).toBe(floating)
  })

  function contentWidthRadio(value: string): HTMLButtonElement {
    const el = sheetContent()?.querySelector(
      `[aria-label="Select content width"] [data-value="${value}"]`
    ) as HTMLButtonElement
    expect(el).not.toBeNull()
    return el
  }

  it('renders the Content Width section with Full checked by default', async () => {
    const fixture = TestBed.createComponent(ConfigDrawerComponent)
    const layout = TestBed.inject(LayoutService)
    fixture.detectChanges()
    await openDrawer(fixture)

    expect(layout.contentWidth()).toBe('full')
    expect(contentWidthRadio('full').getAttribute('data-state')).toBe('checked')
    expect(contentWidthRadio('compact').getAttribute('data-state')).toBe(
      'unchecked'
    )
  })

  it('selecting Compact updates the content-width preference', async () => {
    const fixture = TestBed.createComponent(ConfigDrawerComponent)
    const layout = TestBed.inject(LayoutService)
    fixture.detectChanges()
    await openDrawer(fixture)

    contentWidthRadio('compact').click()
    fixture.detectChanges()

    expect(layout.contentWidth()).toBe('compact')
    expect(
      window.localStorage.getItem('alecto-admin:layout-content-width')
    ).toBe('"compact"')
    expect(contentWidthRadio('compact').getAttribute('data-state')).toBe(
      'checked'
    )
  })

  it('per-section reset restores the default content width', async () => {
    const fixture = TestBed.createComponent(ConfigDrawerComponent)
    const layout = TestBed.inject(LayoutService)
    layout.setContentWidth('compact')
    fixture.detectChanges()
    await openDrawer(fixture)

    const reset = sheetContent()?.querySelector(
      '[aria-label="Reset content width to default"]'
    ) as HTMLButtonElement
    expect(reset).not.toBeNull()
    reset.click()
    fixture.detectChanges()

    expect(layout.contentWidth()).toBe('full')
  })
})
