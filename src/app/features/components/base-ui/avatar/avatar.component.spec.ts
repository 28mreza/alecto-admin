import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { vi } from 'vitest'
import { AvatarComponent } from './avatar.component'

describe('AvatarComponent', () => {
  let fixture: ComponentFixture<AvatarComponent>

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
      imports: [AvatarComponent],
      providers: [provideRouter([])],
    }).compileComponents()
    fixture = TestBed.createComponent(AvatarComponent)
    fixture.detectChanges()
  })

  function text(): string {
    return (fixture.nativeElement as HTMLElement).textContent ?? ''
  }

  it('renders the page heading', () => {
    expect(text()).toContain('Avatar')
  })

  it('renders sizes, badges and group demos', () => {
    const content = text()
    expect(content).toContain('MR')
    expect(content).toContain('ON')
    expect(content).toContain('M1')
    expect(content).toContain('+3')
  })
})
