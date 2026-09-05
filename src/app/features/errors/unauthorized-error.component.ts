import { Location } from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core'
import { Router } from '@angular/router'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { cn } from '../../shared/utils/cn'

/**
 * 401 page ported from `shadcn-admin/src/features/errors/unauthorized-error.tsx`.
 */
@Component({
  selector: 'app-unauthorized-error',
  standalone: true,
  imports: [HlmButtonImports],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="rootClasses()">
      <div
        class="m-auto flex h-full w-full flex-col items-center justify-center gap-2"
      >
        <h1 class="text-[7rem] leading-tight font-bold">401</h1>
        <span class="font-medium">Unauthorized Access</span>
        <p class="text-muted-foreground text-center">
          Please log in with the appropriate credentials <br />
          to access this resource.
        </p>
        <div class="mt-6 flex gap-4">
          <button hlmBtn variant="outline" type="button" (click)="goBack()">
            Go Back
          </button>
          <button hlmBtn type="button" (click)="goHome()">Back to Home</button>
        </div>
      </div>
    </div>
  `,
})
export class UnauthorizedErrorComponent {
  readonly className = input('')

  private readonly location = inject(Location)
  private readonly router = inject(Router)

  protected readonly rootClasses = computed(() => cn('h-svh', this.className()))

  protected goBack(): void {
    this.location.back()
  }

  protected goHome(): void {
    void this.router.navigate(['/'])
  }
}
