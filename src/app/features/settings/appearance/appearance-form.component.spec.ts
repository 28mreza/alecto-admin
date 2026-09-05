import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { vi } from 'vitest'
import { ToastService } from '../../../core/services/toast.service'
import { FontService } from '../../../core/services/font.service'
import { ThemeService } from '../../../core/services/theme.service'
import { AppearanceFormComponent } from './appearance-form.component'

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

describe('AppearanceFormComponent', () => {
  let fixture: ComponentFixture<AppearanceFormComponent>
  let toast: { message: ReturnType<typeof vi.fn> }

  beforeEach(async () => {
    mockMatchMedia(false)
    window.localStorage.clear()
    toast = { message: vi.fn() }
    await TestBed.configureTestingModule({
      imports: [AppearanceFormComponent],
      providers: [{ provide: ToastService, useValue: toast }],
    }).compileComponents()
    fixture = TestBed.createComponent(AppearanceFormComponent)
    fixture.detectChanges()
  })

  function host(): HTMLElement {
    return fixture.nativeElement as HTMLElement
  }

  function component(): AppearanceFormComponent {
    return fixture.componentInstance
  }

  it('defaults to the current font and resolved theme', () => {
    const fontService = TestBed.inject(FontService)
    const themeService = TestBed.inject(ThemeService)
    expect(component().font.value).toBe(fontService.font())
    expect(component().theme.value).toBe(themeService.resolvedTheme())
  })

  it('renders the font options and both theme previews', () => {
    const options = Array.from(host().querySelectorAll('select option')).map(
      (o) => o.textContent?.trim()
    )
    expect(options).toEqual(
      expect.arrayContaining(['jetbrains-mono', 'inter', 'system'])
    )
    expect(host().textContent).toContain('Light')
    expect(host().textContent).toContain('Dark')
  })

  it('updates FontService and ThemeService on submit', () => {
    const fontService = TestBed.inject(FontService)
    const themeService = TestBed.inject(ThemeService)
    component().font.setValue('inter')
    component().theme.setValue('dark')
    const form = host().querySelector('form')
    if (!form) throw new Error('form not found')
    form.dispatchEvent(new Event('submit'))
    fixture.detectChanges()
    expect(fontService.font()).toBe('inter')
    expect(themeService.theme()).toBe('dark')
    expect(toast.message).toHaveBeenCalledTimes(1)
    const payload = JSON.parse(toast.message.mock.calls[0][1] as string)
    expect(payload).toMatchObject({ font: 'inter', theme: 'dark' })
  })
})
