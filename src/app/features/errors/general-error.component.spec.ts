import { Location } from '@angular/common'
import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { Router, provideRouter } from '@angular/router'
import { vi } from 'vitest'
import { GeneralErrorComponent } from './general-error.component'

describe('GeneralErrorComponent', () => {
  let fixture: ComponentFixture<GeneralErrorComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GeneralErrorComponent],
      providers: [provideRouter([])],
    })
    fixture = TestBed.createComponent(GeneralErrorComponent)
    fixture.detectChanges()
  })

  function host(): HTMLElement {
    return fixture.nativeElement as HTMLElement
  }

  it('renders the 500 code and title by default', () => {
    expect(host().querySelector('h1')?.textContent).toContain('500')
    expect(host().textContent).toContain('Oops! Something went wrong')
    expect(host().textContent).toContain('We apologize for the inconvenience.')
    expect(host().querySelectorAll('button').length).toBe(2)
  })

  it('hides the code and buttons in minimal mode', () => {
    fixture.componentRef.setInput('minimal', true)
    fixture.detectChanges()
    expect(host().querySelector('h1')).toBeNull()
    expect(host().textContent).toContain('Oops! Something went wrong')
    expect(host().querySelectorAll('button').length).toBe(0)
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
