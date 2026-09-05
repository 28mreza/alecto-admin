import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { ActivatedRoute, Router, provideRouter } from '@angular/router'
import { vi } from 'vitest'
import { AppsComponent } from './apps.component'

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

interface AppsTestApi {
  onTypeChange(value: unknown): void
  onSortChange(value: unknown): void
}

describe('AppsComponent', () => {
  let fixture: ComponentFixture<AppsComponent>
  let navigateSpy: ReturnType<typeof vi.spyOn>

  beforeEach(async () => {
    mockMatchMedia(false)
    window.localStorage.clear()
    await TestBed.configureTestingModule({
      imports: [AppsComponent],
      providers: [provideRouter([])],
    }).compileComponents()
    navigateSpy = vi
      .spyOn(TestBed.inject(Router), 'navigate')
      .mockResolvedValue(true)
    fixture = TestBed.createComponent(AppsComponent)
    fixture.detectChanges()
  })

  function host(): HTMLElement {
    return fixture.nativeElement as HTMLElement
  }

  function api(): AppsTestApi {
    return fixture.componentInstance as unknown as AppsTestApi
  }

  function cardNames(): string[] {
    return [...host().querySelectorAll('ul li h2')].map(
      (h2) => h2.textContent?.trim() ?? ''
    )
  }

  function filterInput(): HTMLInputElement {
    return host().querySelector(
      'input[aria-label="Filter apps"]'
    ) as HTMLInputElement
  }

  it('renders the heading and all 15 integration cards', () => {
    expect(host().querySelector('h1')?.textContent).toContain(
      'App Integrations'
    )
    expect(host().textContent).toContain(
      "Here's a list of your apps for the integration!"
    )
    expect(cardNames()).toHaveLength(15)
    const buttons = [...host().querySelectorAll('ul li button')].map((b) =>
      b.textContent?.trim()
    )
    expect(buttons.filter((t) => t === 'Connected')).toHaveLength(4)
    expect(buttons.filter((t) => t === 'Connect')).toHaveLength(11)
  })

  it('narrows cards through the filter input and syncs the URL', () => {
    const input = filterInput()
    input.value = 'slack'
    input.dispatchEvent(new Event('input'))
    fixture.detectChanges()

    expect(cardNames()).toEqual(['Slack'])
    expect(navigateSpy).toHaveBeenCalledWith(
      [],
      expect.objectContaining({
        queryParams: { filter: 'slack' },
        queryParamsHandling: 'merge',
        replaceUrl: true,
      })
    )

    input.value = ''
    input.dispatchEvent(new Event('input'))
    fixture.detectChanges()
    expect(cardNames()).toHaveLength(15)
    expect(navigateSpy).toHaveBeenCalledWith(
      [],
      expect.objectContaining({ queryParams: { filter: null } })
    )
  })

  it('narrows cards through the type select and syncs the URL', () => {
    api().onTypeChange('connected')
    fixture.detectChanges()
    expect(cardNames()).toEqual(['Figma', 'Gmail', 'Notion', 'Zoom'])
    expect(navigateSpy).toHaveBeenCalledWith(
      [],
      expect.objectContaining({ queryParams: { type: 'connected' } })
    )

    api().onTypeChange('notConnected')
    fixture.detectChanges()
    expect(cardNames()).toHaveLength(11)
    expect(cardNames()).not.toContain('Notion')

    api().onTypeChange('all')
    fixture.detectChanges()
    expect(cardNames()).toHaveLength(15)
    expect(navigateSpy).toHaveBeenCalledWith(
      [],
      expect.objectContaining({ queryParams: { type: null } })
    )
  })

  it('reverses card order through the sort select and syncs the URL', () => {
    expect(cardNames()[0]).toBe('Discord')

    api().onSortChange('desc')
    fixture.detectChanges()
    expect(cardNames()[0]).toBe('Zoom')
    expect(navigateSpy).toHaveBeenCalledWith(
      [],
      expect.objectContaining({ queryParams: { sort: 'desc' } })
    )

    api().onSortChange('asc')
    fixture.detectChanges()
    expect(cardNames()[0]).toBe('Discord')
    expect(navigateSpy).toHaveBeenCalledWith(
      [],
      expect.objectContaining({ queryParams: { sort: null } })
    )
  })
})

describe('AppsComponent with query params', () => {
  it('initializes search/type/sort state from the URL', async () => {
    mockMatchMedia(false)
    window.localStorage.clear()
    await TestBed.configureTestingModule({
      imports: [AppsComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParams: {
                filter: 'git',
                type: 'notConnected',
                sort: 'desc',
              },
            },
          },
        },
      ],
    }).compileComponents()
    vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true)
    const f = TestBed.createComponent(AppsComponent)
    f.detectChanges()

    const names = [...f.nativeElement.querySelectorAll('ul li h2')].map(
      (h2: Element) => h2.textContent?.trim()
    )
    expect(names).toEqual(['GitLab', 'GitHub'])
    const input = f.nativeElement.querySelector(
      'input[aria-label="Filter apps"]'
    ) as HTMLInputElement
    expect(input.value).toBe('git')
  })
})
