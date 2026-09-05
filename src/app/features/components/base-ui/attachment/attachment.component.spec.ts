import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { vi } from 'vitest'
import { AttachmentComponent } from './attachment.component'

describe('AttachmentComponent', () => {
  let fixture: ComponentFixture<AttachmentComponent>

  beforeEach(async () => {
    // ThemeSwitch (via ThemeService) needs matchMedia, which jsdom lacks —
    // same stub as dashboard/chats page specs.
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: (query: string) => ({
        matches: false,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }),
    })
    await TestBed.configureTestingModule({
      imports: [AttachmentComponent],
      providers: [provideRouter([])],
    }).compileComponents()
    fixture = TestBed.createComponent(AttachmentComponent)
    fixture.detectChanges()
  })

  function text(): string {
    return (fixture.nativeElement as HTMLElement).textContent ?? ''
  }

  it('renders the page heading', () => {
    expect(text()).toContain('Attachment')
  })

  it('renders basic, states, image and sizes demos', () => {
    const content = text()
    expect(content).toContain('message-renderer.tsx')
    expect(content).toContain('Uploading · 64%')
    expect(content).toContain('Upload failed · retry')
    expect(content).toContain('design-preview.png')
    expect(content).toContain('notes-xs.txt')
  })
})
