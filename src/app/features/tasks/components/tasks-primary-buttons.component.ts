import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucideDownload, lucidePlus } from '@ng-icons/lucide'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { TasksStoreService } from '../store/tasks-store.service'

/**
 * Heading-row actions for the tasks page.
 *
 * Ported from `tasks-primary-buttons.tsx`: an outline Import button and a
 * Create button opening the matching dialogs via the store.
 */
@Component({
  selector: 'app-tasks-primary-buttons',
  standalone: true,
  imports: [NgIcon, HlmButtonImports],
  providers: [provideIcons({ lucideDownload, lucidePlus })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex gap-2">
      <button
        hlmBtn
        variant="outline"
        type="button"
        class="space-x-1"
        (click)="store.setOpen('import')"
      >
        <span>Import</span>
        <ng-icon name="lucideDownload" aria-hidden="true" class="size-[18px]" />
      </button>
      <button
        hlmBtn
        type="button"
        class="space-x-1"
        (click)="store.setOpen('create')"
      >
        <span>Create</span>
        <ng-icon name="lucidePlus" aria-hidden="true" class="size-[18px]" />
      </button>
    </div>
  `,
})
export class TasksPrimaryButtonsComponent {
  protected readonly store = inject(TasksStoreService)
}
