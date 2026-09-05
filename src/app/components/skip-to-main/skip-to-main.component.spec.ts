import { TestBed } from '@angular/core/testing'
import { SkipToMainComponent } from './skip-to-main.component'

describe('SkipToMainComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkipToMainComponent],
    }).compileComponents()
  })

  it('renders a skip link pointing to #content', () => {
    const fixture = TestBed.createComponent(SkipToMainComponent)
    fixture.detectChanges()
    const link = fixture.nativeElement.querySelector('a') as HTMLAnchorElement
    expect(link).not.toBeNull()
    expect(link.getAttribute('href')).toBe('#content')
    expect(link.textContent).toContain('Skip to Main')
  })
})
