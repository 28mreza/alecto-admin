import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { Component } from '@angular/core'
import { provideRouter, Router } from '@angular/router'
import { vi } from 'vitest'
import { SignOutDialogComponent } from './sign-out-dialog.component'

@Component({ selector: 'app-stub', standalone: true, template: '' })
class StubComponent {}

describe('SignOutDialogComponent', () => {
  let fixture: ComponentFixture<SignOutDialogComponent>

  beforeEach(async () => {
    document.body.innerHTML = ''
    await TestBed.configureTestingModule({
      imports: [SignOutDialogComponent],
      providers: [
        provideRouter([
          { path: 'tasks', component: StubComponent },
          { path: 'sign-in', component: StubComponent },
        ]),
      ],
    }).compileComponents()
    const router = TestBed.inject(Router)
    await router.navigate(['/tasks'])
    fixture = TestBed.createComponent(SignOutDialogComponent)
    fixture.componentRef.setInput('open', true)
    fixture.detectChanges()
    await fixture.whenStable()
    fixture.detectChanges()
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  function confirmButton(): HTMLButtonElement {
    const button = document.body.querySelector(
      'button[data-slot="alert-dialog-action"]'
    ) as HTMLButtonElement | null
    expect(button).not.toBeNull()
    return button!
  }

  it('renders the sign-out copy', () => {
    const dialog = document.body.querySelector(
      '[data-slot="alert-dialog-content"]'
    )
    expect(dialog?.textContent).toContain('Sign out')
    expect(dialog?.textContent).toContain('Are you sure you want to sign out?')
    expect(confirmButton().textContent).toContain('Sign out')
  })

  it('navigates to /sign-in with the redirect on confirm', () => {
    const router = TestBed.inject(Router)
    const navigate = vi.spyOn(router, 'navigate')
    confirmButton().click()

    expect(navigate).toHaveBeenCalledWith(['/sign-in'], {
      queryParams: { redirect: '/tasks' },
      replaceUrl: true,
    })
  })
})
