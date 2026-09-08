# AGENTS.md — alecto-admin

Angular 22 zoneless admin dashboard (rebuild of shadcn-admin). Standalone + `OnPush` everywhere, signals services, Tailwind v4, Spartan UI primitives wrapped locally in `src/app/ui/*`.

## Commands

- Dev: `ng serve` (port 4200). Build: `npm run build` (use `npx ng build --configuration development` if prod build is too heavy). Lint: `npm run lint`.
- **Focused test: `npx ng test --include=<spec-path> --watch=false`.** Bare `npx vitest run <file>` **fails** (no tsconfig-paths alias resolution for `@spartan-ng/helm/*`); always go through `ng test`.
- Typecheck a page: `npx tsc --noEmit -p tsconfig.app.json`.
- NEVER run `npm install` unless the task explicitly requires a dep change.

## Tests

- Runner is Vitest via `@angular/build:unit-test`; specs are co-located `*.spec.ts`.
- No global `setupFiles`: specs that render components must import `mockMatchMedia()` / `ensureScrollIntoViewStub()` from `src/test-helpers.ts`.
- `src/app/app.routes.spec.ts` audits that **every sidebar URL resolves** — keep `sidebar-data.ts` and routes in sync. `app.navigation.spec.ts` guards the blank-`/` regression (see Routing).

## Architecture

- `src/app/ui/*`: Helm primitives (style `vega`, see `components.json`). **Generate, never hand-write:** `ng g @spartan-ng/cli:ui <name>` — ONE primitive per invocation (CLI rejects multiple names; `--defaults` for non-interactive). CLI may dirty `package.json`/`package-lock.json`/`tsconfig.app.json` — revert out-of-scope churn, commit only `src/app/ui/*` + `tsconfig.json` path entries.
- `src/app/components/layout/data/sidebar-data.ts` drives sidebar nav AND the command palette (Ctrl+K); new pages need nav entry + lazy `loadComponent` route in `src/app/app.routes.ts` + both spec updates.
- Routing gotcha: `AuthenticatedLayoutComponent` (with `path: '' pathMatch: 'full'` dashboard child) MUST be declared before `AuthLayoutComponent` — both use `path: ''`, and the wrong order renders a blank outlet at `/`.
- Page pattern: standalone + `OnPush` + `templateUrl`, shell `HeaderComponent + MainComponent + Search + RefreshButton + ThemeSwitch + ConfigDrawer + ProfileDropdown`, content in `hlmCard` sections.
- `tsconfig.json` maps `@spartan-ng/helm/*` → `src/app/ui/*/src/index.ts`; new primitives need their path entry.
- `docs/` is gitignored — design docs/plans there stay untracked by design.

## Gotchas (verified the hard way)

- **Brain/Helm state-attribute mismatch:** brain 1.4.1 exposes state via `data-state="checked|unchecked"`, but some CLI-generated Helm code styles via bare `data-checked:`/`data-unchecked:` variants, which compile to `[data-checked]` — an attribute brain never sets — so the styles silently never apply (switch pills were invisible). If a state-driven style doesn't render: dump the real DOM (attributes present?) and grep the built CSS for the exact compiled selector. Fix at primitive level with `data-[state=...]:` (regenerating won't help — CLI output is identical); affects `switch` (fixed), potentially `checkbox`/`radio`/`questionnaire-choice`/`field-label` too.
- **Duplicate selectors break silently:** two live components sharing a selector + class name (e.g. demo `app-sidebar` vs layout `app-sidebar`) pass build/lint. Always `grep -rn "selector: '<name>'" src/app` before naming a component.
- Conventions: `type="button"` on demo buttons, no `href="#"` (use real `routerLink` or nothing), no external image URLs (offline-safe), unique `for`/`id` label pairs.
- Overlay content (dropdown-menu/menubar/popover/sheet/select) renders in CDK overlay only while open — specs assert triggers statically.
- Prod build has a pre-existing initial-bundle size warning (~900kB budget); not a failure.
