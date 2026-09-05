import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core'
import { NgIcon, provideIcons } from '@ng-icons/core'
import {
  lucideArrowDown,
  lucideArrowUp,
  lucideChevronsUpDown,
  lucideEyeOff,
} from '@ng-icons/lucide'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu'
import { type TableEngine } from './table-engine'

/**
 * Sortable column header mirroring the source `DataTableColumnHeader`:
 * clicking the title opens a dropdown menu with Asc / Desc items and,
 * when the column can hide, a separator plus a Hide item.
 */
@Component({
  selector: 'app-data-table-column-header',
  standalone: true,
  imports: [NgIcon, HlmButtonImports, HlmDropdownMenuImports],
  providers: [
    provideIcons({
      lucideArrowDown,
      lucideArrowUp,
      lucideChevronsUpDown,
      lucideEyeOff,
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (!canSort()) {
      <div>{{ title() }}</div>
    } @else {
      <div class="flex items-center space-x-2">
        <button
          hlmBtn
          variant="ghost"
          size="sm"
          type="button"
          class="data-[state=open]:bg-accent h-8"
          hlmDropdownMenuTrigger
          [hlmDropdownMenuTrigger]="menu"
          [attr.aria-label]="'Sort by ' + title()"
        >
          <span>{{ title() }}</span>
          @if (sort() === 'desc') {
            <ng-icon
              name="lucideArrowDown"
              aria-hidden="true"
              class="ms-2 size-4"
            />
          } @else if (sort() === 'asc') {
            <ng-icon
              name="lucideArrowUp"
              aria-hidden="true"
              class="ms-2 size-4"
            />
          } @else {
            <ng-icon
              name="lucideChevronsUpDown"
              aria-hidden="true"
              class="ms-2 size-4"
            />
          }
        </button>
        <ng-template #menu>
          <div hlmDropdownMenu align="start">
            <button type="button" hlmDropdownMenuItem (click)="sortAsc()">
              <ng-icon
                name="lucideArrowUp"
                aria-hidden="true"
                class="text-muted-foreground/70 size-3.5"
              />
              Asc
            </button>
            <button type="button" hlmDropdownMenuItem (click)="sortDesc()">
              <ng-icon
                name="lucideArrowDown"
                aria-hidden="true"
                class="text-muted-foreground/70 size-3.5"
              />
              Desc
            </button>
            @if (canHide()) {
              <hr hlmDropdownMenuSeparator />
              <button type="button" hlmDropdownMenuItem (click)="hideColumn()">
                <ng-icon
                  name="lucideEyeOff"
                  aria-hidden="true"
                  class="text-muted-foreground/70 size-3.5"
                />
                Hide
              </button>
            }
          </div>
        </ng-template>
      </div>
    }
  `,
})
export class DataTableColumnHeaderComponent<T extends { id: string }> {
  readonly engine = input.required<TableEngine<T>>()
  readonly columnId = input.required<string>()
  readonly title = input.required<string>()

  protected readonly sort = computed(() =>
    this.engine().getSort(this.columnId())
  )

  protected readonly canSort = computed(() => {
    const column = this.engine()
      .columns()
      .find((c) => c.id === this.columnId())
    return column === undefined || column.enableSorting !== false
  })

  protected readonly canHide = computed(() => {
    const column = this.engine()
      .columns()
      .find((c) => c.id === this.columnId())
    return column === undefined || column.enableHiding !== false
  })

  protected sortAsc(): void {
    this.engine().setSorting([{ column: this.columnId(), direction: 'asc' }])
  }

  protected sortDesc(): void {
    this.engine().setSorting([{ column: this.columnId(), direction: 'desc' }])
  }

  protected hideColumn(): void {
    this.engine().setColumnVisibility(this.columnId(), false)
  }
}
