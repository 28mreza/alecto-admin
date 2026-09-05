import { ChangeDetectionStrategy, Component } from '@angular/core'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucideTelescope } from '@ng-icons/lucide'

/**
 * "Coming Soon" placeholder ported from
 * `shadcn-admin/src/components/coming-soon.tsx`: full-viewport centered
 * Telescope icon (size 72) + "Coming Soon!" heading + muted description.
 */
@Component({
  selector: 'app-coming-soon',
  standalone: true,
  imports: [NgIcon],
  providers: [provideIcons({ lucideTelescope })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="h-svh">
      <div
        class="m-auto flex h-full w-full flex-col items-center justify-center gap-2"
      >
        <ng-icon name="lucideTelescope" size="72" />
        <h1 class="text-4xl leading-tight font-bold">Coming Soon!</h1>
        <p class="text-muted-foreground text-center">
          This page has not been created yet. <br />
          Stay tuned though!
        </p>
      </div>
    </div>
  `,
})
export class ComingSoonComponent {}
