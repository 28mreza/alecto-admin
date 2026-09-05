import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core'
import { barWidth } from './bar-list.util'

export interface BarListItem {
  readonly name: string
  readonly value: number
}

@Component({
  selector: 'app-simple-bar-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ul class="space-y-3">
      @for (item of items(); track item.name) {
        <li class="flex items-center justify-between gap-3">
          <div class="min-w-0 flex-1">
            <div class="text-muted-foreground mb-1 truncate text-xs">
              {{ item.name }}
            </div>
            <div class="bg-muted h-2.5 w-full rounded-full">
              <div
                [class]="'h-2.5 rounded-full ' + barClass()"
                [style.width]="widthFor(item.value)"
              ></div>
            </div>
          </div>
          <div class="ps-2 text-xs font-medium tabular-nums">
            {{ valueFormatter()(item.value) }}
          </div>
        </li>
      }
    </ul>
  `,
})
export class SimpleBarListComponent {
  readonly items = input<BarListItem[]>([])
  readonly barClass = input('bg-primary')
  readonly valueFormatter = input<(value: number) => string>((value) =>
    String(value)
  )

  private readonly maxValue = computed(() =>
    this.items().reduce((max, item) => Math.max(max, item.value), 1)
  )

  protected widthFor(value: number): string {
    return barWidth(value, this.maxValue())
  }
}
