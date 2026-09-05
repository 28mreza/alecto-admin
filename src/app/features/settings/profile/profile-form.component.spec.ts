import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { vi } from 'vitest'
import { ToastService } from '../../../core/services/toast.service'
import { ProfileFormComponent } from './profile-form.component'

describe('ProfileFormComponent', () => {
  let fixture: ComponentFixture<ProfileFormComponent>
  let toast: { message: ReturnType<typeof vi.fn> }

  beforeEach(async () => {
    toast = { message: vi.fn() }
    await TestBed.configureTestingModule({
      imports: [ProfileFormComponent],
      providers: [
        provideRouter([]),
        { provide: ToastService, useValue: toast },
      ],
    }).compileComponents()
    fixture = TestBed.createComponent(ProfileFormComponent)
    fixture.detectChanges()
  })

  function host(): HTMLElement {
    return fixture.nativeElement as HTMLElement
  }

  function submit(): void {
    const form = host().querySelector('form')
    if (!form) throw new Error('form not found')
    form.dispatchEvent(new Event('submit'))
    fixture.detectChanges()
  }

  function component(): ProfileFormComponent {
    return fixture.componentInstance
  }

  it('starts with the source defaults for bio and urls', () => {
    expect(component().bio.value).toBe('I own a computer.')
    expect(component().urls.value).toEqual([
      'https://shadcn.com',
      'http://twitter.com/shadcn',
    ])
  })

  it('blocks submit on empty required fields and shows error messages', () => {
    submit()
    const text = host().textContent ?? ''
    expect(text).toContain('Please enter your username.')
    expect(text).toContain('Please select an email to display.')
    expect(toast.message).not.toHaveBeenCalled()
  })

  it('shows a min-length error for a short username', () => {
    component().username.setValue('a')
    component().username.markAsTouched()
    fixture.detectChanges()
    expect(host().textContent).toContain(
      'Username must be at least 2 characters.'
    )
  })

  it('shows a URL error for an invalid url entry', () => {
    component().urls.at(0).setValue('not-a-url')
    component().urls.at(0).markAsTouched()
    fixture.detectChanges()
    expect(host().textContent).toContain('Please enter a valid URL.')
  })

  it('appends a new url row when Add URL is clicked', () => {
    const before = host().querySelectorAll('#profile-url-0, #profile-url-1')
    expect(before.length).toBe(2)
    const addButton = Array.from(host().querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Add URL')
    )
    addButton?.click()
    fixture.detectChanges()
    expect(component().urls.length).toBe(3)
    expect(host().querySelector('#profile-url-2')).not.toBeNull()
  })

  it('submits valid values via showSubmittedData', () => {
    component().username.setValue('shadcn')
    component().email.setValue('m@example.com')
    submit()
    expect(toast.message).toHaveBeenCalledTimes(1)
    expect(toast.message).toHaveBeenCalledWith(
      'You submitted the following values:',
      expect.stringContaining('shadcn')
    )
    const payload = JSON.parse(toast.message.mock.calls[0][1] as string)
    expect(payload).toMatchObject({
      username: 'shadcn',
      email: 'm@example.com',
      bio: 'I own a computer.',
      urls: ['https://shadcn.com', 'http://twitter.com/shadcn'],
    })
  })
})
