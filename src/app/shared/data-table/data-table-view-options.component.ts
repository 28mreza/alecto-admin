import { ChangeDetectionStrategy, Component, input } from '@angular/core'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucideSlidersHorizontal } from '@ng-icons/lucide'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu'
import { type TableEngine } from './table-engine'

/**
 * "View" options dropdown: "Toggle columns" label with a checkbox item per
 * hideable column wired to engine column visibility.
 */
@Component({
  selector: 'app-data-table-view-options',
  standalone: true,
  imports: [NgIcon, HlmButtonImports, HlmDropdownMenuImports],
  providers: [provideIcons({ lucideSlidersHorizontal })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      hlmBtn
      variant="outline"
      size="sm"
      type="button"
      class="ms-auto hidden h-8 lg:flex"
      hlmDropdownMenuTrigger
      [hlmDropdownMenuTrigger]="menu"
    >
      <ng-icon
        name="lucideSlidersHorizontal"
        aria-hidden="true"
        class="size-4"
      />
      View
    </button>

    <ng-template #menu>
      <div hlmDropdownMenu class="w-36" align="end">
        <div hlmDropdownMenuLabel>Toggle columns</div>
        <hr hlmDropdownMenuSeparator />
        @for (column of engine().hideableColumns(); track column.id) {
          <button
            type="button"
            hlmDropdownMenuCheckbox
            class="capitalize"
            [checked]="engine().isColumnVisible(column.id)"
            (triggered)="engine().toggleColumnVisibility(column.id)"
          >
            <hlm-dropdown-menu-checkbox-indicator />
            {{ column.header || column.id }}
          </button>
        }
      </div>
    </ng-template>
  `,
})
export class DataTableViewOptionsComponent<T extends { id: string }> {
  readonly engine = input.required<TableEngine<T>>()
}
