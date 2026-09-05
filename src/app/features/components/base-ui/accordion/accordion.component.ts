import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import { HlmAccordionImports } from '@spartan-ng/helm/accordion'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmCardImports } from '@spartan-ng/helm/card'
import { ConfigDrawerComponent } from '../../../../components/config-drawer/config-drawer.component'
import { HeaderComponent } from '../../../../components/layout/header/header.component'
import { MainComponent } from '../../../../components/layout/main/main.component'
import { ProfileDropdownComponent } from '../../../../components/profile-dropdown/profile-dropdown.component'
import { RefreshButtonComponent } from '../../../../components/refresh-button/refresh-button.component'
import { SearchComponent } from '../../../../components/search/search.component'
import { ThemeSwitchComponent } from '../../../../components/theme-switch/theme-switch.component'

interface AccordionDemoItem {
  trigger: string
  content: string
}

@Component({
  selector: 'app-accordion',
  standalone: true,
  imports: [
    HlmAccordionImports,
    HlmButtonImports,
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
  templateUrl: './accordion.component.html',
})
export class AccordionComponent {
  protected readonly multipleItems: AccordionDemoItem[] = [
    {
      trigger: 'Notification Settings',
      content:
        'Manage how you receive notifications. You can enable email alerts for updates or push notifications for mobile devices.',
    },
    {
      trigger: 'Privacy & Security',
      content:
        'Control your privacy settings and security preferences. Enable two-factor authentication and manage connected devices.',
    },
    {
      trigger: 'Billing & Subscription',
      content:
        'View your current plan, payment history, and upcoming invoices. Update your payment method or change your tier.',
    },
  ]

  protected readonly cardItems: AccordionDemoItem[] = [    {
      trigger: 'What subscription plans do you offer?',
      content:
        'Starter ($9/month), Professional ($29/month), and Enterprise ($99/month) with increasing limits and support.',
    },
    {
      trigger: 'How does billing work?',
      content:
        'Billing occurs automatically at the start of each cycle. We accept major credit cards, PayPal, and ACH for enterprise.',
    },
    {
      trigger: 'How do I cancel my subscription?',
      content:
        'Cancel anytime from account settings with no fees. Access continues until the end of the billing period.',
    },
  ]

  protected readonly bordersItems: AccordionDemoItem[] = [
    {
      trigger: 'How does billing work?',
      content:
        'We offer monthly and annual plans. Billing is charged at the start of each cycle and you can cancel anytime.',
    },
    {
      trigger: 'Is my data secure?',
      content:
        'Yes. End-to-end encryption, SOC 2 Type II compliance, and regular third-party audits.',
    },
    {
      trigger: 'What integrations do you support?',
      content:
        '500+ tools including Slack, Zapier, Salesforce, and HubSpot, plus a REST API for custom integrations.',
    },
  ]

  protected readonly showDetails = signal(false)
}
