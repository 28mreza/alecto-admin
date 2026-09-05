import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core'

@Component({
  selector: 'app-sidebar-inset',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-slot': 'sidebar-inset',
    '[class]': 'hostClasses()',
  },
  template: `
    <div class="bg-background relative flex w-full flex-1 flex-col">
      <ng-content />
    </div>
  `,
})
export class SidebarInsetComponent {
  readonly className = input('')

  readonly hostClasses = computed(() =>
    [
      'flex flex-1 min-w-0 flex-col',
      'md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ms-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ms-2',
      this.className(),
    ].join(' ')
  )
}
