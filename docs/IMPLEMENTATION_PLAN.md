# Rebuild `shadcn-admin` → Angular — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membangun ulang `shadcn-admin` (React) menjadi aplikasi Angular modern dengan Spartan UI, Tailwind CSS, dan JetBrains Mono — mempertahankan UI/UX/behavior/responsive source semaksimal mungkin.

**Architecture:** Angular 22 standalone + zoneless + signals; feature-based folder structure; lazy-loaded routes; theme/font/layout/sidebar state via services berbasis signals yang persist ke localStorage; data table engine custom berbasis signals dengan URL-sync; chart SVG custom; mock data (tanpa backend).

**Tech Stack:** Angular 22, Angular Router, Angular Signals, Reactive Forms, Tailwind CSS v4, Spartan UI v1.4, `@ng-icons/lucide`, date-fns, Vitest (default `ng test`), ESLint, Prettier, TypeScript.

---

## Global Constraints

1. **SOURCE (read-only):** `D:\MUHAMAD REZA - MSP002\PROJECT\TEMPLATE\rebuild-shadcn-admin-to-angular\shadcn-admin` — hanya untuk dibaca/dianalisis. JANGAN ubah.
2. **TARGET:** semua file dibuat di bawah `D:\MUHAMAD REZA - MSP002\PROJECT\TEMPLATE\rebuild-shadcn-admin-to-angular\shadcn-admin-angular\`.
3. Angular versi **22.x** (latest stable), semua komponen **standalone**, `ChangeDetectionStrategy.OnPush`, **zoneless** (`provideZonelessChangeDetection()`).
4. Gunakan `@if` / `@for` / `@switch` (modern control flow). DILARANG `*ngIf` / `*ngFor`.
5. DILARANG React, Angular Material, Bootstrap, `any` sembarangan.
6. Font utama: **JetBrains Mono** (default), selector font di Settings → Appearance: `jetbrains-mono` | `inter` | `system`.
7. Theme: salin persis CSS variables dari `shadcn-admin/src/styles/theme.css`. Dark mode via class `.dark` di `<html>`.
8. UI: gunakan komponen **Spartan** bila ada padanan; custom bila tidak. Brand icons & chart = custom SVG.
9. Icons: `@ng-icons/lucide`; brand icons sebagai SVG inline.
10. Persistensi preferensi via **localStorage** (service `StorageService`), bukan cookie.
11. RTL: TIDAK disertakan. Section Direction di ConfigDrawer dihilangkan.
12. Auth: semua halaman mock (tanpa backend/Clerk).
13. Testing: `ng test` (Vitest) untuk logika inti; `ng build`, `ng lint`, Prettier harus bersih.
14. Commit: `git add`/`git commit` per task di dalam repo `shadcn-admin-angular` (dibuat oleh `ng new`). Dilarang commit ke repo parent `TEMPLATE`.
15. Jalankan `ng build`, `ng lint`, `ng test --no-watch` dari `workdir: shadcn-admin-angular` setiap akhir fase untuk verifikasi.

**Perintah verifikasi (dari `shadcn-admin-angular/`):**
- Build: `ng build`
- Lint: `ng lint`
- Test: `ng test --no-watch`
- Prettier: `npx prettier --check src`

---

## Phase 1 — Scaffold & Foundation

### Task 1: Scaffold Angular 22 project + tooling

**Files:**
- Create: seluruh project via `ng new` di `D:\...\rebuild-shadcn-admin-to-angular\shadcn-admin-angular`
- Modify: `angular.json`, `package.json`

**Interfaces:**
- Consumes: —
- Produces: project Angular yang bisa `ng serve`; `ng test` (Vitest) terkonfigurasi; ESLint + Prettier siap.

- [ ] **Step 1: Scaffold project**

```bash
cd "D:\MUHAMAD REZA - MSP002\PROJECT\TEMPLATE\rebuild-shadcn-admin-to-angular"
# Folder shadcn-admin-angular sudah ada (kosong). Scaffold ke dalamnya:
ng new shadcn-admin-angular --directory shadcn-admin-angular \
  --style css --ssr=false --routing=true --skip-git=false \
  --package-manager npm
