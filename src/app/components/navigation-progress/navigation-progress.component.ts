import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  inject,
  signal,
} from '@angular/core'
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-navigation-progress',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (visible()) {
      <div class="navigation-progress" aria-hidden="true"></div>
    }
  `,
  styles: [
    `
      .navigation-progress {
        position: fixed;
        top: 0;
        left: 0;
        height: 2px;
        width: 100%;
        z-index: 9999;
        background: var(--muted-foreground);
        transform-origin: 0 0;
        animation: navigation-progress-grow 2s ease-out infinite;
      }
      @keyframes navigation-progress-grow {
        0% {
          transform: scaleX(0);
        }
        60% {
          transform: scaleX(0.6);
        }
        100% {
          transform: scaleX(0.99);
        }
      }
    `,
  ],
})
export class NavigationProgressComponent implements OnDestroy {
  private readonly router = inject(Router)
  protected readonly visible = signal(false)
  private readonly subscription: Subscription

  constructor() {
    this.subscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.visible.set(true)
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationError ||
        event instanceof NavigationCancel
      ) {
        setTimeout(() => this.visible.set(false), 400)
      }
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }
}
