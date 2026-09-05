import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { cn } from '../../shared/utils/cn'

/**
 * 503 page ported from `shadcn-admin/src/features/errors/maintenance-error.tsx`.
 * Single outline "Learn more" button with no navigation (like the source).
 */
@Component({
  selector: 'app-maintenance-error',
  standalone: true,
  imports: [HlmButtonImports],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="rootClasses()">
      <div
        class="m-auto flex h-full w-full flex-col items-center justify-center gap-2"
      >
        <h1 class="text-[7rem] leading-tight font-bold">503</h1>
        <span class="font-medium">Website is under maintenance!</span>
        <p class="text-muted-foreground text-center">
          The site is not available at the moment. <br />
          We'll be back online shortly.
        </p>
        <div class="mt-6 flex gap-4">
          <button hlmBtn variant="outline" type="button">Learn more</button>
        </div>
      </div>
    </div>
  `,
})
export class MaintenanceErrorComponent {
  readonly className = input('')

  protected readonly rootClasses = computed(() => cn('h-svh', this.className()))
}
