import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

const root = dirname(fileURLToPath(import.meta.url))
const tsconfig = JSON.parse(readFileSync(resolve(root, 'tsconfig.json'), 'utf8')) as {
  compilerOptions: { paths: Record<string, string[]> }
}

const alias = Object.fromEntries(
  Object.entries(tsconfig.compilerOptions.paths).map(([key, targets]) => [
    key,
    resolve(root, targets[0].replace(/^\.\//, '')),
  ]),
)

export default defineConfig({
  resolve: { alias },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
})
