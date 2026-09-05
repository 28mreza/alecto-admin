import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { HelpCenterComponent } from './help-center.component'

describe('HelpCenterComponent', () => {
  let fixture: ComponentFixture<HelpCenterComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelpCenterComponent],
      providers: [provideRouter([])],
    }).compileComponents()
    fixture = TestBed.createComponent(HelpCenterComponent)
    fixture.detectChanges()
  })

  it('renders the Coming Soon placeholder', () => {
    const host = fixture.nativeElement as HTMLElement
    expect(host.querySelector('app-coming-soon')).not.toBeNull()
    expect(host.textContent ?? '').toContain('Coming Soon!')
  })
})
