import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { vi } from 'vitest'
import { DataTableComponent } from './data-table.component'

describe('DataTableComponent', () => {
  let fixture: ComponentFixture<DataTableComponent>

  beforeEach(async () => {
    // ThemeSwitch (via ThemeService) needs matchMedia, which jsdom lacks —
    // same stub as dashboard/chats page specs.
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: (query: string) => ({
        matches: false,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }),
    })
    await TestBed.configureTestingModule({
      imports: [DataTableComponent],
      providers: [provideRouter([])],
    }).compileComponents()
    fixture = TestBed.createComponent(DataTableComponent)
    fixture.detectChanges()
  })

  function host(): HTMLElement {
    return fixture.nativeElement as HTMLElement
  }

  it('renders the page heading', () => {
    expect(host().textContent).toContain('Data Table')
  })

  it('renders headers, filter, sort and pagination controls', () => {
    const content = host().textContent ?? ''
    expect(content).toContain('Muhamad Reza')
    expect(content).toContain('Toggle name sort')
    expect(content).toContain('Previous')
    expect(content).toContain('Next')
    const filter = host().querySelector('input[placeholder="Filter emails..."]')
    expect(filter).not.toBeNull()
  })
})
