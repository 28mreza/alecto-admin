import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  Injector,
  input,
  output,
  runInInjectionContext,
} from '@angular/core'
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmInputImports } from '@spartan-ng/helm/input'
import { HlmLabelImports } from '@spartan-ng/helm/label'
import { HlmRadioGroupImports } from '@spartan-ng/helm/radio-group'
import { HlmSelectImports } from '@spartan-ng/helm/select'
import { HlmSheetImports } from '@spartan-ng/helm/sheet'
import type { BrnDialogState } from '@spartan-ng/brain/dialog'
import { showSubmittedData } from '../../../shared/utils/show-submitted-data'
import type { Task, TaskLabel, TaskPriority, TaskStatus } from '../data/schema'
import { TasksStoreService } from '../store/tasks-store.service'

const STATUS_OPTIONS = [
  { label: 'In Progress', value: 'in progress' },
  { label: 'Backlog', value: 'backlog' },
  { label: 'Todo', value: 'todo' },
  { label: 'Canceled', value: 'canceled' },
  { label: 'Done', value: 'done' },
] as const

const LABEL_OPTIONS = [
  { label: 'Documentation', value: 'documentation' },
  { label: 'Feature', value: 'feature' },
  { label: 'Bug', value: 'bug' },
] as const

const PRIORITY_OPTIONS = [
  { label: 'High', value: 'high' },
  { label: 'Medium', value: 'medium' },
  { label: 'Low', value: 'low' },
] as const

/**
 * Create/update task drawer.
 *
 * Ported from `tasks-mutate-drawer.tsx`: a right-side Spartan sheet with a
 * reactive title/status/label/priority form (same labels, options and
 * validation messages). Create submits via `store.addTask`, update via
 * `store.updateTask`; both close the sheet, reset the form and toast the
 * submitted values. The form resets whenever the sheet closes or the edited
 * row changes.
 */
