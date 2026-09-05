import { ChangeDetectionStrategy, Component } from '@angular/core'
import { ContentSectionComponent } from '../components/content-section.component'
import { DisplayFormComponent } from './display-form.component'

/**
 * Display settings page ported from
 * `shadcn-admin/src/features/settings/display/index.tsx`.
 */
@Component({
  selector: 'app-settings-display',
  standalone: true,
  imports: [ContentSectionComponent, DisplayFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-content-section
      title="Display"
      desc="Turn items on or off to control what's displayed in the app."
    >
      <app-display-form />
    </app-content-section>
  `,
})
export class DisplayComponent {}
