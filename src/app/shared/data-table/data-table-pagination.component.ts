import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucideChevronLeft, lucideChevronRight } from '@ng-icons/lucide'
import {
  HlmPagination,
  HlmPaginationContent,
  HlmPaginationEllipsis,
  HlmPaginationItem,
  HlmPaginationLink,
  createPageArray,
} from '@spartan-ng/helm/pagination'
import { HlmSelectImports } from '@spartan-ng/helm/select'
import { PAGE_SIZE_OPTIONS, type TableEngine } from './table-engine'

/**
 * Pagination footer: Spartan advanced numbered pagination in a single
 * responsive bar — total info + previous/numbered/next links + a labeled
 * rows-per-page select. Page windowing reuses Spartan's own
 * `createPageArray`; engine state stays the single source of truth and
 * URL sync is handled by the data-table's existing effect.
 */
@Component({
  selector: 'app-data-table-pagination',
  standalone: true,
  imports: [
    NgIcon,
    HlmSelectImports,
    HlmPagination,
    HlmPaginationContent,
    HlmPaginationItem,
    HlmPaginationLink,
    HlmPaginationEllipsis,
  ],
  providers: [
    provideIcons({
      lucideChevronLeft,
      lucideChevronRight,
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="flex flex-wrap items-center justify-between gap-x-2 gap-y-3 overflow-clip px-2"
    >
      <div class="flex items-center gap-1 text-sm text-nowrap">
        <b>{{ totalItems() }}</b>
        total items |
        <b>{{ totalPages() }}</b>
        pages
      </div>
      <nav hlmPagination aria-label="Table pagination" class="w-auto">
        <ul hlmPaginationContent>
          @if (canPreviousPage()) {
            <li hlmPaginationItem>
              <button
                type="button"
                hlmPaginationLink
                aria-label="Go to previous page"
                (click)="goToPreviousPage()"
              >
                <ng-icon
                  name="lucideChevronLeft"
                  aria-hidden="true"
                  class="size-4"
                />
              </button>
            </li>
          }
          @for (page of pageNumbers(); track $index) {
            <li hlmPaginationItem>
              @if (page === '...') {
                <hlm-pagination-ellipsis />
              } @else {
                <button
                  type="button"
                  hlmPaginationLink
                  [isActive]="page === currentPage()"
                  [attr.aria-label]="'Go to page ' + page"
                  [attr.aria-current]="page === currentPage() ? 'page' : null"
                  (click)="goToPage(page)"
                >
                  {{ page }}
                </button>
              }
            </li>
          }
          @if (canNextPage()) {
            <li hlmPaginationItem>
              <button
                type="button"
                hlmPaginationLink
                aria-label="Go to next page"
                (click)="goToNextPage()"
              >
                <ng-icon
                  name="lucideChevronRight"
                  aria-hidden="true"
                  class="size-4"
                />
              </button>
            </li>
          }
        </ul>
      </nav>
      <div class="flex items-center gap-2">
        <p class="hidden text-sm font-medium sm:block">Rows per page</p>
        <hlm-select
          [value]="pageSizeValue()"
          (valueChange)="onPageSizeChange($event)"
        >
          <hlm-select-trigger class="h-8 w-[70px]">
            <hlm-select-value />
          </hlm-select-trigger>
          <hlm-select-content *hlmSelectPortal>
            @for (size of pageSizeOptions; track size) {
              <hlm-select-item [value]="stringify(size)">
                {{ size }}
              </hlm-select-item>
            }
          </hlm-select-content>
        </hlm-select>
      </div>
    </div>
  `,
})
export class DataTablePaginationComponent<T extends { id: string }> {
  readonly engine = input.required<TableEngine<T>>()

  protected readonly pageSizeOptions: number[] = [...PAGE_SIZE_OPTIONS]

  protected readonly currentPage = computed(
    () => this.engine().state().pagination.pageIndex + 1
  )

  protected readonly totalPages = computed(() =>
    Math.max(1, this.engine().pageCount())
  )

  protected readonly totalItems = computed(
    () => this.engine().filteredRows().length
  )

  protected readonly pageNumbers = computed(() =>
    createPageArray(
      this.currentPage(),
      this.engine().state().pagination.pageSize,
      this.totalItems(),
      7
    )
  )

  protected readonly pageSizeValue = computed(() =>
    String(this.engine().state().pagination.pageSize)
  )

  protected readonly canPreviousPage = computed(
    () => this.engine().state().pagination.pageIndex > 0
  )

  protected readonly canNextPage = computed(
    () =>
      this.engine().state().pagination.pageIndex <
      Math.max(0, this.engine().pageCount() - 1)
  )

  protected stringify(size: number): string {
    return String(size)
  }

  protected onPageSizeChange(value: string | number | null | undefined): void {
    const parsed = Number(value)
    if (Number.isInteger(parsed) && parsed > 0) {
      this.engine().setPageSize(parsed)
    }
  }

  protected goToPage(page: number): void {
    this.engine().setPageIndex(page - 1)
  }

  protected goToPreviousPage(): void {
    this.engine().setPageIndex(this.engine().state().pagination.pageIndex - 1)
  }

  protected goToNextPage(): void {
    this.engine().setPageIndex(this.engine().state().pagination.pageIndex + 1)
  }
}
