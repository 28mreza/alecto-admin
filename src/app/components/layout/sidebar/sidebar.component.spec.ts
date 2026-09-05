import { Component } from '@angular/core'
import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { vi } from 'vitest'
import { SidebarComponent } from './sidebar.component'

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

@Component({
  standalone: true,
  imports: [SidebarComponent],
  template: `
    <app-sidebar collapsible="icon" variant="inset">
      <p>PROJECTED_MARKER_TEXT</p>
    </app-sidebar>
  `,
})
class HostComponent {}

describe('SidebarComponent (mobile has no sheet of its own)', () => {
  let fixture: ComponentFixture<HostComponent>

  beforeEach(async () => {
    mockMatchMedia(true)
    window.localStorage.clear()
    await TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [provideRouter([])],
    }).compileComponents()
    fixture = TestBed.createComponent(HostComponent)
    fixture.detectChanges()
  })

  it('renders no dialog panel itself on mobile (AppSidebar owns the mobile sheet)', () => {
    const host = fixture.nativeElement as HTMLElement
    expect(host.querySelector(':scope > div[role="dialog"]')).toBeNull()
    expect(host.querySelector('hlm-sheet')).toBeNull()
  })
})
