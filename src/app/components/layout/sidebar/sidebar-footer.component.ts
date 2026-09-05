import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({
  selector: 'app-sidebar-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-slot': 'sidebar-footer',
    'data-sidebar': 'footer',
    class: 'flex flex-col gap-2 p-2',
  },
  template: `<ng-content />`,
})
export class SidebarFooterComponent {}
