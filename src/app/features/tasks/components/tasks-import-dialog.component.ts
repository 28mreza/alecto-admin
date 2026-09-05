import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  Injector,
  input,
  output,
  runInInjectionContext,
  signal,
  viewChild,
} from '@angular/core'
import { FormsModule } from '@angular/forms'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmDialogImports } from '@spartan-ng/helm/dialog'
import { HlmInputImports } from '@spartan-ng/helm/input'
import { HlmLabelImports } from '@spartan-ng/helm/label'
import type { BrnDialogState } from '@spartan-ng/brain/dialog'
import { showSubmittedData } from '../../../shared/utils/show-submitted-data'

/**
 * CSV import dialog for the tasks page.
 *
 * Ported from `tasks-import-dialog.tsx`: `sm:max-w-sm` dialog with a CSV
 * file input (same validation messages) and an Import action that toasts
 * the imported file details, then closes and resets.
 */
@Component({
  selector: 'app-tasks-import-dialog',
  standalone: true,
  imports: [
    FormsModule,
    HlmButtonImports,
    HlmDialogImports,
    HlmInputImports,
    HlmLabelImports,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <hlm-dialog
      [state]="open() ? 'open' : 'closed'"
      (stateChanged)="onStateChanged($event)"
    >
      <hlm-dialog-content *hlmDialogPortal class="gap-2 sm:max-w-sm">
        <div hlmDialogHeader class="text-start">
          <h2 hlmDialogTitle>Import Tasks</h2>
          <p hlmDialogDescription>Import tasks quickly from a CSV file.</p>
        </div>
        <form
          id="task-import-form"
          (ngSubmit)="onSubmit()"
          class="my-2 grid gap-2"
        >
          <label hlmLabel for="task-import-file">File</label>
          <input
            hlmInput
            id="task-import-file"
            #fileInput
            type="file"
            accept="text/csv"
            class="h-8 py-0"
            (change)="onFileChange($event)"
          />
          @if (error(); as message) {
            <p class="text-destructive text-sm">{{ message }}</p>
          }
        </form>
        <div hlmDialogFooter class="gap-2">
          <button hlmBtn variant="outline" type="button" hlmDialogClose>
            Close
          </button>
          <button hlmBtn type="submit" form="task-import-form">Import</button>
        </div>
      </hlm-dialog-content>
    </hlm-dialog>
  `,
})
export class TasksImportDialogComponent {
  readonly open = input(false)
  readonly closed = output<void>()

  protected readonly error = signal<string | null>(null)

  private file: File | null = null
  private readonly injector = inject(Injector)
  private readonly fileInput =
    viewChild<ElementRef<HTMLInputElement>>('fileInput')

  protected onStateChanged(state: BrnDialogState): void {
    if (state === 'closed') {
      this.reset()
      this.closed.emit()
    }
  }

  protected onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement | null
    this.file = input?.files?.[0] ?? null
    this.error.set(null)
  }

  protected onSubmit(): void {
    if (!this.file) {
      this.error.set('Please upload a file.')
      return
    }
    if (this.file.type !== 'text/csv') {
      this.error.set('Please upload csv format.')
      return
    }
    const details = {
      name: this.file.name,
      size: this.file.size,
      type: this.file.type,
    }
    // showSubmittedData() injects ToastService, so it must run inside an
    // injection context (submit handlers are not one).
    runInInjectionContext(this.injector, () =>
      showSubmittedData(details, 'You have imported the following file:')
    )
    this.reset()
    this.closed.emit()
  }

  private reset(): void {
    this.file = null
    this.error.set(null)
    // Clearing the var alone leaves the filename visible in the native
    // <input type=file> on reopen, so reset the DOM value as well.
    const native = this.fileInput()
    if (native) native.nativeElement.value = ''
  }
}
