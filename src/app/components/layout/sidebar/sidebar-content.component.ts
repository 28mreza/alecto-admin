import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({
  selector: 'app-sidebar-content',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-slot': 'sidebar-content',
    'data-sidebar': 'content',
    class:
      'flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden',
  },
  template: `<ng-content />`,
})
export class SidebarContentComponent {}
