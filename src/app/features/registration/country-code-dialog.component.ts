import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject, signal } from '@angular/core'
import { BrnDialogRef } from '@spartan-ng/brain/dialog'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmDialogImports } from '@spartan-ng/helm/dialog'
import { HlmInputImports } from '@spartan-ng/helm/input'
import { HlmLabelImports } from '@spartan-ng/helm/label'
import { COUNTRIES } from './registration-options'

@Component({
  selector: 'app-country-code-dialog',
  standalone: true,
  imports: [HlmDialogImports, HlmButtonImports, HlmInputImports, HlmLabelImports],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <hlm-dialog-header>
      <h2 hlmDialogTitle>Select Country Code</h2>
      <p hlmDialogDescription>Search by country name or dial code.</p>
    </hlm-dialog-header>
    <div class="grid gap-2 py-2">
      <label hlmLabel for="country-code-search">Search</label>
      <input
        hlmInput
        id="country-code-search"
        placeholder="Search countries..."
        [value]="query()"
        (input)="onSearch($event)"
      />
    </div>
    <div class="grid max-h-72 gap-1 overflow-y-auto py-2">
      @for (c of filtered(); track c.code) {
        <button
          hlmBtn
          type="button"
          variant="ghost"
          class="justify-start"
          [class.bg-accent]="c.dialCode === selectedDial"
          (click)="choose(c.dialCode)"
        >
          <span class="mr-2">{{ c.flag }}</span>
          <span class="flex-1 text-left">{{ c.name }}</span>
          <span class="text-muted-foreground text-sm">{{ c.dialCode }}</span>
        </button>
      } @empty {
        <p class="text-muted-foreground text-sm">No countries found.</p>
      }
    </div>
  `,
})
export class CountryCodeDialogComponent {
  @Input() selectedDial = ''
  @Output() picked = new EventEmitter<string>()

  private readonly dialogRef = inject(BrnDialogRef<string>, { optional: true })
  protected readonly query = signal('')

  protected readonly filtered = signal(COUNTRIES)

  protected onSearch(event: Event): void {
    const q = (event.target as HTMLInputElement).value.trim().toLowerCase()
    this.query.set(q)
    this.filtered.set(
      !q
        ? COUNTRIES
        : COUNTRIES.filter((c) => c.name.toLowerCase().includes(q) || c.dialCode.includes(q)),
    )
  }

  protected choose(dialCode: string): void {
    this.picked.emit(dialCode)
    this.dialogRef?.close(dialCode)
  }
}
