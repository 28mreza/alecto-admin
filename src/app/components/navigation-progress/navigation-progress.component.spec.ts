import { TestBed, type ComponentFixture } from '@angular/core/testing'
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router'
import { vi } from 'vitest'
import { Subject } from 'rxjs'
import { NavigationProgressComponent } from './navigation-progress.component'

describe('NavigationProgressComponent', () => {
  let events: Subject<unknown>
  let fixture: ComponentFixture<NavigationProgressComponent>

  beforeEach(() => {
    events = new Subject<unknown>()
    TestBed.configureTestingModule({
      imports: [NavigationProgressComponent],
      providers: [{ provide: Router, useValue: { events } }],
    })
    fixture = TestBed.createComponent(NavigationProgressComponent)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  function progressBar(): HTMLElement | null {
    return fixture.nativeElement.querySelector('.navigation-progress')
  }

  it('is hidden initially', () => {
    fixture.detectChanges()
    expect(progressBar()).toBeNull()
  })

  it('shows the progress bar on NavigationStart', () => {
    events.next(new NavigationStart(1, '/dashboard'))
    fixture.detectChanges()
    expect(progressBar()).not.toBeNull()
  })

  it('keeps the bar visible until 400ms after NavigationEnd', () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
    events.next(new NavigationStart(1, '/dashboard'))
    fixture.detectChanges()
    expect(progressBar()).not.toBeNull()

    events.next(new NavigationEnd(1, '/dashboard', '/dashboard'))
    fixture.detectChanges()
    expect(progressBar()).not.toBeNull()

    vi.advanceTimersByTime(400)
    fixture.detectChanges()
    expect(progressBar()).toBeNull()
  })

  it('hides the progress bar on NavigationError', () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
    events.next(new NavigationStart(1, '/dashboard'))
    fixture.detectChanges()
    expect(progressBar()).not.toBeNull()

    events.next(new NavigationError(1, '/dashboard', new Error('boom')))
    fixture.detectChanges()
    expect(progressBar()).not.toBeNull()

    vi.advanceTimersByTime(400)
    fixture.detectChanges()
    expect(progressBar()).toBeNull()
  })

  it('hides the progress bar on NavigationCancel', () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
    events.next(new NavigationStart(1, '/dashboard'))
    fixture.detectChanges()
    expect(progressBar()).not.toBeNull()

    events.next(new NavigationCancel(1, '/dashboard', 'cancelled'))
    fixture.detectChanges()
    expect(progressBar()).not.toBeNull()

    vi.advanceTimersByTime(400)
    fixture.detectChanges()
    expect(progressBar()).toBeNull()
  })
})
