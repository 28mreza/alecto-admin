import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { LayoutService } from '../../../core/services/layout.service'
import { MainComponent } from './main.component'

describe('MainComponent', () => {
  let fixture: ComponentFixture<MainComponent>

  beforeEach(async () => {
    window.localStorage.clear()
    await TestBed.configureTestingModule({
      imports: [MainComponent],
      providers: [provideRouter([])],
    }).compileComponents()
    fixture = TestBed.createComponent(MainComponent)
    fixture.detectChanges()
  })

  function main(): HTMLElement {
    return fixture.nativeElement.querySelector('main') as HTMLElement
  }

  it('renders a main landmark with auto layout by default', () => {
    expect(main().getAttribute('data-layout')).toBe('auto')
  })

  it('is full width by default (global content-width preference)', () => {
    expect(TestBed.inject(LayoutService).contentWidth()).toBe('full')
    expect(main().classList.contains('@7xl/content:max-w-7xl')).toBe(false)
  })

  it('constrains width when the global preference is compact', () => {
    TestBed.inject(LayoutService).setContentWidth('compact')
    fixture.detectChanges()
    expect(main().classList.contains('@7xl/content:max-w-7xl')).toBe(true)
    expect(main().classList.contains('@7xl/content:mx-auto')).toBe(true)
  })

  it('explicit fluid input overrides the global preference', () => {
    const layout = TestBed.inject(LayoutService)
    layout.setContentWidth('compact')
    fixture.componentRef.setInput('fluid', true)
    fixture.detectChanges()
    expect(main().classList.contains('@7xl/content:max-w-7xl')).toBe(false)

    fixture.componentRef.setInput('fluid', false)
    layout.setContentWidth('full')
    fixture.detectChanges()
    expect(main().classList.contains('@7xl/content:max-w-7xl')).toBe(true)
  })

  it('marks fixed layout via data-layout', () => {
    fixture.componentRef.setInput('fixed', true)
    fixture.detectChanges()
    expect(main().getAttribute('data-layout')).toBe('fixed')
  })
})
