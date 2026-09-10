import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, ViewChild, forwardRef } from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'
import { HlmAttachmentImports } from '@spartan-ng/helm/attachment'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmLabelImports } from '@spartan-ng/helm/label'
function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

let uploadIdCounter = 0

@Component({
  selector: 'app-file-upload-field',
  standalone: true,
  imports: [HlmAttachmentImports, HlmButtonImports, HlmLabelImports],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => FileUploadFieldComponent), multi: true },
  ],
  template: `
    <div class="grid gap-2">
      <label hlmLabel [for]="inputId"
        >{{ label }}@if (required) {
          <span class="text-destructive" aria-hidden="true">*</span>
        }</label
      >
      @if (hint) {
        <p class="text-muted-foreground text-xs">{{ hint }}</p>
      }
      <input
        #fileInput
        type="file"
        [id]="inputId"
        [accept]="accept"
        hidden
        (change)="onFilePicked($event)"
      />
      @if (!value) {
        <button hlmBtn type="button" variant="outline" (click)="openPicker()">Choose file</button>
      } @else {
        <hlm-attachment>
          <hlm-attachment-content>
            <hlm-attachment-title>{{ value.name }}</hlm-attachment-title>
            <hlm-attachment-description>{{ fileSize }}</hlm-attachment-description>
          </hlm-attachment-content>
          <hlm-attachment-actions>
            <button hlmBtn type="button" variant="outline" size="sm" (click)="openPicker()">Replace</button>
            <button hlmBtn type="button" variant="ghost" size="sm" (click)="clear()">Remove</button>
          </hlm-attachment-actions>
        </hlm-attachment>
      }
      <ng-content />
    </div>
  `,
})
export class FileUploadFieldComponent implements ControlValueAccessor {
  @Input() label = ''
  @Input() hint = ''
  @Input() required = false
  @Input() accept = '.jpg,.jpeg,.png,.pdf'
  @Input() inputId = `upload-${++uploadIdCounter}`
  @Input() value: File | null = null
  @Output() valueChange = new EventEmitter<File | null>()

  @ViewChild('fileInput') private fileInput?: ElementRef<HTMLInputElement>

  private onChange: (v: File | null) => void = () => undefined
  private onTouched: () => void = () => undefined

  protected get fileSize(): string {
    return this.value ? formatSize(this.value.size) : ''
  }

  protected openPicker(): void {
    this.fileInput?.nativeElement.click()
  }

  protected onFilePicked(event: Event): void {
    const input = event.target as HTMLInputElement
    const file = input.files?.[0] ?? null
    this.setValue(file)
  }

  protected clear(): void {
    if (this.fileInput) this.fileInput.nativeElement.value = ''
    this.setValue(null)
  }

  private setValue(file: File | null): void {
    this.value = file
    this.valueChange.emit(file)
    this.onChange(file)
    this.onTouched()
  }

  writeValue(value: File | null): void {
    this.value = value
  }

  registerOnChange(fn: (v: File | null) => void): void {
    this.onChange = fn
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn
  }
}
