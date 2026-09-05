import { ChangeDetectionStrategy, Component } from '@angular/core'
import { ContentSectionComponent } from '../components/content-section.component'
import { AccountFormComponent } from './account-form.component'

/**
 * Account settings page ported from
 * `shadcn-admin/src/features/settings/account/index.tsx`.
 */
@Component({
  selector: 'app-settings-account',
  standalone: true,
  imports: [ContentSectionComponent, AccountFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-content-section
      title="Account"
      desc="Update your account settings. Set your preferred language and timezone."
    >
      <app-account-form />
    </app-content-section>
  `,
})
export class AccountComponent {}
