import { ChangeDetectionStrategy, Component } from '@angular/core'
import { ContentSectionComponent } from '../components/content-section.component'
import { NotificationsFormComponent } from './notifications-form.component'

/**
 * Notifications settings page ported from
 * `shadcn-admin/src/features/settings/notifications/index.tsx`.
 */
@Component({
  selector: 'app-settings-notifications',
  standalone: true,
  imports: [ContentSectionComponent, NotificationsFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-content-section
      title="Notifications"
      desc="Configure how you receive notifications."
    >
      <app-notifications-form />
    </app-content-section>
  `,
})
export class NotificationsComponent {}
