import { ChangeDetectionStrategy, Component, input } from '@angular/core'
import { HlmSeparatorImports } from '@spartan-ng/helm/separator'

/**
 * Section wrapper ported from
 * `shadcn-admin/src/features/settings/components/content-section.tsx`.
 * Renders the page title/description, a separator and a scrollable content
 * area projecting the page form.
 */
@Component({
  selector: 'app-content-section',
  standalone: true,
  imports: [HlmSeparatorImports],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-1 flex-col">
      <div class="flex-none">
        <h3 class="text-lg font-medium">{{ title() }}</h3>
        <p class="text-muted-foreground text-sm">{{ desc() }}</p>
      </div>
      <hlm-separator class="my-4 flex-none" />
      <div
        class="faded-bottom h-full w-full overflow-y-auto scroll-smooth pe-4 pb-12"
      >
        <div class="-mx-1 px-1.5 lg:max-w-xl">
          <ng-content />
        </div>
      </div>
    </div>
  `,
})
export class ContentSectionComponent {
  readonly title = input.required<string>()
  readonly desc = input.required<string>()
}
