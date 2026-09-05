import { ChangeDetectionStrategy, Component } from '@angular/core'
import { ContentSectionComponent } from '../components/content-section.component'
import { ProfileFormComponent } from './profile-form.component'

/**
 * Profile settings page ported from
 * `shadcn-admin/src/features/settings/profile/index.tsx`.
 */
@Component({
  selector: 'app-settings-profile',
  standalone: true,
  imports: [ContentSectionComponent, ProfileFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-content-section
      title="Profile"
      desc="This is how others will see you on the site."
    >
      <app-profile-form />
    </app-content-section>
  `,
})
export class ProfileComponent {}
