import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { SidebarInsetComponent } from './sidebar-inset.component'

describe('SidebarInsetComponent', () => {
  let fixture: ComponentFixture<SidebarInsetComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [SidebarInsetComponent] })
    fixture = TestBed.createComponent(SidebarInsetComponent)
    fixture.detectChanges()
  })

  function host(): HTMLElement {
    return fixture.nativeElement as HTMLElement
  }

  it('puts the peer-data inset classes on the host (sibling of the .peer sidebar)', () => {
    const className = host().className
    expect(className).toContain('md:peer-data-[variant=inset]:m-2')
    expect(className).toContain('md:peer-data-[variant=inset]:ms-0')
    expect(className).toContain('md:peer-data-[variant=inset]:rounded-xl')
    expect(className).toContain('md:peer-data-[variant=inset]:shadow-sm')
    expect(className).toContain(
      'md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ms-2'
    )
  })

  it('participates as a flex item filling remaining width', () => {
    const className = host().className
    expect(className).toContain('flex')
    expect(className).toContain('flex-1')
    expect(className).toContain('min-w-0')
  })

  it('keeps the flex layout on the inner content div', () => {
    const inner = host().querySelector('div') as HTMLElement
    expect(inner).not.toBeNull()
    expect(inner.className).toContain('relative')
    expect(inner.className).toContain('flex')
    expect(inner.className).toContain('bg-background')
    expect(inner.className).toContain('flex-1')
  })

  it('appends the layout-provided className to the host', () => {
    fixture.componentRef.setInput(
      'className',
      'peer-data-[variant=inset]:has-data-[layout=fixed]:h-svh'
    )
    fixture.detectChanges()
    expect(host().className).toContain(
      'peer-data-[variant=inset]:has-data-[layout=fixed]:h-svh'
    )
  })
})
