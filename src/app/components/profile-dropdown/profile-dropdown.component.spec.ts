import { OverlayContainer } from '@angular/cdk/overlay'
import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { Component } from '@angular/core'
import { provideRouter, Router } from '@angular/router'
import { vi } from 'vitest'
import { ProfileDropdownComponent } from './profile-dropdown.component'

@Component({ selector: 'app-settings-stub', standalone: true, template: '' })
class SettingsStubComponent {}

describe('ProfileDropdownComponent', () => {
  let fixture: ComponentFixture<ProfileDropdownComponent>
  let overlay: HTMLElement

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProfileDropdownComponent],
      providers: [
        provideRouter([
          { path: 'settings', component: SettingsStubComponent },
          { path: 'sign-in', component: SettingsStubComponent },
        ]),
      ],
    })
    fixture = TestBed.createComponent(ProfileDropdownComponent)
    overlay = TestBed.inject(OverlayContainer).getContainerElement()
    fixture.detectChanges()
  })

  function trigger(): HTMLButtonElement {
    return fixture.nativeElement.querySelector(
      'button[data-slot="dropdown-menu-trigger"]'
    ) as HTMLButtonElement
  }

  async function openMenu(): Promise<void> {
    trigger().click()
    fixture.detectChanges()
    await fixture.whenStable()
  }

  it('renders the avatar trigger with initials fallback', () => {
    // NOTE: the brain avatar only inserts the <img> after its load event
    // fires, which never happens in jsdom — so the SN fallback is what
    // renders here (and until the /avatars asset arrives in Task 13).
    expect(fixture.nativeElement.querySelector('hlm-avatar')).not.toBeNull()
    expect(
      fixture.nativeElement.querySelector('[data-slot="avatar-fallback"]')
        ?.textContent
    ).toContain('SN')
  })

  it('opens a menu with the user label and source items', async () => {
    await openMenu()

    expect(overlay.textContent).toContain('Muhamad Reza')
    expect(overlay.textContent).toContain('mrezadev@gmail.com')
    for (const item of [
      'Profile',
      'Billing',
      'Settings',
      'New Team',
      'Sign out',
    ]) {
      expect(overlay.textContent).toContain(item)
    }
    expect(overlay.textContent).toContain('⇧⌘P')
    expect(overlay.textContent).toContain('⇧⌘Q')
  })

  it('opens the sign-out dialog instead of navigating directly', async () => {
    const router = TestBed.inject(Router)
    const navigate = vi.spyOn(router, 'navigate')
    await openMenu()

    const signOut = Array.from(
      overlay.querySelectorAll<HTMLButtonElement>(
        'button[data-slot="dropdown-menu-item"]'
      )
    ).find((item) => item.textContent?.includes('Sign out'))
    expect(signOut).not.toBeUndefined()
    signOut!.click()
    fixture.detectChanges()
    await fixture.whenStable()

    expect(navigate).not.toHaveBeenCalled()
    const dialog = document.body.querySelector(
      '[data-slot="alert-dialog-content"]'
    )
    expect(dialog?.textContent).toContain('Are you sure you want to sign out?')
  })

  it('navigates to /sign-in with redirect on dialog confirm', async () => {
    const router = TestBed.inject(Router)
    const navigate = vi.spyOn(router, 'navigate')
    await openMenu()

    const signOut = Array.from(
      overlay.querySelectorAll<HTMLButtonElement>(
        'button[data-slot="dropdown-menu-item"]'
      )
    ).find((item) => item.textContent?.includes('Sign out'))
    signOut!.click()
    fixture.detectChanges()
    await fixture.whenStable()

    const confirm = document.body.querySelector(
      'button[data-slot="alert-dialog-action"]'
    ) as HTMLButtonElement | null
    expect(confirm).not.toBeNull()
    confirm!.click()

    expect(navigate).toHaveBeenCalledWith(['/sign-in'], {
      queryParams: { redirect: '/' },
      replaceUrl: true,
    })
  })
})
