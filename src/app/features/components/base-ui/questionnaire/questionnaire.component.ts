import { ChangeDetectionStrategy, Component } from '@angular/core'
import { type BrnQuestionnaireItemDefinition } from '@spartan-ng/brain/questionnaire'
import { HlmCardImports } from '@spartan-ng/helm/card'
import { HlmQuestionnaireImports } from '@spartan-ng/helm/questionnaire'
import { ConfigDrawerComponent } from '../../../../components/config-drawer/config-drawer.component'
import { HeaderComponent } from '../../../../components/layout/header/header.component'
import { MainComponent } from '../../../../components/layout/main/main.component'
import { ProfileDropdownComponent } from '../../../../components/profile-dropdown/profile-dropdown.component'
import { RefreshButtonComponent } from '../../../../components/refresh-button/refresh-button.component'
import { SearchComponent } from '../../../../components/search/search.component'
import { ThemeSwitchComponent } from '../../../../components/theme-switch/theme-switch.component'

/**
 * Questionnaire page (`/components/questionnaire`).
 *
 * Simplified vs https://spartan.ng/components/questionnaire (no
 * signal-forms, no toast): progress, one required choice item, one
 * optional item, and prev/skip/next/submit actions.
 */
@Component({
  selector: 'app-questionnaire',
  standalone: true,
  imports: [
    HlmQuestionnaireImports,
    HlmCardImports,
    HeaderComponent,
    MainComponent,
    SearchComponent,
    RefreshButtonComponent,
    ThemeSwitchComponent,
    ConfigDrawerComponent,
    ProfileDropdownComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './questionnaire.component.html',
})
export class QuestionnaireComponent {
  protected readonly items: readonly BrnQuestionnaireItemDefinition[] = [
    {
      name: 'direction',
      required: true,
      choices: [{ value: 'tool-calls' }, { value: 'approvals' }, { value: 'handoffs' }],
    },
    {
      name: 'signals',
      required: false,
      choices: [{ value: 'progress' }, { value: 'decisions' }, { value: 'risks' }],
    },
  ]
}
