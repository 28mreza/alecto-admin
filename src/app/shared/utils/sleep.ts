/**
 * Resolves after `ms` milliseconds. Used to simulate async work in
 * `ToastService.promise` bulk-action flows (mirrors `sleep` in the source
 * `shadcn-admin/src/lib/utils.ts`).
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
