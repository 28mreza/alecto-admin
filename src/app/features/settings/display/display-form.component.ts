import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Injector,
  runInInjectionContext,
} from '@angular/core'
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox'
import { HlmLabelImports } from '@spartan-ng/helm/label'
import { showSubmittedData } from '../../../shared/utils/show-submitted-data'

const ITEMS = [
  { id: 'recents', label: 'Recents' },
  { id: 'home', label: 'Home' },
  { id: 'applications', label: 'Applications' },
  { id: 'desktop', label: 'Desktop' },
  { id: 'downloads', label: 'Downloads' },
  { id: 'documents', label: 'Documents' },
] as const

const DEFAULT_SELECTED = ['recents', 'home']

function atLeastOneSelected(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const values = (control.value ?? []) as boolean[]
    return values.some(Boolean) ? null : { minOne: true }
  }
}

/**
 * Display form ported from
 * `shadcn-admin/src/features/settings/display/display-form.tsx`.
 * Checkbox list bound to a boolean FormArray with an at-least-one validator;
 * submit maps the selection back to item ids.
 */
@Component({
  selector: 'app-display-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HlmButtonImports,
    HlmCheckboxImports,
    HlmLabelImports,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-8">
      <div class="grid gap-2">
        <div class="mb-4">
          <span hlmLabel class="text-base">Sidebar</span>
          <p class="text-muted-foreground text-sm">
            Select the items you want to display in the sidebar.
          </p>
        </div>
        @for (item of items; track item.id; let i = $index) {
          <div class="flex flex-row items-start">
            <hlm-checkbox
              [inputId]="'display-' + item.id"
              [formControl]="selection.at(i)"
            />
            <label hlmLabel [for]="'display-' + item.id" class="font-normal">
              {{ item.label }}
            </label>
          </div>
        }
        @if (selection.invalid && (selection.touched || selection.dirty)) {
          <p class="text-destructive text-sm">
            You have to select at least one item.
          </p>
        }
      </div>
      <button hlmBtn type="submit">Update display</button>
    </form>
  `,
})
export class DisplayFormComponent {
  protected readonly items = ITEMS

  private readonly injector = inject(Injector)

  readonly form = new FormGroup({
    items: new FormArray(
      ITEMS.map(
        (item) =>
          new FormControl(DEFAULT_SELECTED.includes(item.id), {
            nonNullable: true,
          })
      ),
      { validators: [atLeastOneSelected()] }
    ),
  })

  get selection(): FormArray<FormControl<boolean>> {
    return this.form.controls.items
  }

  selectedIds(): string[] {
    return ITEMS.filter((_, index) => this.selection.at(index).value).map(
      (item) => item.id
    )
  }

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      return
    }
    // showSubmittedData() injects ToastService, so it must run inside an
    // injection context (submit handlers are not one).
    runInInjectionContext(this.injector, () =>
      showSubmittedData({ items: this.selectedIds() })
    )
  }
}
