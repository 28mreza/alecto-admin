import { Location } from '@angular/common'
import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { Router, provideRouter } from '@angular/router'
import { vi } from 'vitest'
import { NotFoundErrorComponent } from './not-found-error.component'

describe('NotFoundErrorComponent', () => {
  let fixture: ComponentFixture<NotFoundErrorComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NotFoundErrorComponent],
      providers: [provideRouter([])],
    })
    fixture = TestBed.createComponent(NotFoundErrorComponent)
    fixture.detectChanges()
  })

  function host(): HTMLElement {
    return fixture.nativeElement as HTMLElement
  }

  it('renders the 404 code and title', () => {
    expect(host().querySelector('h1')?.textContent).toContain('404')
    expect(host().textContent).toContain('Oops! Page Not Found!')
    expect(host().textContent).toContain(
      "It seems like the page you're looking for"
    )
  })

  it('calls Location.back() on Go Back', () => {
    const location = TestBed.inject(Location)
    const backSpy = vi.spyOn(location, 'back')
    const goBack = Array.from(host().querySelectorAll('button')).find(
      (b) => b.textContent?.trim() === 'Go Back'
    ) as HTMLButtonElement
    goBack.click()
    expect(backSpy).toHaveBeenCalled()
  })

  it('navigates home on Back to Home', () => {
    const router = TestBed.inject(Router)
    const navSpy = vi.spyOn(router, 'navigate')
    const home = Array.from(host().querySelectorAll('button')).find(
      (b) => b.textContent?.trim() === 'Back to Home'
    ) as HTMLButtonElement
    home.click()
    expect(navSpy).toHaveBeenCalledWith(['/'])
  })
})
