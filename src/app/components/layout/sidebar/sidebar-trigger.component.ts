import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucidePanelLeft } from '@ng-icons/lucide'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { SidebarService } from '../../../core/services/sidebar.service'

@Component({
  selector: 'app-sidebar-trigger',
  standalone: true,
  imports: [HlmButtonImports, NgIcon],
  providers: [provideIcons({ lucidePanelLeft })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-slot': 'sidebar-trigger',
    'data-sidebar': 'trigger',
  },
  template: `
    <button
      hlmBtn
      [variant]="variant()"
      size="icon"
      class="size-7"
      (click)="toggle()"
    >
      <ng-icon name="lucidePanelLeft" />
      <span class="sr-only">Toggle Sidebar</span>
    </button>
  `,
})
export class SidebarTriggerComponent {
  readonly variant = input<
    'default' | 'outline' | 'ghost' | 'secondary' | 'destructive' | 'link'
  >('ghost')

  private readonly sidebarService = inject(SidebarService)

  protected toggle(): void {
    if (this.sidebarService.isMobile()) {
      this.sidebarService.toggleMobileOpen()
    } else {
      this.sidebarService.toggleOpen()
    }
  }
}