```

Catatan: folder `shadcn-admin-angular` sudah dibuat; jika `ng new` menolak folder non-kosong, hapus isi folder (hanya `IMPLEMENTATION_PLAN.md` boleh dipertahankan — pindahkan sementara lalu kembalikan). Pastikan hasilnya project Angular normal dengan `src/`, `angular.json`, `package.json`, `tsconfig.json`.

- [ ] **Step 2: Tambah ESLint + Prettier**

```bash
ng add @angular-eslint/schematics
npm i -D prettier prettier-plugin-tailwindcss
```

Tambahkan `.prettierrc` (ikut gaya `shadcn-admin/.prettierrc`):

```json
{
  "printWidth": 80,
  "semi": false,
  "singleQuote": true,
  "trailingComma": "es5",
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

- [ ] **Step 3: Aktifkan zoneless**

Modify `src/app/app.config.ts`:

```ts
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core'
import { provideRouter } from '@angular/router'
import { routes } from './app.routes'

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // zoneless
  ],
}
```

Hapus `provideZoneChangeDetection()` / `provideProtractorTestingSupport` bila ada; tambahkan `provideZonelessChangeDetection()` dari `@angular/core`. Pastikan `main.ts` memakai `bootstrapApplication` (standalone default).

- [ ] **Step 4: Verifikasi**

```bash
ng build && ng lint && ng test --no-watch
```

Expected: build sukses, lint bersih, test default (`app.component.spec.ts`) lulus.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "chore: scaffold angular 22 project with eslint, prettier, vitest"
```

---

### Task 2: Tailwind v4 + theme + global styles + fonts

**Files:**
- Create: `src/styles.css`
- Create: `src/theme.css` (salinan source)
- Modify: `angular.json` (styles array), `src/index.html` (font links, title, favicon)
- Create: `src/app/config/fonts.ts`

**Interfaces:**
- Consumes: Task 1.
- Produces: CSS variables theme (`.dark`), utility `container`, `no-scrollbar`, `faded-bottom`, font classes `font-jetbrains-mono` / `font-inter` / `font-system`. Di-consume oleh semua komponen UI.

- [ ] **Step 1: Install Tailwind v4**

```bash
npm i -D tailwindcss @tailwindcss/vite
```

Modify `angular.json` → `architect.build.options`:
- `"styles": ["src/styles.css"]`
- Hapus/abaikan `styles.css` bawaan; tambahkan `"browser"` Vite plugin di `options` via `"vite": { "plugins": [...] }`? Tidak — untuk Angular, Tailwind v4 via `@tailwindcss/vite` perlu di daftarkan lewat `angular.json` → `architect.build.options` → tambah `"vite": { "plugins": ["@tailwindcss/vite"] }`? Salah. Angular menyediakan integrasi `@tailwindcss/postcss` via `postcss.config.js`. Gunakan pendekatan PostCSS:

Buat `postcss.config.json` di root (**harus JSON**, bukan `postcss.config.js` — `@angular/build` hanya membaca `postcss.config.json` / `.postcssrc.json`; file `.js` diabaikan sehingga seluruh utilitas Tailwind tidak ter-generate):

```json
{
  "plugins": {
    "@tailwindcss/postcss": {}
  }
}
```

- [ ] **Step 2: Theme CSS** — salin `shadcn-admin/src/styles/theme.css` ke `src/theme.css` (konten identik, oklch variables `:root` + `.dark` + `@theme inline`).

- [ ] **Step 3: Global styles** — `src/styles.css`:

```css
@import 'tailwindcss';
@import 'tw-animate-css';
@import './theme.css';

@custom-variant dark (&:is(.dark *));

@theme inline {
  --font-jetbrains-mono: 'JetBrains Mono', 'monospace';
  --font-inter: 'Inter', 'sans-serif';
  --font-system: system-ui, sans-serif;
}

@layer base {
  * {
    @apply border-border outline-ring/50;
    scrollbar-width: thin;
    scrollbar-color: var(--border) transparent;
  }
  html {
    @apply overflow-x-hidden;
  }
  body {
    @apply min-h-svh w-full bg-background text-foreground has-[div[data-variant='inset']]:bg-sidebar;
  }
  button:not(:disabled),
  [role='button']:not(:disabled) {
    cursor: pointer;
  }
  @media screen and (max-width: 767px) {
    input,
    select,
    textarea {
      font-size: 16px !important;
    }
  }
}

@utility container {
  margin-inline: auto;
  padding-inline: 2rem;
}

@utility no-scrollbar {
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
}

@utility faded-bottom {
  @apply after:pointer-events-none after:absolute after:inset-s-0 after:bottom-0 after:hidden after:h-32 after:w-full after:rounded-b-2xl after:bg-[linear-gradient(180deg,transparent_10%,var(--background)_70%)] md:after:block;
}
```

Install `tw-animate-css`: `npm i tw-animate-css`.

- [ ] **Step 4: index.html** — salin struktur dari `shadcn-admin/index.html`: title "Shadcn Admin", meta description, favicon (copy `shadcn-admin/public/images/favicon*.svg/png` ke `shadcn-admin-angular/public/images/`), dan font links:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
  rel="stylesheet"
/>
```

- [ ] **Step 5: fonts config** — `src/app/config/fonts.ts`:

```ts
export type Font = 'jetbrains-mono' | 'inter' | 'system'

export const fonts: Font[] = ['jetbrains-mono', 'inter', 'system']
```

- [ ] **Step 6: Verifikasi**

```bash
ng build
```

Expected: build sukses; `var(--background)` dsb ter-resolve. Jalankan `ng serve` dan cek body menggunakan `bg-background` (warna light) dan `.dark` (warna dark).

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat: tailwind v4 theme and global styles with jetbrains mono"
```

---

### Task 3: Spartan UI setup + generate komponen inti

**Files:**
- Modify: `package.json`, `components.json`, `angular.json`
- Create: `src/app/ui/**` (hasil generate `ng g @spartan-ng/cli:ui`)

**Interfaces:**
- Consumes: Task 1-2.
- Produces: komponen helm Spartan di `src/app/ui/` yang dipakai seluruh aplikasi: `button`, `card`, `input`, `textarea`, `label`, `select`, `checkbox`, `radio-group`, `switch`, `badge`, `avatar`, `separator`, `table`, `sheet`, `dialog`, `alert-dialog`, `dropdown-menu`, `tabs`, `tooltip`, `command`, `calendar`, `date-picker`, `input-otp`, `sonner`, `skeleton`, `popover`, `alert`, `scroll-area`, `collapsible`, `kbd`.

- [ ] **Step 1: Install Spartan CLI + dependencies**

```bash
npm i -D @spartan-ng/cli
npm i @angular/cdk clsx tailwind-merge luxon
```

- [ ] **Step 2: Generate komponen helm**

```bash
ng g @spartan-ng/cli:ui --style nova
```

Pilih komponen sesuai daftar di atas (default preset `nova`, path components `src/app/ui`). Jika CLI membutuhkan Nx config dan gagal di project Angular CLI murni, fallback: generate manual dengan meng-copy template helm dari repo spartan (`https://github.com/spartan-ng/spartan/tree/main/libs/ui`) ke `src/app/ui/<name>/helm/` + pasang `@spartan-ng/brain`:

```bash
npm i @spartan-ng/brain
```

- [ ] **Step 3: Verifikasi**

```bash
ng build && ng lint
```

Expected: build & lint sukses. Cek `components.json` terisi `componentsPath`, `importAlias`.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: add spartan ui helm components"
```

---

### Task 4: Utilitas inti — `cn`, storage service, helpers

**Files:**
- Create: `src/app/shared/utils/cn.ts`
- Create: `src/app/shared/utils/display-name.ts`
- Create: `src/app/core/services/storage.service.ts`
- Test: `src/app/shared/utils/cn.spec.ts`

**Interfaces:**
- `cn(...inputs: ClassValue[]): string`
- `getDisplayNameInitials(name: string): string`
- `StorageService` (providedIn root): `get<T>(key: string): T | null`, `set(key: string, value: unknown): void`, `remove(key: string): void`

- [ ] **Step 1: Tulis failing test** — `src/app/shared/utils/cn.spec.ts`

```ts
import { describe, expect, it } from 'vitest'
import { cn } from './cn'

describe('cn', () => {
  it('merges tailwind classes, later wins', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4')
  })
  it('handles conditional and falsy values', () => {
    expect(cn('a', false && 'b', undefined, null, 'c')).toBe('a c')
  })
})
```

- [ ] **Step 2: Run test — verifikasi fail**

Run: `ng test --no-watch`
Expected: FAIL (`cn` belum ada).

- [ ] **Step 3: Implementasi `cn`**

```ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
```

- [ ] **Step 4: Implementasi `getDisplayNameInitials`** — `src/app/shared/utils/display-name.ts`

```ts
export function getDisplayNameInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
}
```

- [ ] **Step 5: Implementasi StorageService** — `src/app/core/services/storage.service.ts`

```ts
import { Injectable } from '@angular/core'

const STORAGE_PREFIX = 'shadcn-admin-angular'

@Injectable({ providedIn: 'root' })
export class StorageService {
  get<T>(key: string): T | null {
    const raw = typeof window !== 'undefined' ? window.localStorage.getItem(`${STORAGE_PREFIX}:${key}`) : null
    if (raw === null) return null
    try {
      return JSON.parse(raw) as T
    } catch {
      return null
    }
  }

  set(key: string, value: unknown): void {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(`${STORAGE_PREFIX}:${key}`, JSON.stringify(value))
    }
  }

  remove(key: string): void {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(`${STORAGE_PREFIX}:${key}`)
    }
  }
}
```

- [ ] **Step 6: Run test — verifikasi pass**

Run: `ng test --no-watch`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat: add cn util, display name initials, and storage service"
```

---

### Task 5: ThemeService (light/dark/system)

**Files:**
- Create: `src/app/core/services/theme.service.ts`
- Create: `src/app/core/services/theme.service.spec.ts`

**Interfaces:**
- `type Theme = 'light' | 'dark' | 'system'`
- `ThemeService` (providedIn root):
  - `theme: Signal<Theme>`
  - `resolvedTheme: Signal<'light' | 'dark'>`
  - `setTheme(theme: Theme): void`
  - `resetTheme(): void`
  - `defaultTheme: Theme` (= 'system')
  - Key storage: `'theme'`

- [ ] **Step 1: Tulis failing test** — `theme.service.spec.ts`

```ts
import { TestBed } from '@angular/core/testing'
import { ThemeService } from './theme.service'

describe('ThemeService', () => {
  it('defaults to system and resolves to light/dark', () => {
    const service = TestBed.inject(ThemeService)
    expect(service.theme()).toBe('system')
    expect(['light', 'dark']).toContain(service.resolvedTheme())
  })

  it('setTheme updates the signal', () => {
    const service = TestBed.inject(ThemeService)
    service.setTheme('dark')
    expect(service.theme()).toBe('dark')
    expect(service.resolvedTheme()).toBe('dark')
  })

  it('resetTheme restores default', () => {
    const service = TestBed.inject(ThemeService)
    service.setTheme('light')
    service.resetTheme()
    expect(service.theme()).toBe('system')
  })
})
```

- [ ] **Step 2: Run test — verifikasi fail** (ThemeService belum ada).

- [ ] **Step 3: Implementasi**

```ts
import { Injectable, computed, effect, signal } from '@angular/core'
import { StorageService } from './storage.service'

export type Theme = 'light' | 'dark' | 'system'

const DEFAULT_THEME: Theme = 'system'
const THEME_KEY = 'theme'

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly defaultTheme = DEFAULT_THEME
  readonly theme = signal<Theme>(DEFAULT_THEME)

  readonly resolvedTheme = computed<'light' | 'dark'>(() => {
    if (this.theme() === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return this.theme()
  })

  private readonly mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

  constructor(private readonly storage: StorageService) {
    const saved = this.storage.get<Theme>(THEME_KEY)
    if (saved === 'light' || saved === 'dark' || saved === 'system') {
      this.theme.set(saved)
    }

    effect(() => {
      const root = document.documentElement
      root.classList.remove('light', 'dark')
      root.classList.add(this.resolvedTheme())
    })

    this.mediaQuery.addEventListener('change', () => {
      if (this.theme() === 'system') {
        const root = document.documentElement
        root.classList.remove('light', 'dark')
        root.classList.add(this.mediaQuery.matches ? 'dark' : 'light')
      }
    })
  }

  setTheme(theme: Theme): void {
    this.theme.set(theme)
    this.storage.set(THEME_KEY, theme)
  }

  resetTheme(): void {
    this.theme.set(DEFAULT_THEME)
    this.storage.remove(THEME_KEY)
  }
}
```

Catatan: untuk testability, gunakan `MediaQueryList` stub via mock di test; atau bungkus `window.matchMedia` dalam fungsi internal yang bisa di-override. Pastikan test tidak bergantung pada environment nyata.

- [ ] **Step 4: Run test — verifikasi pass**

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add theme service with light/dark/system and persistence"
```

---

### Task 6: FontService

**Files:**
- Create: `src/app/core/services/font.service.ts`
- Create: `src/app/core/services/font.service.spec.ts`

**Interfaces:**
- `FontService` (providedIn root):
  - `font: Signal<Font>` (dari `config/fonts.ts`)
  - `setFont(font: Font): void`
  - `resetFont(): void`
  - `defaultFont: Font` (= `'jetbrains-mono'`), key storage `'font'`

- [ ] **Step 1: Tulis failing test**

```ts
import { TestBed } from '@angular/core/testing'
import { FontService } from './font.service'

describe('FontService', () => {
  it('defaults to jetbrains-mono', () => {
    const service = TestBed.inject(FontService)
    expect(service.font()).toBe('jetbrains-mono')
  })

  it('setFont applies font class to html element', () => {
    const service = TestBed.inject(FontService)
    service.setFont('inter')
    expect(service.font()).toBe('inter')
    expect(document.documentElement.classList.contains('font-inter')).toBe(true)
    expect(document.documentElement.classList.contains('font-jetbrains-mono')).toBe(false)
  })
})
```

- [ ] **Step 2: Run test — fail.**

- [ ] **Step 3: Implementasi**

```ts
import { Injectable, effect, signal } from '@angular/core'
import { fonts, type Font } from '../../config/fonts'
import { StorageService } from './storage.service'

const FONT_KEY = 'font'

@Injectable({ providedIn: 'root' })
export class FontService {
  readonly defaultFont: Font = 'jetbrains-mono'
  readonly font = signal<Font>(this.defaultFont)

  constructor(private readonly storage: StorageService) {
    const saved = this.storage.get<Font>(FONT_KEY)
    if (fonts.includes(saved as Font)) {
      this.font.set(saved as Font)
    }

    effect(() => {
      const root = document.documentElement
      root.classList.forEach((cls) => {
        if (cls.startsWith('font-')) root.classList.remove(cls)
      })
      root.classList.add(`font-${this.font()}`)
    })
  }

  setFont(font: Font): void {
    this.font.set(font)
    this.storage.set(FONT_KEY, font)
  }

  resetFont(): void {
    this.font.set(this.defaultFont)
    this.storage.remove(FONT_KEY)
  }
}
```

- [ ] **Step 4: Run test — pass.**

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add font service with jetbrains mono default"
```

---

### Task 7: LayoutService + SidebarService

**Files:**
- Create: `src/app/core/services/layout.service.ts`
- Create: `src/app/core/services/layout.service.spec.ts`
- Create: `src/app/core/services/sidebar.service.ts`
- Create: `src/app/core/services/sidebar.service.spec.ts`

**Interfaces:**
- `type Collapsible = 'offcanvas' | 'icon' | 'none'`
- `type Variant = 'inset' | 'sidebar' | 'floating'`
- `LayoutService`:
  - `collapsible: Signal<Collapsible>`, `setCollapsible(c: Collapsible): void`
  - `variant: Signal<Variant>`, `setVariant(v: Variant): void`
  - `resetLayout(): void`
  - `defaultCollapsible: 'icon'`, `defaultVariant: 'inset'`; keys storage `'layout-collapsible'`, `'layout-variant'`
- `SidebarService`:
  - `open: Signal<boolean>`, `setOpen(open: boolean): void`, `toggleOpen(): void`
  - `isMobile: Signal<boolean>` (dari media query `(max-width: 767px)`)

- [ ] **Step 1: Tulis failing tests** (layout: default `icon`/`inset`, setter + persist; sidebar: default open true, toggle, setOpen).

- [ ] **Step 2: Run — fail.**

- [ ] **Step 3: Implementasi LayoutService**

```ts
import { Injectable, signal } from '@angular/core'
import { StorageService } from './storage.service'

export type Collapsible = 'offcanvas' | 'icon' | 'none'
export type Variant = 'inset' | 'sidebar' | 'floating'

const DEFAULT_COLLAPSIBLE: Collapsible = 'icon'
const DEFAULT_VARIANT: Variant = 'inset'
const KEY_COLLAPSIBLE = 'layout-collapsible'
const KEY_VARIANT = 'layout-variant'

@Injectable({ providedIn: 'root' })
export class LayoutService {
  readonly defaultCollapsible = DEFAULT_COLLAPSIBLE
  readonly defaultVariant = DEFAULT_VARIANT

  readonly collapsible = signal<Collapsible>(DEFAULT_COLLAPSIBLE)
  readonly variant = signal<Variant>(DEFAULT_VARIANT)

  constructor(private readonly storage: StorageService) {
    const savedCollapsible = this.storage.get<Collapsible>(KEY_COLLAPSIBLE)
    if (savedCollapsible === 'offcanvas' || savedCollapsible === 'icon' || savedCollapsible === 'none') {
      this.collapsible.set(savedCollapsible)
    }
    const savedVariant = this.storage.get<Variant>(KEY_VARIANT)
    if (savedVariant === 'inset' || savedVariant === 'sidebar' || savedVariant === 'floating') {
      this.variant.set(savedVariant)
    }
  }

  setCollapsible(collapsible: Collapsible): void {
    this.collapsible.set(collapsible)
    this.storage.set(KEY_COLLAPSIBLE, collapsible)
  }

  setVariant(variant: Variant): void {
    this.variant.set(variant)
    this.storage.set(KEY_VARIANT, variant)
  }

  resetLayout(): void {
    this.setCollapsible(DEFAULT_COLLAPSIBLE)
    this.setVariant(DEFAULT_VARIANT)
  }
}
```

- [ ] **Step 4: Implementasi SidebarService**

```ts
import { Injectable, signal } from '@angular/core'

@Injectable({ providedIn: 'root' })
export class SidebarService {
  readonly open = signal(true)
  readonly isMobile = signal(false)

  constructor() {
    const query = window.matchMedia('(max-width: 767px)')
    this.isMobile.set(query.matches)
    query.addEventListener('change', (event) => this.isMobile.set(event.matches))
  }

  setOpen(open: boolean): void {
    this.open.set(open)
  }

  toggleOpen(): void {
    this.open.update((value) => !value)
  }
}
```

Catatan: `sidebar_state` cookie pada source mengontrol default open. Gunakan StorageService key `'sidebar-open'` (default `true`) pada inisialisasi agar perilaku persist (modifikasi: baca di constructor).

- [ ] **Step 5: Run tests — pass.**

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: add layout and sidebar services"
```

---

### Task 8: NavProgress + SkipToMain + app shell routes

**Files:**
- Create: `src/app/components/navigation-progress/navigation-progress.component.ts` (+ html)
- Create: `src/app/components/skip-to-main/skip-to-main.component.ts` (+ html)
- Create: `src/app/layouts/authenticated-layout/authenticated-layout.component.ts` (+ html)
- Create: `src/app/layouts/auth-layout/auth-layout.component.ts` (+ html)
- Create: `src/app/layouts/settings-layout/settings-layout.component.ts` (+ html)
- Modify: `src/app/app.routes.ts`, `src/app/app.ts`, `src/app/app.config.ts`

**Interfaces:**
- `NavigationProgressComponent` — memakai `Router.events`; animasi bar 2px, warna `var(--muted-foreground)`.
- `SkipToMainComponent` — link "Skip to main content" (persis source `skip-to-main.tsx`).
- `AuthenticatedLayoutComponent` — struktur root: `<app-navigation-progress/>`, `<router-outlet/>`, toaster. (layout utama sidebar/header di Task 9-12; shell ini = wrapper aplikasi).

Catatan sumber: `shadcn-admin/src/components/skip-to-main.tsx`, `shadcn-admin/src/components/navigation-progress.tsx`.

- [ ] **Step 1: Tulis failing tests** — NavProgress subscribe `Router.events`; saat `NavigationStart` set progress aktif; saat `NavigationEnd`/`NavigationError`/`NavigationCancel` set 100. (Test dengan `TestBed` + `RouterTestingHarness` atau spy pada `Router.events`.)

- [ ] **Step 2: Implementasi NavProgressComponent**

```ts
import { ChangeDetectionStrategy, Component, OnDestroy, inject, signal } from '@angular/core'
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-navigation-progress',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (visible()) {
      <div class="navigation-progress" aria-hidden="true"></div>
    }
  `,
  styles: [
    `
      .navigation-progress {
        position: fixed;
        top: 0;
        left: 0;
        height: 2px;
        width: 100%;
        z-index: 9999;
        background: var(--muted-foreground);
        transform-origin: 0 0;
        animation: navigation-progress-grow 2s ease-out infinite;
      }
      @keyframes navigation-progress-grow {
        0% { transform: scaleX(0); }
        60% { transform: scaleX(0.6); }
        100% { transform: scaleX(0.99); }
      }
    `,
  ],
})
export class NavigationProgressComponent implements OnDestroy {
  private readonly router = inject(Router)
  protected readonly visible = signal(false)
  private readonly subscription: Subscription

  constructor() {
    this.subscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) this.visible.set(true)
      else if (event instanceof NavigationEnd || event instanceof NavigationError || event instanceof NavigationCancel) {
        setTimeout(() => this.visible.set(false), 400)
      }
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }
}
```

- [ ] **Step 3: Implementasi SkipToMainComponent** (salin struktur & class dari source `skip-to-main.tsx`).

- [ ] **Step 4: Buat shells layout** — ketiganya: `standalone: true`, `template` minimal dengan `<router-outlet/>` (authenticated-layout & settings-layout akan dilengkapi di Task 9-12; di task ini cukup placeholder + `SkipToMain` di authenticated).

- [ ] **Step 5: Buat app.routes.ts skeleton**

```ts
import { Routes } from '@angular/router'

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/sign-in' },
  // Semua route utama akan ditambahkan di Task berikutnya
  { path: '**', redirectTo: '/sign-in' },
]
```

(Catatan: route definitif finalisasi di Task 19; skeleton ini dibuat agar app berjalan.)

- [ ] **Step 6: Update `app.ts`** — `standalone: true`, import `RouterOutlet`, template `<app-navigation-progress/><router-outlet/>`.

- [ ] **Step 7: Run `ng test --no-watch` — pass; `ng build && ng lint` — bersih.**

- [ ] **Step 8: Commit**

```bash
git add -A && git commit -m "feat: add navigation progress, skip link, and layout shells"
```

---

## Phase 2 — Layout System

### Task 9: Sidebar system (app-sidebar, nav-group, team-switcher, nav-user)

**Files:**
- Create: `src/app/components/layout/sidebar/*` (sidebar.component, sidebar-header/content/footer/rail/trigger dsb sebagai `SidebarComponent` + directive)
- Create: `src/app/components/layout/app-sidebar/app-sidebar.component.ts`
- Create: `src/app/components/layout/nav-group/nav-group.component.ts`
- Create: `src/app/components/layout/team-switcher/team-switcher.component.ts`
- Create: `src/app/components/layout/nav-user/nav-user.component.ts`
- Create: `src/app/components/layout/data/sidebar-data.ts`
- Create: `src/app/components/layout/types.ts`
- Create: `src/app/assets/logo/logo.component.ts`

**Interfaces:**
- `SidebarData` (`types.ts`): `user`, `teams[]`, `navGroups[]` — salin struktur dari `shadcn-admin/src/components/layout/types.ts` & `data/sidebar-data.ts`, ganti ikon dengan nama string/type Lucide (`@ng-icons/lucide` export `LucideIcons` record; simpan nama ikon sebagai string, render dengan `<ng-icon>`).
- `SidebarComponent`: input `collapsible: Collapsible`, `variant: Variant`; output `(triggerClick)`; expose state via `SidebarService`.
- `NavGroupComponent`: input `group: NavGroup`; render collapsible sub-items (Spartan collapsible) bila `items.length > 0`; aktif state via `RouterLinkActive`.
- `TeamSwitcherComponent`: input `teams`; Spartan dropdown-menu; menampilkan logo + nama + plan; switcher antar 3 tim (state lokal).
- `NavUserComponent`: input `user`; dropdown menu (profile, billing, sign out) — salin struktur source `nav-user.tsx`.

**Referensi source:** `shadcn-admin/src/components/ui/sidebar.tsx`, `shadcn-admin/src/components/layout/{app-sidebar,nav-group,team-switcher,nav-user}.tsx`.

- [ ] **Step 1: Salin data sidebar** — `sidebar-data.ts` (nama ikon dari lucide, badge '3' pada Chats, sub-items Auth/Errors/Settings + Secured by Clerk). Kelompok:

```
General: Dashboard(/), Tasks(/tasks), Apps(/apps), Chats(/chats, badge 3), Users(/users), Secured by Clerk (Sign In, Sign Up, User Management)
Pages: Auth (Sign In /sign-in, Sign In (2 Col) /sign-in-2, Sign Up /sign-up, Forgot Password /forgot-password, OTP /otp), Errors (Unauthorized /errors/unauthorized, ... 5)
Other: Settings (Profile /settings, Account /settings/account, Appearance /settings/appearance, Notifications /settings/notifications, Display /settings/display), Help Center /help-center
```

- [ ] **Step 2: Buat `LogoComponent`** — SVG dari `shadcn-admin/src/assets/logo.tsx` (rounded square + Command icon lucide).

- [ ] **Step 3: Buat `SidebarComponent` + sub-parts** — implementasikan behavior dari source `sidebar.tsx`:
  - Desktop: `w-64`, border-end; variant `inset` (m-2 rounded-2xl bg-sidebar border), `floating` (m-2 rounded-xl border bg-sidebar shadow), `sidebar` (full-height border).
  - Collapsible `icon`: collapse ke `w-16` (hanya ikon); `offcanvas`: hidden + overlay.
  - Mobile (< 768): tampil sebagai offcanvas (Spartan Sheet), dengan `SidebarTrigger`.
  - Gunakan `SidebarService` (open) + `LayoutService` (variant/collapsible).

- [ ] **Step 4: Buat `NavGroupComponent`** — persis struktur source: judul group (`text-xs ... text-sidebar-foreground/70`), item link (`SidebarMenuButton` = `<a>` rounded-md px-2 py-1 text-sm, active: `bg-sidebar-accent text-sidebar-accent-foreground`), sub-items pakai Spartan collapsible; badge.

- [ ] **Step 5: Buat `TeamSwitcherComponent` + `NavUserComponent`** — dropdown menu Spartan; salin class dari source.

- [ ] **Step 6: Rakit `AppSidebarComponent`** — `<app-sidebar>` + header (team-switcher) + content (nav-groups) + footer (nav-user) + rail. Wire `RouterLink` ke semua url.

- [ ] **Step 7: Lengkapi `AuthenticatedLayoutComponent`** — `<app-app-sidebar/>` + `<div class="flex min-h-svh flex-col peer-data-[variant=inset]:min-h-0 bg-background">` (lihat source `authenticated-layout.tsx` + `sidebar.tsx` `SidebarInset`). Tambahkan container query `@container/content`.

- [ ] **Step 8: Verifikasi** — `ng build && ng lint`; jalankan `ng serve`, cek sidebar tampil, navigasi berubah (RouterLinkActive), mobile → offcanvas.

- [ ] **Step 9: Commit**

```bash
git add -A && git commit -m "feat: add custom sidebar layout system with nav groups"
```

---

### Task 10: Header + Main + TopNav

**Files:**
- Create: `src/app/components/layout/header/header.component.ts`
- Create: `src/app/components/layout/main/main.component.ts`
- Create: `src/app/components/layout/top-nav/top-nav.component.ts`
- Create: `src/app/components/layout/app-title/app-title.component.ts`

**Interfaces:**
- `HeaderComponent`: input `fixed?: boolean`; content projection; scroll listener (`offset > 10` → shadow + backdrop-blur). Salin class dari `shadcn-admin/src/components/layout/header.tsx`.
- `MainComponent`: input `fixed?: boolean`, `fluid?: boolean`; salin class dari `main.tsx`.
- `TopNavComponent`: input `links: { title, href, isActive, disabled }[]`.

**Referensi:** `shadcn-admin/src/components/layout/{header,main,top-nav,app-title}.tsx`.

- [ ] **Step 1: Implementasi HeaderComponent**

```ts
@Component({
  selector: 'app-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header
      class="z-50 h-16"
      [class.header-fixed]="fixed()"
      [class.peer]="fixed()"
      [class.sticky]="fixed()"
      [class.top-0]="fixed()"
      [class.w-inherit]="fixed()"
      [class.shadow]="offset() > 10 && fixed()"
      [class.shadow-none]="!(offset() > 10 && fixed())"
    >
      <div
        class="relative flex h-full items-center gap-3 p-4 sm:gap-4"
        [class.after-absolute]="offset() > 10 && fixed()"
        [class.after-inset-0]="offset() > 10 && fixed()"
        [class.after--z-10]="offset() > 10 && fixed()"
        [class.after:bg-background/20]="offset() > 10 && fixed()"
        [class.after:backdrop-blur-lg]="offset() > 10 && fixed()"
      >
        <app-sidebar-trigger variant="outline" class="max-md:scale-125" />
        <hlm-separator orientation="vertical" class="h-6" />
        <ng-content />
      </div>
    </header>
  `,
})
```

Tambahkan `SidebarTriggerComponent` (tombol dengan hamburger/menu icon, toggle `SidebarService.open`). Scroll listener via `HostListener('window:scroll')`.

- [ ] **Step 2: Implementasi MainComponent** — template `<main [attr.data-layout]="fixed() ? 'fixed' : 'auto'" [class]="classes">` dengan class `px-4 py-6`, `fixed && 'flex grow flex-col overflow-hidden'`, `!fluid && '@7xl/content:mx-auto @7xl/content:w-full @7xl/content:max-w-7xl'`, + `<ng-content/>`.

- [ ] **Step 3: Implementasi TopNavComponent** — ul `flex items-center gap-2`, item aktif `bg-primary text-primary-foreground`, disabled `opacity-50 pointer-events-none`. Salin class source.

- [ ] **Step 4: Implementasi AppTitleComponent** — logo + "Shadcn Admin".

- [ ] **Step 5: Verifikasi + commit**

```bash
ng build && ng lint
git add -A && git commit -m "feat: add header, main, top nav components"
```

---

### Task 11: ConfigDrawer + custom preview icons

**Files:**
- Create: `src/app/components/config-drawer/config-drawer.component.ts`
- Create: `src/app/assets/custom-icons/*.ts` (preview icons SVG: theme-light/dark/system, sidebar-inset/floating/sidebar, layout-default/compact/full)
- Modify: `src/app/components/config-drawer/config-drawer.component.html`

**Interfaces:**
- `ConfigDrawerComponent` — Spartan Sheet (trigger = Button ghost icon Settings, rounded-full); konten: ThemeConfig (radio 3), SidebarConfig (radio 3, `max-md:hidden`), LayoutConfig (radio 3, `max-md:hidden`), Footer Reset (destructive).

**Referensi:** `shadcn-admin/src/components/config-drawer.tsx` + `src/assets/custom/icon-*.tsx`.

- [ ] **Step 1: Salin preview icons** sebagai komponen SVG (path dari source `icon-theme-light.tsx`, `icon-theme-dark.tsx`, `icon-theme-system.tsx`, `icon-sidebar-inset.tsx`, `icon-sidebar-floating.tsx`, `icon-sidebar-sidebar.tsx`, `icon-layout-default.tsx`, `icon-layout-compact.tsx`, `icon-layout-full.tsx`).

- [ ] **Step 2: Implementasi ConfigDrawer** — radio group Spartan (`hlm-radio-group` + `hlm-radio`), setiap item: preview icon dalam `div` dengan `ring-border`, `group-data-[state=checked]:ring-primary`, CircleCheck overlay (lucide `CircleCheck` `fill-primary stroke-white`); label `text-xs`. Persis class source.

- [ ] **Step 3: Wiring state** — ThemeConfig → `ThemeService`; SidebarConfig → `LayoutService.variant`; LayoutConfig → `SidebarService.open` + `LayoutService.collapsible` (radioState = open ? 'default' : collapsible); tombol Reset global → `sidebarService.setOpen(true)`, `themeService.resetTheme()`, `layoutService.resetLayout()`.

- [ ] **Step 4: Verifikasi + commit** (build/lint; cek drawer terbuka & perubahan state hidup).

```bash
git add -A && git commit -m "feat: add config drawer with theme/layout/sidebar options"
```

---

### Task 12: CommandMenu + SearchProvider + Search + ThemeSwitch + ProfileDropdown

**Files:**
- Create: `src/app/components/command-menu/command-menu.component.ts`
- Create: `src/app/core/services/search.service.ts`
- Create: `src/app/components/search/search.component.ts`
- Create: `src/app/components/theme-switch/theme-switch.component.ts`
- Create: `src/app/components/profile-dropdown/profile-dropdown.component.ts`

**Interfaces:**
- `SearchService` (providedIn root): `open: Signal<boolean>`, `setOpen(v: boolean)`. Subscribe global `keydown` (Ctrl/Cmd+K) → toggle.
- `CommandMenuComponent` — Spartan `hlm-command-dialog`; input placeholder "Type a command or search..."; groups dari `sidebarData.navGroups` (item dengan url → navigate; sub-item → navigate); CommandSeparator + group Theme (Light/Dark/System → `ThemeService`). Scroll area `h-72 pe-1` dengan ScrollArea Spartan. (Referensi: `shadcn-admin/src/components/command-menu.tsx`.)
- `SearchComponent` — tombol dengan ikon Search + Kbd "Ctrl K" (atau `⌘K`), klik → `SearchService.setOpen(true)`. Salin class dari `shadcn-admin/src/components/search.tsx`.
- `ThemeSwitchComponent` — dropdown: tombol yang menampilkan Sun/Moon sesuai `resolvedTheme`; menu Light/Dark/System. Salin `theme-switch.tsx`.
- `ProfileDropdownComponent` — avatar user (satnaing/shadcn.jpg), dropdown menu (Profile, Billing, Team, Subscription, Sign Out) persis source `profile-dropdown.tsx`.

- [ ] **Step 1: Implementasi SearchService + test** (open state; keydown Ctrl+K toggle).

- [ ] **Step 2: Implementasi CommandMenu + Search + ThemeSwitch + ProfileDropdown.**

- [ ] **Step 3: Rakit di `AuthenticatedLayoutComponent`** — `SearchService` scope + `<app-command-menu/>`.

- [ ] **Step 4: Verifikasi + commit**

```bash
ng build && ng lint
git add -A && git commit -m "feat: add command menu, search, theme switch, profile dropdown"
```

---

## Phase 3 — Shared Primitives

### Task 13: Brand icons + Logo + assets

**Files:**
- Create: `src/app/shared/icons/brand/*.ts` (16 brand icons SVG dari `shadcn-admin/src/assets/brand-icons/*.tsx`)
- Create: `src/app/shared/icons/brand/index.ts` (record nama → komponen)

**Interfaces:**
- `BrandIconComponent` — input `name: string`; render SVG sesuai nama.

**Referensi:** `shadcn-admin/src/assets/brand-icons/*.tsx` (discord, docker, facebook, figma, github, gitlab, gmail, medium, notion, skype, slack, stripe, telegram, trello, whatsapp, zoom).

- [ ] **Step 1: Salin semua path SVG** ke komponen Angular (template SVG inline `viewBox="0 0 24 24"`, `fill="currentColor"` sesuai source).
- [ ] **Step 2: Salin aset statis** — dari `shadcn-admin/public/`: `images/` (favicon, preview dashboard untuk auth), `avatars/` (01-05.png, shadcn.jpg) → `shadcn-admin-angular/public/`.
- [ ] **Step 3: Verifikasi + commit** (build/lint).

```bash
git add -A && git commit -m "feat: add brand icons and static assets"
```

---

### Task 14: Chart components (BarChart, AreaChart, SimpleBarList)

**Files:**
- Create: `src/app/shared/charts/bar-chart.component.ts`
- Create: `src/app/shared/charts/area-chart.component.ts`
- Create: `src/app/shared/charts/simple-bar-list.component.ts`
- Create: `src/app/shared/charts/chart-axis.util.ts`

**Interfaces:**
- `BarChartComponent`: input `data: { name: string; value: number }[]`; output: none. Render SVG: sumbu X/Y tanpa garis (tick `#888888`, fontSize 12), bar `fill="currentColor"` `class="fill-primary"` radius `[4,4,0,0]`. Ukuran responsif (viewBox + `width="100%"`, `height=350`).
- `AreaChartComponent`: input `data: { name: string; clicks: number; uniques: number }[]`; dua area (monotone) dengan gradient fill, series 1 `text-primary` fillOpacity 0.15, series 2 `text-muted-foreground` fillOpacity 0.1; `height=300`.
- `SimpleBarListComponent`: input `items: { name: string; value: number }[]`, `barClass: string`, `valueFormatter: (n: number) => string`; bar horizontal `h-2.5 rounded-full`.

**Referensi:** `shadcn-admin/src/features/dashboard/components/{overview,analytics-chart}.tsx` dan `analytics.tsx` (SimpleBarList).

- [ ] **Step 1: Tulis util** `chart-axis.util.ts`: `niceTicks(max: number, count: number): number[]` (buat ticks sumbu Y agar tidak overlap; gunakan ticks 0, max/2, max dst). + test unit.
- [ ] **Step 2: Implementasi BarChartComponent** — SVG: `<g>` ticks, `<rect>` per bar (x = idx*(w/n), width = barWidth, y = h - value/scale*h, rx=4 ry=4, `fill="currentColor"` class `text-primary`), tooltip sederhana (title element). Axis label `$` prefix.
- [ ] **Step 3: Implementasi AreaChartComponent** — buat path area (`M... L... L... Z`) + path line; `<linearGradient>` dua gradient (primary → transparent, muted → transparent). Sumbu sama seperti bar.
- [ ] **Step 4: Implementasi SimpleBarListComponent** — ul list; `width = (value/max*100)%`.
- [ ] **Step 5: Unit test** — test tick util + SimpleBarList width computation.
- [ ] **Step 6: Verifikasi + commit** (build/lint; render di dashboard Task 20).

```bash
git add -A && git commit -m "feat: add custom svg chart components"
```

---

### Task 15: Data table engine (signals) + toolbar/pagination/filters/view-options

**Files:**
- Create: `src/app/shared/data-table/table-engine.ts`
- Create: `src/app/shared/data-table/data-table.component.ts` (+ html)
- Create: `src/app/shared/data-table/data-table-toolbar.component.ts`
- Create: `src/app/shared/data-table/data-table-pagination.component.ts`
- Create: `src/app/shared/data-table/data-table-faceted-filter.component.ts`
- Create: `src/app/shared/data-table/data-table-column-header.component.ts`
- Create: `src/app/shared/data-table/data-table-view-options.component.ts`
- Create: `src/app/shared/data-table/data-table-bulk-actions.component.ts`
- Create: `src/app/shared/data-table/url-table-state.ts`

**Interfaces:**

`table-engine.ts`:

```ts
export type SortDirection = 'asc' | 'desc'
export interface ColumnSort { column: string; direction: SortDirection }
export interface ColumnFilter { id: string; value: string[] }
export interface TableState {
  globalFilter: string
  columnFilters: ColumnFilter[]
  sorting: ColumnSort[]
  pagination: { pageIndex: number; pageSize: number }
  rowSelection: Record<string, boolean>
  columnVisibility: Record<string, boolean>
}

export interface TableColumn<T> {
  id: string
  header: string
  accessorFn?: (row: T) => unknown
  cell?: (row: T) => string
  enableSorting?: boolean
  enableHiding?: boolean
  enableGlobalFilter?: boolean
  meta?: { className?: string; thClassName?: string; tdClassName?: string }
}

export class TableEngine<T extends { id: string }> {
  state: WritableSignal<TableState>
  rows: Signal<T[]>          // filtered + sorted + paginated
  pageCount: Signal<number>
  filteredRows: Signal<T[]>
  allRowSelection: Signal<boolean>
  someRowSelection: Signal<boolean>
  selectedRows: Signal<T[]>
  getCellValue(row: T, columnId: string): unknown
  toggleRowSelection(id: string, selected: boolean): void
  toggleAllRows(): void
  resetRowSelection(): void
  // setter helpers: setGlobalFilter, setSorting, setColumnFilter(id, values),
  // setPageIndex, setPageSize, setColumnVisibility, toggleColumnVisibility
}
```

Semua logika murni (tanpa DOM) sehingga mudah di-test.

`url-table-state.ts` — sinkronisasi state → URL query params & sebaliknya:

```ts
export function tableStateFromUrl(params: { globalFilter?: string; status?: string[]; priority?: string[]; page?: number; pageSize?: number }): Partial<TableState>
export function tableStateToUrl(state: TableState): { globalFilter?: string; status?: string[]; priority?: string[]; page?: number; pageSize?: number }
```

**Referensi source:** `shadcn-admin/src/features/tasks/components/tasks-table.tsx`, `shadcn-admin/src/components/data-table/*`, `shadcn-admin/src/hooks/use-table-url-state.ts`.

- [ ] **Step 1: Implementasi `table-engine.ts`** — fungsi murni: `filterRows`, `sortRows`, `paginateRows`, `facetValues` (unique values per kolom), `globalFilterFn` (id/title includes). Tulis **unit test lengkap** (sort asc/desc, filter global, filter kolom, kombinasi, pagination clamp, selection all/some).

- [ ] **Step 2: Implementasi `url-table-state.ts`** + test (serialize/parse round-trip).

- [ ] **Step 3: Implementasi `data-table.component.ts`** — generic `<app-data-table [columns]="..." [data]="..." [urlSync]="true">`. Di dalam: render Spartan `hlm-table` (Table/TableHeader/TableBody/TableRow/TableCell), checkbox selection di kolom pertama, `ColumnHeaderComponent` untuk sorting, cells, dan kosong → "No results." (row colSpan). Terapkan `meta.className` pada th/td.

- [ ] **Step 4: Implementasi toolbar & filter** — `DataTableToolbarComponent`: input search placeholder + filter configs (`{ columnId, title, options: { label, value, icon }[] }`); `DataTableFacetedFilterComponent`: Spartan popover + checkbox list + badge counts; `DataTableViewOptionsComponent`: dropdown visibility toggle; `DataTableColumnHeaderComponent`: sort asc/desc/none dengan ArrowUp/ArrowDown/ChevronsUpDown.

- [ ] **Step 5: Implementasi pagination** — prev/next + page size select (10/20/30/40/50) + info "Page X of Y". `DataTableBulkActionsComponent`: badge jumlah dipilih + tombol action (slot content).

- [ ] **Step 6: Unit test** — focus pada `table-engine` (80%+ coverage logika), `url-table-state`.

- [ ] **Step 7: Verifikasi + commit** (build/lint/test).

```bash
git add -A && git commit -m "feat: add signal-based data table engine with url sync"
```

---

### Task 16: DatePicker + Calendar + Toast + show-submitted-data

**Files:**
- Create: `src/app/components/date-picker/date-picker.component.ts`
- Create: `src/app/shared/utils/show-submitted-data.ts`
- Create: `src/app/core/services/toast.service.ts` (wrapper Spartan sonner)

**Interfaces:**
- `DatePickerComponent`: input `selected: Date | null`, output `(selectedChange: Date | null)`; trigger button (variant outline, w-[280px], CalendarIcon `ms-auto opacity-50`) + Spartan popover + `hlm-calendar` mode single. (Referensi: `shadcn-admin/src/components/date-picker.tsx`.)
- `showSubmittedData(data: unknown): void` — tampilkan toast dengan data form yang di-submit (mirip source `show-submitted-data.tsx`, tapi pakai toast service).

**Referensi:** `shadcn-admin/src/components/date-picker.tsx`, `shadcn-admin/src/lib/show-submitted-data.tsx`.

- [ ] **Step 1: Konfigurasi toaster** — tambahkan `<hlm-toaster />` di root (authenticated-layout & auth-layout); `ToastService` wrap `ngxSonner` `toast` dari spartan (`@spartan-ng/ui-sonner-helm`).
- [ ] **Step 2: Implementasi DatePickerComponent** (spartan calendar single + popover).
- [ ] **Step 3: Implementasi showSubmittedData** (default toast: success, title "You submitted the following values", pre JSON).
- [ ] **Step 4: Verifikasi + commit** (build/lint).

```bash
git add -A && git commit -m "feat: add date picker, calendar wiring, and toast helper"
```

---

## Phase 4 — Pages

### Task 17: Dashboard

**Files:**
- Create: `src/app/features/dashboard/dashboard.component.ts` (+ html)
- Create: `src/app/features/dashboard/components/overview-chart.component.ts`
- Create: `src/app/features/dashboard/components/analytics.component.ts`
- Create: `src/app/features/dashboard/components/recent-sales.component.ts`

**Interfaces:**
- `DashboardComponent` — salin struktur `shadcn-admin/src/features/dashboard/index.tsx`: Header (TopNav + Search me-auto + ThemeSwitch + ConfigDrawer + ProfileDropdown), Main, heading "Dashboard" + Button "Download", Tabs (Overview/Analytics, Reports & Notifications disabled), grid 4 stat cards, Overview (BarChart 12 bulan, data `Math.floor(Math.random()*5000)+1000`), Recent Sales (5 baris avatar + nama + email + nominal), Analytics tab (area chart + 4 stat cards + SimpleBarList Referrers/Devices).

**Referensi:** `shadcn-admin/src/features/dashboard/index.tsx` + `components/{overview,analytics,recent-sales}.tsx`.

- [ ] **Step 1: Implementasi DashboardComponent** — Header + Main + heading + Tabs (Spartan `hlm-tabs`), stat cards dengan ikon lucide (DollarSign, Users, ShoppingCart, Activity) `text-muted-foreground h-4 w-4`.
- [ ] **Step 2: Overview chart** — `OverviewChartComponent` memakai `BarChartComponent` (12 bulan, `$` prefix, height 350).
- [ ] **Step 3: Analytics** — area chart (7 hari, data random 100-900/80-780), 4 stat cards, SimpleBarList (Referrers `bg-primary`, Devices `bg-muted-foreground`).
- [ ] **Step 4: RecentSales** — 5 item dengan avatar dari `/avatars/01..05.png`.
- [ ] **Step 5: Route** — tambahkan `{ path: '', component: DashboardComponent }` di authenticated layout (path `/`). Update `app.routes.ts`: child `/` → dashboard; shell authenticated memakai `AuthenticatedLayoutComponent` (sidebar+header terpasang).
- [ ] **Step 6: Verifikasi visual** — `ng serve`, bandingkan dengan `shadcn-admin` (pnpm dev) di viewport desktop & mobile.
- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat: add dashboard page with tabs and charts"
```

---

### Task 18: Settings (shell + 5 sub-pages)

**Files:**
- Create: `src/app/features/settings/settings.component.ts` (+ html) — shell (Header + Main fixed + heading "Settings" + Separator + sidebar-nav + `<router-outlet>`)
- Create: `src/app/features/settings/components/sidebar-nav.component.ts`
- Create: `src/app/features/settings/components/content-section.component.ts`
- Create: `src/app/features/settings/profile/profile-form.component.ts` + `profile.component.ts`
- Create: `src/app/features/settings/account/account-form.component.ts` + `account.component.ts`
- Create: `src/app/features/settings/appearance/appearance-form.component.ts` + `appearance.component.ts`
- Create: `src/app/features/settings/notifications/notifications-form.component.ts` + `notifications.component.ts`
- Create: `src/app/features/settings/display/display-form.component.ts` + `display.component.ts`

**Interfaces:**
- Settings routes: `/settings` → profile, `/settings/account`, `/settings/appearance`, `/settings/notifications`, `/settings/display` (children dari shell settings).
- Form components menggunakan Reactive Forms. Submit → `showSubmittedData(data)`.
- `AppearanceFormComponent`: select font (`fonts` array, tampilan seperti button outline, ChevronDownIcon) + RadioGroup theme (light/dark) dengan preview card visual (bg `#ecedef` / `bg-slate-950`, class persis source `appearance-form.tsx`).

**Referensi:** `shadcn-admin/src/features/settings/**` (index, sidebar-nav, content-section, profile-form, account-form, appearance-form, notifications-form, display-form).

- [ ] **Step 1: Settings shell + SidebarNav** — 5 item (Profile `/settings` UserCog, Account Wrench, Appearance Palette, Notifications Bell, Display Monitor) `size={18}`; sticky `lg:w-1/5`; `Main fixed`.
- [ ] **Step 2: Profile form** — salin `profile-form.tsx` (FieldGroup → ContentSection; input username, textarea bio, inputs URL twitter/github/linkedin; submit "Update profile").
- [ ] **Step 3: Account form** — name + dob (DatePicker) + language (select) + submit.
- [ ] **Step 4: Appearance form** — font select + theme radio; submit "Update preferences"; `setFont`/`setTheme` pada submit.
- [ ] **Step 5: Notifications form** — switch items (Communication emails, Marketing emails, Social emails, Security emails) + radio push/email/nothing; submit.
- [ ] **Step 6: Display form** — 6 checkbox items (Recents..Documents) + validasi minimal 1 item; submit.
- [ ] **Step 7: Route wiring** di `app.routes.ts` (lazy children).
- [ ] **Step 8: Verifikasi + commit**

```bash
ng build && ng lint
git add -A && git commit -m "feat: add settings pages with reactive forms"
```

---

### Task 19: Tasks feature

**Files:**
- Create: `src/app/features/tasks/data/schema.ts` (interface `Task` — id/title/status/label/priority)
- Create: `src/app/features/tasks/data/tasks.ts` (generate 100 task pakai faker seed 12345 — install `npm i @faker-js/faker`)
- Create: `src/app/features/tasks/data/data.ts` (labels/statuses/priorities + lucide icon names)
- Create: `src/app/features/tasks/store/tasks-store.service.ts` (CRUD state signals)
- Create: `src/app/features/tasks/tasks.component.ts` (+ html)
- Create: `src/app/features/tasks/components/tasks-columns.ts`
- Create: `src/app/features/tasks/components/tasks-table.component.ts`
- Create: `src/app/features/tasks/components/tasks-primary-buttons.component.ts`
- Create: `src/app/features/tasks/components/tasks-dialogs.component.ts`
- Create: `src/app/features/tasks/components/tasks-mutate-drawer.component.ts` (new/edit via Spartan sheet)
- Create: `src/app/features/tasks/components/tasks-import-dialog.component.ts`
- Create: `src/app/features/tasks/components/tasks-delete-dialog.component.ts`
- Create: `src/app/features/tasks/components/tasks-multi-delete-dialog.component.ts`

**Interfaces:**
- `TasksStore` — `tasks: Signal<Task[]>`, `addTask`, `updateTask`, `deleteTask(id)`, `deleteMany(ids)`, `importTasks(json: Task[])`.
- `TasksTableComponent` — pakai `DataTableComponent` dengan kolom: selection, ID (mono, `font-medium`), Title (link), Status (badge + dot), Priority (icon + text), dan kolom action (dropdown row actions: label select, delete). URL-sync params: `filter`, `status[]`, `priority[]`, `page`, `pageSize`.
- Kolom prioritas pakai warna (High=red, Medium=amber, Low=green, Critical=orange) — lihat `tasks-columns.tsx`.

**Referensi:** `shadcn-admin/src/features/tasks/**`.

- [ ] **Step 1: Data + schema + store** — faker seed `12345`, salin struktur source `tasks.ts`. Store dengan signals + test CRUD.
- [ ] **Step 2: tasks-columns** — definisikan `TableColumn<Task>[]` (kolom status/priority dengan dot/badge, `label` select di row actions).
- [ ] **Step 3: TasksTable** — wire DataTableEngine (global filter "Filter by title or ID...", filters status+priority, toolbar + pagination + bulk actions). `useTableUrlState` → `url-table-state` di-consume lewat `Router` (queryParams) via `Router.queryParams` signal.
- [ ] **Step 4: Dialogs** — `TasksMutateDrawer` (Spartan Sheet, form reactive id/title/status/label/priority, mode create/edit), `TasksImportDialog` (Spartan Dialog + textarea + JSON parse), `TasksDeleteDialog` & `TasksMultiDeleteDialog` (Spartan AlertDialog), `TasksDialogs` sebagai host + `TasksStore` dialog state.
- [ ] **Step 5: TasksPrimaryButtons** — dropdown "New task" (create + import) + tombol "Import" + "Add task" (persis source `tasks-primary-buttons.tsx`).
- [ ] **Step 6: Route** `/tasks` + wiring.
- [ ] **Step 7: Verifikasi + commit** (build/lint/test; test store CRUD + import).

```bash
git add -A && git commit -m "feat: add tasks feature with data table and dialogs"
```

---

### Task 20: Users feature

**Files:**
- Create: `src/app/features/users/data/schema.ts`, `data.ts`, `data/users.ts` (salin dari source — `users.ts` pakai faker seed `12345`)
- Create: `src/app/features/users/store/users-store.service.ts`
- Create: `src/app/features/users/users.component.ts` (+ html)
- Create: `src/app/features/users/components/users-columns.ts`
- Create: `src/app/features/users/components/users-table.component.ts`
- Create: `src/app/features/users/components/users-primary-buttons.component.ts`
- Create: `src/app/features/users/components/users-dialogs.component.ts`
- Create: `src/app/features/users/components/users-invite-dialog.component.ts`
- Create: `src/app/features/users/components/users-action-dialog.component.ts`
- Create: `src/app/features/users/components/users-delete-dialog.component.ts`
- Create: `src/app/features/users/components/users-multi-delete-dialog.component.ts`

**Interfaces:**
- `UsersStore` — seperti TasksStore.
- `UsersTableComponent` — kolom: selection, Name (avatar + nama + email), Company, Role (badge), Plan (badge), Status (badge), Date, action row dropdown. URL-sync: `filter`, `status[]`, `role[]`, `page`, `pageSize`.
- Dialog: invite (2 step: "Details" → "Invite"), action (activate/delete/resend email), delete (alert-dialog), multi-delete.

**Referensi:** `shadcn-admin/src/features/users/**`.

- [ ] **Step 1: Data + store + columns** (salin badge styles role/plan/status dari `users-columns.tsx`).
- [ ] **Step 2: UsersTable + primary buttons** (dropdown "Invite user" + "Add user").
- [ ] **Step 3: Dialogs** — invite (2 step), action, delete, multi-delete.
- [ ] **Step 4: Route** `/users`.
- [ ] **Step 5: Verifikasi + commit** (build/lint/test).

```bash
git add -A && git commit -m "feat: add users feature with data table and dialogs"
```

---

### Task 21: Apps feature

**Files:**
- Create: `src/app/features/apps/apps.component.ts` (+ html)
- Create: `src/app/features/apps/data/apps.ts` (salin dari `shadcn-admin/src/features/apps/data/apps.tsx`; ganti komponen logo React → nama brand icon)

**Interfaces:**
- `AppsComponent` — Header + Main fixed; heading "App Integrations"; filter input (`h-9 w-40 lg:w-62.5`), Select type (`all`/`connected`/`notConnected`, `w-36`), Select sort (`asc`/`desc` `w-16` dengan SlidersHorizontal); Separator `shadow-sm`; grid cards `md:grid-cols-2 lg:grid-cols-3` + `faded-bottom no-scrollbar`; card: brand icon 40px `bg-muted rounded-lg`, tombol `Connected` (bg-blue-50/border-blue-300, dark variant) vs `Connect` (outline); state sort/type/search di URL query params (`filter`, `type`, `sort`).

**Referensi:** `shadcn-admin/src/features/apps/index.tsx`.

- [ ] **Step 1: Data apps** — 16+ apps dengan `name`, `logo` (brand icon name), `desc`, `connected`.
- [ ] **Step 2: Implementasi AppsComponent** — search/type/sort state dari `Router.queryParams` (signal), filter+sort lokal.
- [ ] **Step 3: Route** `/apps`.
- [ ] **Step 4: Verifikasi + commit** (build/lint; cek URL sync).

```bash
git add -A && git commit -m "feat: add apps feature with filters and sorting"
```

---

### Task 22: Chats feature

**Files:**
- Create: `src/app/features/chats/data/chat-types.ts` (interface `ChatUser`, `Convo`)
- Create: `src/app/features/chats/data/convo.json` (salin dari source)
- Create: `src/app/features/chats/chats.component.ts` (+ html)
- Create: `src/app/features/chats/components/new-chat.component.ts`

**Interfaces:**
- `ChatsComponent` — Header + Main fixed; section `flex h-full gap-6`; left panel `w-full sm:w-56 lg:w-72 2xl:w-80` (sticky header: "Inbox" + MessagesSquare, tombol Edit; search input; ScrollArea list chat dengan avatar+fallback initials, last message `You: ...` bila sender You, separator); right panel conversation (header user, tombol Video/Phone/MoreVertical; message group by tanggal `format(ts, 'd MMM, yyyy')`, bubble `max-w-72 px-3 py-2 rounded-[16px_16px_0_16px] bg-primary/90 text-primary-foreground/75` untuk "You", `rounded-[16px_16px_16px_0] bg-muted` untuk lainnya, timestamp `format(ts, 'h:mm a')` italic); empty state "Your messages"; input form bawah (Plus, ImagePlus, Paperclip, Send) — persis class source; mobile: panel bergeser (`absolute inset-0 start-full`, `inset-s-0 flex` saat dipilih).
- `NewChatComponent` — Spartan dialog "New Chat" + list users (avatar + nama + "Message" tombol).

**Referensi:** `shadcn-admin/src/features/chats/index.tsx` + `components/new-chat.tsx` + `data/chat-types.ts` + `convo.json`.

- [ ] **Step 1: Data** — salin `convo.json`; interfaces `ChatUser`/`Convo`.
- [ ] **Step 2: Implementasi ChatsComponent** — gunakan `date-fns` `format`; grouping per tanggal; scroll area.
- [ ] **Step 3: NewChatComponent** — dialog + list.
- [ ] **Step 4: Route** `/chats`.
- [ ] **Step 5: Verifikasi + commit** (build/lint; bandingkan mobile vs desktop).

```bash
git add -A && git commit -m "feat: add chats feature with two-panel layout"
```

---

### Task 23: Auth pages

**Files:**
- Create: `src/app/features/auth/auth-layout.component.ts` (wrapper AuthLayout: container h-svh + logo + "Shadcn Admin")
- Create: `src/app/features/auth/sign-in/sign-in.component.ts` (+ form)
- Create: `src/app/features/auth/sign-in-2/sign-in-2.component.ts`
- Create: `src/app/features/auth/sign-up/sign-up.component.ts`
- Create: `src/app/features/auth/forgot-password/forgot-password.component.ts`
- Create: `src/app/features/auth/otp/otp.component.ts`
- Create: `src/app/features/auth/components/user-auth-form.component.ts`
- Create: `src/app/features/auth/components/forgot-password-form.component.ts`
- Create: `src/app/features/auth/components/sign-up-form.component.ts`
- Create: `src/app/features/auth/components/otp-form.component.ts`
- Create: `src/app/components/password-input/password-input.component.ts`

**Interfaces:**
- `UserAuthFormComponent` — Reactive form (email, password); toggle show/hide password (lucide Eye/EyeOff); submit → `showSubmittedData`.
- `PasswordInputComponent` — input + toggle button (salin `password-input.tsx`).
- `OtpFormComponent` — Spartan `hlm-input-otp` (4 slot) + button "Verify" + resend countdown; submit → toast + navigate.
- `SignIn2Component` — layout split: kiri form (logo + "Sign in to your account" + deskripsi), kanan screenshot `dashboard-light.png`/`dashboard-dark.png` (sesuai theme) dengan gradient overlay (salin `shadcn-admin/src/features/auth/sign-in/sign-in-2.tsx`).
- Routes: `/sign-in`, `/sign-in-2`, `/sign-up`, `/forgot-password`, `/otp` — shell `AuthLayoutComponent` (public, tanpa sidebar). Redirect login success → `/`.

**Referensi:** `shadcn-admin/src/features/auth/**`.

- [ ] **Step 1: AuthLayout + PasswordInput + UserAuthForm.**
- [ ] **Step 2: SignIn page** (Card `max-w-sm gap-4`, CardTitle "Sign in", CardDescription + link "Sign Up", footer "Terms of Service"/"Privacy Policy").
- [ ] **Step 3: SignUp + ForgotPassword + OTP pages** (salin struktur source; gunakan `sign-up-form.tsx`, `forgot-password-form.tsx`, `otp-form.tsx`).
- [ ] **Step 4: SignIn2** — split layout dengan screenshot.
- [ ] **Step 5: Routes + redirect** (`/` redirect saat belum login? Tidak — source mock tidak ada guard; biarkan authenticated pages dapat diakses). Set root redirect `/` → dashboard.
- [ ] **Step 6: Verifikasi + commit** (build/lint; bandingkan visual dengan source).

```bash
git add -A && git commit -m "feat: add auth pages with reactive forms and otp"
```

---

### Task 24: Error pages

**Files:**
- Create: `src/app/features/errors/error-page.component.ts` (dasar: angka besar `text-[7rem] leading-tight font-bold`, judul, deskripsi, tombol Go Back + Back to Home)
- Create: `src/app/features/errors/{unauthorized,forbidden,not-found,internal-server-error,maintenance-error}.component.ts`
- Create: `src/app/features/errors/{401,403,404,500,503}.component.ts`

**Interfaces:**
- Halaman error in-app (dipakai di `/errors/*`): salin `shadcn-admin/src/features/errors/*.tsx` (unauthorized=UserX+401, forbidden=ShieldAlert+403, not-found=FileX+404, internal-server-error=ServerCrash+500, maintenance-error=Construction+503).
- Halaman error standalone (`/401`..`/503`): tanpa shell, `h-svh` (salin `shadcn-admin/src/routes/(errors)/*.tsx`).
- `not-found-error` untuk `**` route (salinan `NotFoundError`).

- [ ] **Step 1: Implementasi error-page base + 5 in-app pages.**
- [ ] **Step 2: Implementasi 5 standalone pages.**
- [ ] **Step 3: Routes** — `/errors/*` (in-app, di shell authenticated), `/401`..`/503` (standalone), `**` → NotFound.
- [ ] **Step 4: Verifikasi + commit.**

```bash
git add -A && git commit -m "feat: add error pages"
```

---

### Task 25: Clerk mock pages + Help Center

**Files:**
- Create: `src/app/features/clerk/sign-in/clerk-sign-in.component.ts`
- Create: `src/app/features/clerk/sign-up/clerk-sign-up.component.ts`
- Create: `src/app/features/clerk/user-management/clerk-user-management.component.ts`
- Create: `src/app/features/help-center/help-center.component.ts`

**Interfaces:**
- Clerk mock pages: salin layout dari `shadcn-admin/src/routes/clerk/**` — halaman sign-in/sign-up memakai `AuthLayoutComponent` (judul "Sign in"/"Sign up", tombol demo, atau konten statis sesuai source). `user-management` memakai authenticated layout (Heading "User Management" + "Manage your organization's team members" + ComingSoon/placeholder sesuai source).
- Help Center: `ComingSoonComponent` (lucide Telescope size 72 + "Coming Soon!" + deskripsi) — salin `coming-soon.tsx`. Route `/help-center`.

**Referensi:** `shadcn-admin/src/routes/clerk/**`, `shadcn-admin/src/components/coming-soon.tsx`.

- [ ] **Step 1: ComingSoonComponent + route `/help-center`.**
- [ ] **Step 2: Clerk mock pages + routes (`/clerk/sign-in`, `/clerk/sign-up`, `/clerk/user-management`).**
- [ ] **Step 3: Finalisasi `app.routes.ts`** — seluruh tree route lengkap (auth shell, authenticated shell, settings shell, errors, clerk, 404).
- [ ] **Step 4: Verifikasi navigasi sidebar** — semua item sidebar menuju route yang valid (klik test manual).
- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add clerk mock pages and help center"
```

---

## Phase 5 — Polish & Verification

### Task 26: Dark mode + responsive audit

**Files:**
- Modify: komponen yang kurang konsisten (sesuai hasil audit)

**Interfaces:**
- —

- [ ] **Step 1: Dark mode audit** — buka semua halaman di theme light & dark; pastikan class `dark` dan `bg-background`/`text-foreground` konsisten (bandingkan dengan source `shadcn-admin`).
- [ ] **Step 2: Responsive audit** — viewport 375px, 768px, 1024px, 1440px: sidebar mobile offcanvas, header, table overflow (`overflow-x-auto`), chats panel bergeser, settings layout stack.
- [ ] **Step 3: Typography/spacing audit** — font-size/weight/spacing samakan dengan source (gunakan DevTools compare).
- [ ] **Step 4: Perbaiki temuan + commit.**

```bash
git add -A && git commit -m "fix: polish dark mode and responsive behavior"
```

---

### Task 27: Unit tests inti + build/lint gates

**Files:**
- Modify: `src/app/**/*.spec.ts` (tambah coverage untuk: storage.service, theme.service, font.service, layout.service, sidebar.service, table-engine, url-table-state, tasks-store, users-store, otp-form, chart-axis.util)

**Interfaces:**
- —

- [ ] **Step 1: Lengkapi unit tests** — pastikan semua service & table engine tercakup (gunakan Vitest + TestBed; mock `window.matchMedia`).

Contoh mock matchMedia di spec:

```ts
function mockMatchMedia(matches: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    }),
  })
}
```

- [ ] **Step 2: Jalankan semua gates**

```bash
ng build
ng lint
ng test --no-watch
npx prettier --check src
```

Semua harus hijau. Jika ada kegagalan, perbaiki.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "test: complete core unit tests and verify build/lint gates"
```

