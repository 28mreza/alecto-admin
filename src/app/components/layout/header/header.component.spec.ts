import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { Component, input } from '@angular/core'
import { vi } from 'vitest'
import { HeaderComponent } from './header.component'

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

function setScrollY(value: number) {
  Object.defineProperty(window, 'scrollY', {
    value,
    configurable: true,
  })
}

@Component({
  selector: 'app-test-host',
  standalone: true,
  imports: [HeaderComponent],
  template: `
    <app-header [fixed]="fixed()" [className]="className()">
      <span id="projected">Projected content</span>
    </app-header>
  `,
})
class TestHostComponent {
  readonly fixed = input(false)
  readonly className = input('')
}

describe('HeaderComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>

  beforeEach(() => {
    mockMatchMedia(false)
    window.localStorage.clear()
    setScrollY(0)
    TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [provideRouter([])],
    })
    fixture = TestBed.createComponent(TestHostComponent)
    fixture.detectChanges()
  })

  function header(): HTMLElement {
    return fixture.nativeElement.querySelector('header') as HTMLElement
  }

  it('renders the sidebar trigger with the outline variant', () => {
    const trigger = fixture.nativeElement.querySelector(
      'app-sidebar-trigger button'
    ) as HTMLElement
    expect(trigger).not.toBeNull()
    expect(trigger.classList.contains('border-border')).toBe(true)
  })

  it('renders a vertical separator', () => {
    const separator = fixture.nativeElement.querySelector(
      'hlm-separator[data-slot="separator"]'
    ) as HTMLElement
    expect(separator).not.toBeNull()
  })

  it('projects content', () => {
    expect(
      fixture.nativeElement.querySelector('#projected').textContent
    ).toContain('Projected content')
  })

  it('starts unstuck with shadow-none', () => {
    fixture.componentRef.setInput('fixed', true)
    fixture.detectChanges()
    expect(header().classList.contains('sticky')).toBe(true)
    expect(header().classList.contains('shadow-none')).toBe(true)
    expect(header().classList.contains('shadow')).toBe(false)
  })

  it('adds the peer classes only when fixed', () => {
    expect(header().classList.contains('header-fixed')).toBe(false)
    expect(header().classList.contains('peer/header')).toBe(false)

    fixture.componentRef.setInput('fixed', true)
    fixture.detectChanges()
    expect(header().classList.contains('header-fixed')).toBe(true)
    expect(header().classList.contains('peer/header')).toBe(true)
    expect(header().classList.contains('w-[inherit]')).toBe(true)
  })

  it('applies shadow + backdrop-blur once scrolled past 10px on a fixed header', () => {
    fixture.componentRef.setInput('fixed', true)
    fixture.detectChanges()

    setScrollY(120)
    window.dispatchEvent(new Event('scroll'))
    fixture.detectChanges()

    expect(header().classList.contains('shadow')).toBe(true)
    expect(header().classList.contains('shadow-none')).toBe(false)
    expect(header().classList.contains('bg-background/20')).toBe(true)
    expect(header().classList.contains('backdrop-blur-lg')).toBe(true)
  })

  it('merges className into the inner header element', () => {
    expect(header().classList.contains('border-b')).toBe(false)

    fixture.componentRef.setInput('className', 'border-b')
    fixture.detectChanges()

    expect(header().classList.contains('border-b')).toBe(true)
    expect(header().classList.contains('z-50')).toBe(true)
    expect(header().classList.contains('h-16')).toBe(true)
  })

  it('keeps shadow-none when scrolled but not fixed', () => {
    setScrollY(200)
    window.dispatchEvent(new Event('scroll'))
    fixture.detectChanges()

    expect(header().classList.contains('shadow')).toBe(false)
    expect(header().classList.contains('shadow-none')).toBe(true)
    expect(header().classList.contains('bg-background/20')).toBe(false)
    expect(header().classList.contains('backdrop-blur-lg')).toBe(false)
  })
})
