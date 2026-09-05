import { ChangeDetectionStrategy, Component } from '@angular/core'
import { ContentSectionComponent } from '../components/content-section.component'
import { AppearanceFormComponent } from './appearance-form.component'

/**
 * Appearance settings page ported from
 * `shadcn-admin/src/features/settings/appearance/index.tsx`.
 */
@Component({
  selector: 'app-settings-appearance',
  standalone: true,
  imports: [ContentSectionComponent, AppearanceFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-content-section
      title="Appearance"
      desc="Customize the appearance of the app. Automatically switch between day and night themes."
    >
      <app-appearance-form />
    </app-content-section>
  `,
})
export class AppearanceComponent {}
