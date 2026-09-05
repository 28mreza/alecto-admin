import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { ComingSoonComponent } from './coming-soon.component'

describe('ComingSoonComponent', () => {
  let fixture: ComponentFixture<ComingSoonComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComingSoonComponent],
      providers: [provideRouter([])],
    }).compileComponents()
    fixture = TestBed.createComponent(ComingSoonComponent)
    fixture.detectChanges()
  })

  it('renders the Telescope icon at size 72', () => {
    const icon = fixture.nativeElement.querySelector(
      'ng-icon[name="lucideTelescope"]'
    ) as HTMLElement | null
    expect(icon).not.toBeNull()
    expect(icon?.getAttribute('size')).toBe('72')
  })

  it('renders the Coming Soon heading and description', () => {
    const text = (fixture.nativeElement as HTMLElement).textContent ?? ''
    expect(text).toContain('Coming Soon!')
    expect(text).toContain('This page has not been created yet.')
    expect(text).toContain('Stay tuned though!')
  })

  it('uses the full-viewport centered wrapper', () => {
    const host = fixture.nativeElement as HTMLElement
    expect(host.querySelector('div.h-svh')).not.toBeNull()
    const heading = host.querySelector('h1')
    expect(heading?.className).toContain('text-4xl')
  })
})
