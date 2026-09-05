import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { toast } from '@spartan-ng/brain/sonner'
import { vi } from 'vitest'
import { TasksImportDialogComponent } from './tasks-import-dialog.component'

describe('TasksImportDialogComponent', () => {
  let fixture: ComponentFixture<TasksImportDialogComponent>

  beforeEach(async () => {
    document.body.innerHTML = ''
    toast.dismiss()
    await TestBed.configureTestingModule({
      imports: [TasksImportDialogComponent],
    }).compileComponents()
    fixture = TestBed.createComponent(TasksImportDialogComponent)
    fixture.componentRef.setInput('open', true)
    fixture.detectChanges()
    await fixture.whenStable()
    fixture.detectChanges()
  })

  afterEach(() => {
    document.body.innerHTML = ''
    toast.dismiss()
  })

  function fileInput(): HTMLInputElement {
    const input = document.body.querySelector(
      '#task-import-file'
    ) as HTMLInputElement | null
    expect(input).not.toBeNull()
    return input!
  }

  function selectCsv(name = 'tasks.csv'): void {
    const file = new File(['title,status\n"a",todo'], name, {
      type: 'text/csv',
    })
    Object.defineProperty(fileInput(), 'files', {
      value: [file],
      configurable: true,
    })
    fileInput().dispatchEvent(new Event('change'))
    fixture.detectChanges()
  }

  /**
   * jsdom never fills a file input's value on its own, so simulate the
   * browser showing the chosen filename by shadowing the value property.
   */
  function simulateStaleFilename(value = 'C:\\fakepath\\tasks.csv'): void {
    Object.defineProperty(fileInput(), 'value', {
      value,
      writable: true,
      configurable: true,
    })
    expect(fileInput().value).toBe(value)
  }

  function submitForm(): void {
    document.body
      .querySelector('form#task-import-form')
      ?.dispatchEvent(new Event('submit'))
    fixture.detectChanges()
  }

  it('clears the file input DOM value after a successful import', () => {
    const closed = vi.fn()
    fixture.componentInstance.closed.subscribe(closed)
    selectCsv()
    simulateStaleFilename()

    submitForm()

    expect(closed).toHaveBeenCalled()
    expect(fileInput().value).toBe('')
  })

  it('clears the file input DOM value when the dialog closes', () => {
    const closed = vi.fn()
    fixture.componentInstance.closed.subscribe(closed)
    selectCsv()
    simulateStaleFilename()

    const instance = fixture.componentInstance as unknown as {
      onStateChanged: (state: 'closed') => void
    }
    instance.onStateChanged('closed')
    fixture.detectChanges()

    expect(closed).toHaveBeenCalled()
    expect(fileInput().value).toBe('')
  })

  it('requires a file after a previous selection was cleared', () => {
    selectCsv()
    submitForm()
    expect(document.body.textContent ?? '').not.toContain(
      'Please upload a file.'
    )

    // Nothing selected anymore: submitting again must show the error.
    submitForm()
    expect(document.body.textContent ?? '').toContain('Please upload a file.')
  })
})
