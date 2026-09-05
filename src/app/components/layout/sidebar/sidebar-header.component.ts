import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({
  selector: 'app-sidebar-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-slot': 'sidebar-header',
    'data-sidebar': 'header',
    class: 'flex flex-col gap-2 p-2',
  },
  template: `<ng-content />`,
})
export class SidebarHeaderComponent {}
