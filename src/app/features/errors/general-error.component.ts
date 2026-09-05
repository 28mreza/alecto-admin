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
 * 500 page ported from `shadcn-admin/src/features/errors/general-error.tsx`.
 * `minimal` hides the big code and the buttons (defaults to false).
 */
@Component({
  selector: 'app-general-error',
  standalone: true,
  imports: [HlmButtonImports],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="rootClasses()">
      <div
        class="m-auto flex h-full w-full flex-col items-center justify-center gap-2"
      >
        @if (!minimal()) {
          <h1 class="text-[7rem] leading-tight font-bold">500</h1>
        }
        <span class="font-medium">Oops! Something went wrong :')</span>
        <p class="text-muted-foreground text-center">
          We apologize for the inconvenience. <br />
          Please try again later.
        </p>
        @if (!minimal()) {
          <div class="mt-6 flex gap-4">
            <button hlmBtn variant="outline" type="button" (click)="goBack()">
              Go Back
            </button>
            <button hlmBtn type="button" (click)="goHome()">
              Back to Home
            </button>
          </div>
        }
      </div>
    </div>
  `,
})
export class GeneralErrorComponent {
  readonly minimal = input(false)
  readonly className = input('')

  private readonly location = inject(Location)
  private readonly router = inject(Router)

  protected readonly rootClasses = computed(() =>
    cn('h-svh w-full', this.className())
  )

  protected goBack(): void {
    this.location.back()
  }

  protected goHome(): void {
    void this.router.navigate(['/'])
  }
}
