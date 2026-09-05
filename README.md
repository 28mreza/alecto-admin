# alecto-admin

Angular rebuild of [shadcn-admin](https://github.com/satnaing/shadcn-admin) — the full admin-dashboard template (dashboard, tasks, users, apps, chats, settings, auth, errors, help-center) re-implemented with Angular 22, signals, and Tailwind CSS v4.

## Tech stack

| Area          | Choice                                                                                        |
| ------------- | --------------------------------------------------------------------------------------------- |
| Framework     | Angular 22 (zoneless change detection, `OnPush` everywhere, standalone components)            |
| Routing       | Angular Router (lazy `loadComponent` per feature, `errors/:error` param route, `**` → 404)    |
| State         | Signals (`signal` / `computed` / `effect`) in root-provided services + `localStorage` persist |
| Forms         | Reactive Forms + hand-rolled validators                                                       |
| Styling       | Tailwind CSS v4 (`@import 'tailwindcss'`, CSS-first `@theme` tokens in `src/theme.css`)       |
| UI primitives | Spartan UI (`@spartan-ng/brain`) + local `src/app/ui/*` wrappers (button, dialog, table, …)   |
| Icons         | ng-icons + Lucide (`@ng-icons/core`, `@ng-icons/lucide`)                                      |
| Dates         | date-fns (+ `luxon` for the calendar primitive)                                               |
| Mock data     | `@faker-js/faker` (seeded task/user generators)                                               |
| Tests         | Vitest via `@angular/build:unit-test` (`ng test`)                                             |
| Lint / format | ESLint (`angular-eslint`) / Prettier (`prettier-plugin-tailwindcss`)                          |

## Prerequisites

- Node.js 20+ (repo tested with Node 24, npm 11)
- npm (comes with Node)

## Getting started

```bash
npm install
```

### Dev server

```bash
ng serve
```

Open <http://localhost:4200>. The app reloads on source changes.

### Production build

```bash
ng build
```

Artifacts land in `dist/`.

### Tests

```bash
ng test --watch=false
```

Vitest is the default (and only) unit-test runner. See [Testing](#testing) for counts and helpers.

### Lint

```bash
ng lint
```

### Format check

```bash
npx prettier --check src
```

(Root JS/JSON configs — `eslint.config.js`, `angular.json`, `package.json`, `tsconfig*.json` — pass the same check when passed explicitly; the extensionless dotfiles `.prettierrc`/`.prettierignore` have no inferred parser, which is a Prettier CLI quirk, not a formatting failure.)

## Project structure

```
src/
  main.ts            # bootstrapApplication + appConfig
  styles.css         # tailwind import + base layers
  theme.css          # CSS-first design tokens / dark variant
  test-helpers.ts    # shared Vitest helpers (matchMedia, scrollIntoView)
  app/
    app.ts / app.html / app.config.ts   # root component, zoneless + router providers
    app.routes.ts                       # full route map (see below)
    core/services/   # singleton signal stores: theme, font, layout, sidebar,
                     #   search, toast + localStorage-backed storage.service
    shared/          # cross-feature building blocks
      charts/        # custom SVG charts (area, bar, bar-list) + pure path/axis utils
      data-table/    # custom signals data-table (filter/sort/paginate, URL sync)
      icons/         # brand + app icon components
      utils/         # cn(), formatting, faker data generators
    layouts/         # auth-layout, authenticated-layout (sidebar+header+main),
                     #   settings-layout (sub-nav)
    components/      # shell pieces: layout, sidebar, header, search, command-menu,
                     #   config-drawer, theme-switch, profile-dropdown, date-picker, …
    features/        # routed pages: dashboard, tasks, users, apps, chats,
                     #   settings/*, auth/*, errors/*, help-center
    ui/              # Spartan-based primitives: button, dialog, table, tabs,
                     #   select, popover, sheet, sonner, calendar, input-otp, …
    config/          # static config (fonts.ts)
```

## Route map

Source: `src/app/app.routes.ts`. Layout shells own route groups; every page is lazy-loaded. The table lists 27 URLs — the five `/errors/*` rows are all served by the `errors/:error` param route (unknown params fall back to the 404 view).

| Route                           | Component (file)                                             | Notes                                                                |
| ------------------------------- | ------------------------------------------------------------ | -------------------------------------------------------------------- |
| `/`                             | `DashboardComponent` (`features/dashboard`)                  | default landing page                                                 |
| `/tasks`                        | `TasksComponent` (`features/tasks`)                          | kanban + dialogs                                                     |
| `/users`                        | `UsersComponent` (`features/users`)                          | data-table + invite/add/edit                                         |
| `/apps`                         | `AppsComponent` (`features/apps`)                            | app-card grid                                                        |
| `/chats`                        | `ChatsComponent` (`features/chats`)                          | conversation layout                                                  |
| `/help-center`                  | `HelpCenterComponent` (`features/help-center`)               | FAQ                                                                  |
| `/settings`                     | `ProfileComponent` (`features/settings/profile`)             | default settings tab (index)                                         |
| `/settings/account`             | `AccountComponent` (`features/settings/account`)             |                                                                      |
| `/settings/appearance`          | `AppearanceComponent` (`features/settings/appearance`)       |                                                                      |
| `/settings/notifications`       | `NotificationsComponent` (`features/settings/notifications`) |                                                                      |
| `/settings/display`             | `DisplayComponent` (`features/settings/display`)             |                                                                      |
| `/sign-in`                      | `SignInComponent` (`features/auth/sign-in`)                  | `AuthLayout` shell                                                   |
| `/sign-in-2`                    | `SignIn2Component` (`features/auth/sign-in-2`)               | standalone split layout                                              |
| `/sign-up`                      | `SignUpComponent` (`features/auth/sign-up`)                  | `AuthLayout` shell                                                   |
| `/forgot-password`              | `ForgotPasswordComponent` (`features/auth/forgot-password`)  | `AuthLayout` shell                                                   |
| `/otp`                          | `OtpComponent` (`features/auth/otp`)                         | `AuthLayout` shell                                                   |
| `/errors/unauthorized`          | `ErrorPageComponent` (`features/errors`)                     | in-shell error view (`errors/:error`, param `unauthorized`)          |
| `/errors/forbidden`             | `ErrorPageComponent` (`features/errors`)                     | in-shell error view (`errors/:error`, param `forbidden`)             |
| `/errors/not-found`             | `ErrorPageComponent` (`features/errors`)                     | in-shell error view (`errors/:error`, param `not-found`)             |
| `/errors/internal-server-error` | `ErrorPageComponent` (`features/errors`)                     | in-shell error view (`errors/:error`, param `internal-server-error`) |
| `/errors/maintenance-error`     | `ErrorPageComponent` (`features/errors`)                     | in-shell error view (`errors/:error`, param `maintenance-error`)     |
| `/401`                          | `UnauthorizedErrorComponent`                                 | standalone (no shell)                                                |
| `/403`                          | `ForbiddenErrorComponent`                                    | standalone (no shell)                                                |
| `/404`                          | `NotFoundErrorComponent`                                     | standalone (no shell)                                                |
| `/500`                          | `GeneralErrorComponent`                                      | standalone (no shell)                                                |
| `/503`                          | `MaintenanceErrorComponent`                                  | standalone (no shell)                                                |
| `**` (anything else)            | `NotFoundErrorComponent`                                     | unknown paths render the 404 page with HTTP 200 (SPA fallback)       |

## Key design decisions

- **Zoneless + `OnPush`:** `provideZonelessChangeDetection()` in `app.config.ts`; all components are standalone `OnPush` and react to signals/inputs only.
- **Signals services + `localStorage` persistence:** theme, font, layout/collapsible, sidebar state, search history, and toasts live in root-provided signal services; user preferences survive reloads via `StorageService` (`localStorage`).
- **Custom sidebar system:** no third-party sidebar — `SidebarService` + collapsible/variant layout (`LayoutService`) drive the responsive rail, icons, and secondary sidebar content.
- **Custom signals data-table with URL sync:** `shared/data-table` implements filtering, sorting, pagination, and column visibility on signals; table state (page, sort, filters) syncs to query params so URLs are shareable.
- **Custom SVG charts:** dashboard charts (`shared/charts`) are hand-rolled SVG (area/bar/bar-list) over pure, unit-tested path/axis utils — no chart library dependency.
- **Mock auth & data, no backend:** sign-in/up/OTP/forgot-password validate locally and route into the app; users/tasks/chats/apps content comes from seeded faker generators. There is nothing to deploy behind the UI.
- **Spartan + local `ui/` wrappers:** Radix-style behaviour comes from `@spartan-ng/brain`; each primitive gets a thin Tailwind-styled wrapper in `src/app/ui/*` so class/variant APIs stay local and themeable.

## Source reference

- The original React/Vite implementation lives at `../shadcn-admin` (sibling folder). It is the **read-only UI reference** for this rebuild — compare pages side-by-side when checking fidelity; do not edit it.
- Fidelity notes:
  - Avatar images in the source point at URLs that 404 — both the source and this rebuild show fallback initials there. That is parity, not a bug.
  - Auth flows (sign-in / sign-up / OTP / forgot-password) are client-side mocks that accept valid input and navigate into the shell.

## Testing

- Runner: Vitest via the Angular `unit-test` builder — `ng test --watch=false` for a single CI-style run.
- Coverage: 406 tests across 72 files (Vitest v4.1.11, from the Task 28 validation run) — services (theme/font/layout/sidebar/search/storage/toast), validators, chart utils, the data-table engine, and component specs for every feature page.
- Shared setup lives in `src/test-helpers.ts` (`mockMatchMedia()`, `ensureScrollIntoViewStub()`) — imported per-spec because the builder exposes no global `setupFiles` option.
- Route map has a spec too: `src/app/app.routes.spec.ts` asserts every path in the table above resolves to the right component.
