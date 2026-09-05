import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { SearchComponent } from './search.component'
import { SearchService } from '../../core/services/search.service'

describe('SearchComponent', () => {
  let fixture: ComponentFixture<SearchComponent>
  let searchService: SearchService

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SearchComponent],
      providers: [provideRouter([])],
    })
    fixture = TestBed.createComponent(SearchComponent)
    searchService = TestBed.inject(SearchService)
    searchService.setOpen(false)
    fixture.detectChanges()
  })

  function button(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('button') as HTMLButtonElement
  }

  it('renders the placeholder text and search icon', () => {
    expect(button().textContent).toContain('Search')
    expect(
      fixture.nativeElement.querySelector('ng-icon[name="lucideSearch"]')
    ).not.toBeNull()
  })

  it('renders the keyboard shortcut hint', () => {
    const kbd = fixture.nativeElement.querySelector('kbd') as HTMLElement
    expect(kbd).not.toBeNull()
    expect(kbd.textContent).toContain('K')
  })

  it('opens the command palette on click', () => {
    button().click()
    expect(searchService.open()).toBe(true)
  })

  it('renders a custom placeholder', () => {
    fixture.componentRef.setInput('placeholder', 'Search...')
    fixture.detectChanges()
    expect(button().textContent).toContain('Search...')
  })

  it('applies className to the host (the header flex item), not the button', () => {
    fixture.componentRef.setInput('className', 'me-auto')
    fixture.detectChanges()
    expect(
      (fixture.nativeElement as HTMLElement).classList.contains('me-auto')
    ).toBe(true)
    expect(button().classList.contains('me-auto')).toBe(false)
  })
})
