import { ChangeDetectionStrategy, Component } from '@angular/core'
import { ComingSoonComponent } from '../../components/coming-soon/coming-soon.component'

/**
 * Help Center page (`/help-center`).
 *
 * Ported from `shadcn-admin/src/routes/_authenticated/help-center/index.tsx`,
 * which renders `ComingSoon` directly — this rebuild has no help-center
 * feature yet, so the page intentionally shows the same placeholder.
 */
@Component({
  selector: 'app-help-center',
  standalone: true,
  imports: [ComingSoonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ` <app-coming-soon /> `,
})
export class HelpCenterComponent {}