@Component({
  selector: 'app-tasks-mutate-drawer',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HlmButtonImports,
    HlmInputImports,
    HlmLabelImports,
    HlmRadioGroupImports,
    HlmSelectImports,
    HlmSheetImports,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <hlm-sheet
      side="right"
      [state]="open() ? 'open' : 'closed'"
      (stateChanged)="onStateChanged($event)"
    >
      <hlm-sheet-content *hlmSheetPortal class="flex flex-col">
        <div hlmSheetHeader class="text-start">
          <h2 hlmSheetTitle>{{ isUpdate() ? 'Update' : 'Create' }} Task</h2>
          <p hlmSheetDescription>
            {{
              isUpdate()
                ? 'Update the task by providing necessary info.'
                : 'Add a new task by providing necessary info.'
            }}
            Click save when you&apos;re done.
          </p>
        </div>
        <form
          id="tasks-form"
          [formGroup]="form"
          (ngSubmit)="onSubmit()"
          class="flex-1 space-y-6 overflow-y-auto px-4"
        >
          <div class="grid gap-2">
            <label hlmLabel for="tasks-title">Title</label>
            <input
              hlmInput
              id="tasks-title"
              placeholder="Enter a title"
              formControlName="title"
            />
            @if (title.invalid && (title.touched || title.dirty)) {
              <p class="text-destructive text-sm">Title is required.</p>
            }
          </div>

          <div class="grid gap-2">
            <label hlmLabel for="tasks-status">Status</label>
            <hlm-select formControlName="status" id="tasks-status">
              <hlm-select-trigger>
                <hlm-select-value placeholder="Select dropdown" />
              </hlm-select-trigger>
              <hlm-select-content *hlmSelectPortal>
                @for (option of statusOptions; track option.value) {
                  <hlm-select-item [value]="option.value">
                    {{ option.label }}
                  </hlm-select-item>
                }
              </hlm-select-content>
            </hlm-select>
            @if (status.invalid && (status.touched || status.dirty)) {
              <p class="text-destructive text-sm">Please select a status.</p>
            }
          </div>

          <div class="relative grid gap-2">
            <span hlmLabel>Label</span>
            <hlm-radio-group
              formControlName="label"
              class="flex flex-col space-y-1"
            >
              @for (option of labelOptions; track option.value) {
                <label
                  hlmLabel
                  [for]="'tasks-label-' + option.value"
                  class="flex items-center font-normal"
                >
                  <hlm-radio
                    [inputId]="'tasks-label-' + option.value"
                    [value]="option.value"
                  >
                    <hlm-radio-indicator />
                  </hlm-radio>
                  {{ option.label }}
                </label>
              }
            </hlm-radio-group>
            @if (label.invalid && (label.touched || label.dirty)) {
              <p class="text-destructive text-sm">Please select a label.</p>
            }
          </div>

          <div class="relative grid gap-2">
            <span hlmLabel>Priority</span>
            <hlm-radio-group
              formControlName="priority"
              class="flex flex-col space-y-1"
            >
              @for (option of priorityOptions; track option.value) {
                <label
                  hlmLabel
                  [for]="'tasks-priority-' + option.value"
                  class="flex items-center font-normal"
                >
                  <hlm-radio
                    [inputId]="'tasks-priority-' + option.value"
                    [value]="option.value"
                  >
                    <hlm-radio-indicator />
                  </hlm-radio>
                  {{ option.label }}
                </label>
              }
            </hlm-radio-group>
            @if (priority.invalid && (priority.touched || priority.dirty)) {
              <p class="text-destructive text-sm">Please choose a priority.</p>
            }
          </div>
        </form>
        <div hlmSheetFooter class="gap-2">
          <button hlmBtn variant="outline" type="button" hlmSheetClose>
            Close
          </button>
          <button hlmBtn form="tasks-form" type="submit">Save changes</button>
        </div>
      </hlm-sheet-content>
    </hlm-sheet>
  `,
})
export class TasksMutateDrawerComponent {
  readonly open = input(false)
  readonly currentRow = input<Task | null>(null)
  readonly closed = output<void>()

  protected readonly statusOptions = STATUS_OPTIONS
  protected readonly labelOptions = LABEL_OPTIONS
  protected readonly priorityOptions = PRIORITY_OPTIONS

  private readonly store = inject(TasksStoreService)
  private readonly injector = inject(Injector)

  readonly form = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    status: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    label: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    priority: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  })

  constructor() {
    // Reset the form whenever the edited row changes or the sheet closes,
    // mirroring the source drawer's `form.reset()` on open-change.
    effect(() => {
      const row = this.currentRow()
      this.open()
      this.form.reset({
        title: row?.title ?? '',
        status: row?.status ?? '',
        label: row?.label ?? '',
        priority: row?.priority ?? '',
      })
    })
  }

  get title(): FormControl<string> {
    return this.form.controls.title
  }

  get status(): FormControl<string> {
    return this.form.controls.status
  }

  get label(): FormControl<string> {
    return this.form.controls.label
  }

  get priority(): FormControl<string> {
    return this.form.controls.priority
  }

  protected isUpdate(): boolean {
    return this.currentRow() !== null
  }

  protected onStateChanged(state: BrnDialogState): void {
    if (state === 'closed') this.closed.emit()
  }

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      return
    }
    const value = this.form.getRawValue()
    const row = this.currentRow()
    if (row) {
      this.store.updateTask(row.id, {
        title: value.title,
        status: value.status as TaskStatus,
        label: value.label as TaskLabel,
        priority: value.priority as TaskPriority,
      })
    } else {
      this.store.addTask({
        title: value.title,
        status: value.status as TaskStatus,
        label: value.label as TaskLabel,
        priority: value.priority as TaskPriority,
      })
    }
    // showSubmittedData() injects ToastService, so it must run inside an
    // injection context (submit handlers are not one).
    runInInjectionContext(this.injector, () => showSubmittedData(value))
    this.form.reset({ title: '', status: '', label: '', priority: '' })
    this.closed.emit()
  }
}
