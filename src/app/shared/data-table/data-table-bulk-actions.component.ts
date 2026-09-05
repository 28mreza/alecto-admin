import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucideX } from '@ng-icons/lucide'
import { HlmBadgeImports } from '@spartan-ng/helm/badge'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmSeparatorImports } from '@spartan-ng/helm/separator'
import { type TableEngine } from './table-engine'

/**
 * Floating bottom bar shown while rows are selected: selected count badge,
 * a projected action slot (`<ng-content />`) and a clear-selection button.
 */
@Component({
  selector: 'app-data-table-bulk-actions',
  standalone: true,
  imports: [NgIcon, HlmBadgeImports, HlmButtonImports, HlmSeparatorImports],
  providers: [provideIcons({ lucideX })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (selectedCount() > 0) {
      <div
        role="toolbar"
        [attr.aria-label]="
          'Bulk actions for ' +
          selectedCount() +
          ' selected ' +
          entityName() +
          's'
        "
        class="fixed bottom-4 left-1/2 z-50 -translate-x-1/2"
      >
        <div
          class="bg-background/95 supports-backdrop-filter:bg-background/60 flex items-center gap-x-2 rounded-xl border p-2 shadow-xl backdrop-blur-lg"
        >
          <button
            hlmBtn
            variant="outline"
            size="icon"
            type="button"
            class="size-6 rounded-full"
            (click)="clearSelection()"
            aria-label="Clear selection"
            title="Clear selection"
          >
            <ng-icon name="lucideX" aria-hidden="true" class="size-4" />
          </button>
          <div hlmSeparator orientation="vertical" class="h-5"></div>
          <div class="flex items-center gap-x-1 text-sm">
            <span hlmBadge variant="default" class="min-w-8 rounded-lg">
              {{ selectedCount() }}
            </span>
            <span class="hidden sm:inline">{{ entityName() }}</span>
            selected
          </div>
          <div hlmSeparator orientation="vertical" class="h-5"></div>
          <ng-content />
        </div>
      </div>
    }
  `,
})
export class DataTableBulkActionsComponent<T extends { id: string }> {
  readonly engine = input.required<TableEngine<T>>()
  readonly entityName = input('row')

  protected readonly selectedCount = computed(
    () => this.engine().selectedRows().length
  )

  protected clearSelection(): void {
    this.engine().resetRowSelection()
  }
}
