import { Location } from '@angular/common'
import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { Router, provideRouter } from '@angular/router'
import { vi } from 'vitest'
import { ForbiddenErrorComponent } from './forbidden-error.component'

describe('ForbiddenErrorComponent', () => {
  let fixture: ComponentFixture<ForbiddenErrorComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ForbiddenErrorComponent],
      providers: [provideRouter([])],
    })
    fixture = TestBed.createComponent(ForbiddenErrorComponent)
    fixture.detectChanges()
  })

  function host(): HTMLElement {
    return fixture.nativeElement as HTMLElement
  }

  it('renders the 403 code and title', () => {
    expect(host().querySelector('h1')?.textContent).toContain('403')
    expect(host().textContent).toContain('Access Forbidden')
    expect(host().textContent).toContain("You don't have necessary permission")
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