---

### Task 28: Dokumentasi + final validation

**Files:**
- Modify: `README.md` (di `shadcn-admin-angular`)

- [ ] **Step 1: Tulis README** — ringkasan project, tech stack, cara run (`ng serve`), struktur, mapping ke source.
- [ ] **Step 2: Final validation** — jalankan `ng serve`, klik seluruh menu sidebar + auth + error pages; bandingkan visual akhir dengan source `shadcn-admin`.
- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "docs: add readme and final validation"
```

---

## Self-Review (sudah dicek saat penulisan)

- **Spec coverage:** semua bagian spec ter-cover — scaffolding (T1), Tailwind+theme+font (T2), Spartan (T3), utils (T4), theme (T5), font (T6), layout/sidebar (T7), shell+routing (T8), sidebar system (T9), header/main/topnav (T10), config-drawer (T11), command+search+theme-switch+profile (T12), brand icons (T13), charts (T14), data table (T15), date-picker+toast (T16), dashboard (T17), settings (T18), tasks (T19), users (T20), apps (T21), chats (T22), auth (T23), errors (T24), clerk+help (T25), polish (T26), tests (T27), docs (T28).
- **Placeholder scan:** tidak ada TBD/TODO; semua task punya file paths + referensi source + langkah verifikasi.
- **Type consistency:** `TableEngine<T extends { id: string }>`, `Theme`, `Font`, `Collapsible`, `Variant` konsisten di semua task.