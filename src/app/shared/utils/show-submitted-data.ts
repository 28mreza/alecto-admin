import { inject } from '@angular/core'
import { ToastService } from '../../core/services/toast.service'

/**
 * Shows a toast with the submitted form values, mirroring the React
 * `showSubmittedData` helper. The brain sonner toaster renders a plain-text
 * `description`, so the JSON payload is passed as a pre-formatted string
 * (the source's styled `<pre>` block has no equivalent in the helm API).
 */
export function showSubmittedData(
  data: unknown,
  title = 'You submitted the following values:'
): void {
  inject(ToastService).message(title, JSON.stringify(data, null, 2))
}
