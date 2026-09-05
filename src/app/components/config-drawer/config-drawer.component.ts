import { NgComponentOutlet } from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  type Type,
} from '@angular/core'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucideRotateCcw, lucideSettings } from '@ng-icons/lucide'
import { BrnSheetContent } from '@spartan-ng/brain/sheet'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmSheetImports } from '@spartan-ng/helm/sheet'
import {
  IconLayoutCompactComponent,
  IconLayoutDefaultComponent,
  IconLayoutFullComponent,
  IconSidebarFloatingComponent,
  IconSidebarInsetComponent,
  IconSidebarSidebarComponent,
  IconThemeDarkComponent,
  IconThemeLightComponent,
  IconThemeSystemComponent,
} from '../../assets/custom-icons'
import {
  LayoutService,
  type Collapsible,
  type ContentWidth,
  type Variant,
} from '../../core/services/layout.service'
import { SidebarService } from '../../core/services/sidebar.service'
import { ThemeService, type Theme } from '../../core/services/theme.service'

type LayoutMode = 'default' | Collapsible

interface PreviewOption<T> {
  value: T
  label: string
  icon: Type<unknown>
}

/** Tint applied to sidebar/layout preview icons; driven by the item's data-state. */
const PREVIEW_TINT =
  'fill-primary stroke-primary group-data-[state=unchecked]:fill-muted-foreground group-data-[state=unchecked]:stroke-muted-foreground'

/**
 * Theme/layout settings drawer.
 *
 * Mirrors `config-drawer.tsx` from the React source: a Spartan sheet with
 * Theme, Sidebar and Layout radio sections plus a global Reset footer action.
 * (The source's Direction section is out of scope — RTL is not supported.)
 *
 * Radio implementation: native `<button role="radio">` elements carrying
 * `data-state` + the `group` class, so the source's
 * `group-data-[state=checked]` styling works unchanged. The Spartan
 * `hlm-radio` helm was deliberately not used: it renders a circular radio
 * indicator and keeps `data-state` on the inner `brn-radio` element instead
 * of the `group` host, which would break the preview-card selectors.
 *
 * Keyboard support follows the WAI-ARIA radio-group pattern: roving tabindex
 * (only the checked option is tabbable) plus Arrow/Home/End navigation that
 * selects and focuses the target option via the same handlers as clicks.
 */
@Component({
  selector: 'app-config-drawer',
  standalone: true,
  imports: [
    NgComponentOutlet,
    NgIcon,
    HlmButtonImports,
    HlmSheetImports,
    BrnSheetContent,
  ],
  providers: [provideIcons({ lucideRotateCcw, lucideSettings })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <hlm-sheet side="right">
      <button
        hlmBtn
        variant="ghost"
        size="icon"
        class="rounded-full"
        hlmSheetTrigger
        aria-label="Open theme settings"
        type="button"
      >
        <ng-icon name="lucideSettings" aria-hidden="true" />
      </button>
      <ng-template brnSheetContent>
        <hlm-sheet-content class="flex flex-col">
          <div hlmSheetHeader class="pb-0 text-start">
            <h2 hlmSheetTitle>Theme Settings</h2>
            <p hlmSheetDescription>
              Adjust the appearance and layout to suit your preferences.
            </p>
          </div>
          <div class="space-y-6 overflow-y-auto px-4">
            <!-- Theme -->
            <div>
              <div
                class="text-muted-foreground mb-2 flex items-center gap-2 text-sm font-semibold"
              >
                Theme
                @if (themeService.theme() !== themeService.defaultTheme) {
                  <button
                    hlmBtn
                    variant="secondary"
                    size="icon-xs"
                    class="size-4 rounded-full"
                    type="button"
                    aria-label="Reset theme preference to default"
                    (click)="themeService.setTheme(themeService.defaultTheme)"
                  >
                    <ng-icon name="lucideRotateCcw" aria-hidden="true" />
                  </button>
                }
              </div>
              <div
                role="radiogroup"
                aria-label="Select theme preference"
                aria-describedby="theme-description"
                class="grid w-full max-w-md grid-cols-3 gap-4"
              >
                @for (item of themeOptions; track item.value) {
                  <button
                    type="button"
                    role="radio"
                    [attr.aria-checked]="themeService.theme() === item.value"
                    [attr.data-state]="
                      themeService.theme() === item.value
                        ? 'checked'
                        : 'unchecked'
                    "
                    [attr.aria-label]="'Select ' + item.label.toLowerCase()"
                    [attr.aria-describedby]="item.value + '-description'"
                    [attr.data-value]="item.value"
                    [attr.tabindex]="
                      themeService.theme() === item.value ? 0 : -1
                    "
                    class="group transition duration-200 ease-in outline-none"
                    (click)="selectTheme(item.value)"
                    (keydown)="
                      onGroupKeydown(
                        $event,
                        themeOptions,
                        themeService.theme(),
                        selectTheme
                      )
                    "
                  >
                    <div
                      role="img"
                      [attr.aria-label]="item.label + ' option preview'"
                      class="ring-border group-data-[state=checked]:ring-primary relative rounded-[6px] ring-[1px] group-focus-visible:ring-2 group-data-[state=checked]:shadow-2xl"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        aria-hidden="true"
                        class="fill-primary absolute top-0 right-0 size-6 translate-x-1/2 -translate-y-1/2 stroke-white group-data-[state=unchecked]:hidden"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="m9 12 2 2 4-4" />
                      </svg>
                      <ng-container
                        [ngComponentOutlet]="item.icon"
                        [ngComponentOutletInputs]="{ className: '' }"
                      />
                    </div>
                    <div
                      class="mt-1 text-xs"
                      [id]="item.value + '-description'"
                      aria-live="polite"
                    >
                      {{ item.label }}
                    </div>
                  </button>
                }
              </div>
              <div id="theme-description" class="sr-only">
                Choose between system preference, light mode, or dark mode
              </div>
            </div>
            <!-- Sidebar -->
            <div class="max-md:hidden">
              <div
                class="text-muted-foreground mb-2 flex items-center gap-2 text-sm font-semibold"
              >
                Sidebar
                @if (layoutService.variant() !== layoutService.defaultVariant) {
                  <button
                    hlmBtn
                    variant="secondary"
                    size="icon-xs"
                    class="size-4 rounded-full"
                    type="button"
                    aria-label="Reset sidebar style to default"
                    (click)="
                      layoutService.setVariant(layoutService.defaultVariant)
                    "
                  >
                    <ng-icon name="lucideRotateCcw" aria-hidden="true" />
                  </button>
                }
              </div>
              <div
                role="radiogroup"
                aria-label="Select sidebar style"
                aria-describedby="sidebar-description"
                class="grid w-full max-w-md grid-cols-3 gap-4"
              >
                @for (item of sidebarOptions; track item.value) {
                  <button
                    type="button"
                    role="radio"
                    [attr.aria-checked]="layoutService.variant() === item.value"
                    [attr.data-state]="
                      layoutService.variant() === item.value
                        ? 'checked'
                        : 'unchecked'
                    "
                    [attr.aria-label]="'Select ' + item.label.toLowerCase()"
                    [attr.aria-describedby]="item.value + '-description'"
                    [attr.data-value]="item.value"
                    [attr.tabindex]="
                      layoutService.variant() === item.value ? 0 : -1
                    "
                    class="group transition duration-200 ease-in outline-none"
                    (click)="selectVariant(item.value)"
                    (keydown)="
                      onGroupKeydown(
                        $event,
                        sidebarOptions,
                        layoutService.variant(),
                        selectVariant
                      )
                    "
                  >
                    <div
                      role="img"
                      [attr.aria-label]="item.label + ' option preview'"
                      class="ring-border group-data-[state=checked]:ring-primary relative rounded-[6px] ring-[1px] group-focus-visible:ring-2 group-data-[state=checked]:shadow-2xl"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        aria-hidden="true"
                        class="fill-primary absolute top-0 right-0 size-6 translate-x-1/2 -translate-y-1/2 stroke-white group-data-[state=unchecked]:hidden"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="m9 12 2 2 4-4" />
                      </svg>
                      <ng-container
                        [ngComponentOutlet]="item.icon"
                        [ngComponentOutletInputs]="{ className: previewTint }"
                      />
                    </div>
                    <div
                      class="mt-1 text-xs"
                      [id]="item.value + '-description'"
                      aria-live="polite"
                    >
                      {{ item.label }}
                    </div>
                  </button>
                }
              </div>
              <div id="sidebar-description" class="sr-only">
                Choose between inset, floating, or standard sidebar layout
              </div>
            </div>
            <!-- Layout -->
            <div class="max-md:hidden">
              <div
                class="text-muted-foreground mb-2 flex items-center gap-2 text-sm font-semibold"
              >
                Layout
                @if (layoutRadioState() !== 'default') {
                  <button
                    hlmBtn
                    variant="secondary"
                    size="icon-xs"
                    class="size-4 rounded-full"
                    type="button"
                    aria-label="Reset layout options to default"
                    (click)="resetLayoutSection()"
                  >
                    <ng-icon name="lucideRotateCcw" aria-hidden="true" />
                  </button>
                }
              </div>
              <div
                role="radiogroup"
                aria-label="Select layout style"
                aria-describedby="layout-description"
                class="grid w-full max-w-md grid-cols-3 gap-4"
              >
                @for (item of layoutOptions; track item.value) {
                  <button
                    type="button"
                    role="radio"
                    [attr.aria-checked]="layoutRadioState() === item.value"
                    [attr.data-state]="
                      layoutRadioState() === item.value
                        ? 'checked'
                        : 'unchecked'
                    "
                    [attr.aria-label]="'Select ' + item.label.toLowerCase()"
                    [attr.aria-describedby]="item.value + '-description'"
                    [attr.data-value]="item.value"
                    [attr.tabindex]="layoutRadioState() === item.value ? 0 : -1"
                    class="group transition duration-200 ease-in outline-none"
                    (click)="selectLayoutOption(item.value)"
                    (keydown)="
                      onGroupKeydown(
                        $event,
                        layoutOptions,
                        layoutRadioState(),
                        selectLayoutOption
                      )
                    "
                  >
                    <div
                      role="img"
                      [attr.aria-label]="item.label + ' option preview'"
                      class="ring-border group-data-[state=checked]:ring-primary relative rounded-[6px] ring-[1px] group-focus-visible:ring-2 group-data-[state=checked]:shadow-2xl"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        aria-hidden="true"
                        class="fill-primary absolute top-0 right-0 size-6 translate-x-1/2 -translate-y-1/2 stroke-white group-data-[state=unchecked]:hidden"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="m9 12 2 2 4-4" />
                      </svg>
                      <ng-container
                        [ngComponentOutlet]="item.icon"
                        [ngComponentOutletInputs]="{ className: previewTint }"
                      />
                    </div>
                    <div
                      class="mt-1 text-xs"
                      [id]="item.value + '-description'"
                      aria-live="polite"
                    >
                      {{ item.label }}
                    </div>
                  </button>
                }
              </div>
              <div id="layout-description" class="sr-only">
                Choose between default expanded, compact icon-only, or full
                layout mode
              </div>
            </div>
            <!-- Content width (independent from the Layout sidebar mode above) -->
            <div>
              <div
                class="text-muted-foreground mb-2 flex items-center gap-2 text-sm font-semibold"
              >
                Content Width
                @if (
                  layoutService.contentWidth() !==
                  layoutService.defaultContentWidth
                ) {
                  <button
                    hlmBtn
                    variant="secondary"
                    size="icon-xs"
                    class="size-4 rounded-full"
                    type="button"
                    aria-label="Reset content width to default"
                    (click)="
                      layoutService.setContentWidth(
                        layoutService.defaultContentWidth
                      )
                    "
                  >
                    <ng-icon name="lucideRotateCcw" aria-hidden="true" />
                  </button>
                }
              </div>
              <div
                role="radiogroup"
                aria-label="Select content width"
                aria-describedby="content-width-description"
                class="grid w-full max-w-md grid-cols-2 gap-4"
              >
                @for (item of contentWidthOptions; track item.value) {
                  <button
                    type="button"
                    role="radio"
                    [attr.aria-checked]="
                      layoutService.contentWidth() === item.value
                    "
                    [attr.data-state]="
                      layoutService.contentWidth() === item.value
                        ? 'checked'
                        : 'unchecked'
                    "
                    [attr.aria-label]="'Select ' + item.label.toLowerCase()"
                    [attr.aria-describedby]="item.value + '-description'"
                    [attr.data-value]="item.value"
                    [attr.tabindex]="
                      layoutService.contentWidth() === item.value ? 0 : -1
                    "
                    class="group transition duration-200 ease-in outline-none"
                    (click)="selectContentWidth(item.value)"
                    (keydown)="
                      onGroupKeydown(
                        $event,
                        contentWidthOptions,
                        layoutService.contentWidth(),
                        selectContentWidth
                      )
                    "
                  >
                    <div
                      role="img"
                      [attr.aria-label]="item.label + ' option preview'"
                      class="ring-border group-data-[state=checked]:ring-primary relative rounded-[6px] ring-[1px] group-focus-visible:ring-2 group-data-[state=checked]:shadow-2xl"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        aria-hidden="true"
                        class="fill-primary absolute top-0 right-0 size-6 translate-x-1/2 -translate-y-1/2 stroke-white group-data-[state=unchecked]:hidden"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="m9 12 2 2 4-4" />
                      </svg>
                      <div
                        class="bg-muted flex h-16 flex-col justify-center gap-1.5 rounded-[6px] p-2"
                      >
                        <div
                          [class]="
                            'bg-primary/70 group-data-[state=unchecked]:bg-muted-foreground/40 h-2 rounded-sm ' +
                            (item.value === 'full' ? 'w-full' : 'mx-auto w-1/2')
                          "
                        ></div>
                        <div
                          [class]="
                            'bg-primary/40 group-data-[state=unchecked]:bg-muted-foreground/30 h-2 rounded-sm ' +
                            (item.value === 'full' ? 'w-full' : 'mx-auto w-2/3')
                          "
                        ></div>
                        <div
                          [class]="
                            'bg-primary/25 group-data-[state=unchecked]:bg-muted-foreground/20 h-2 rounded-sm ' +
                            (item.value === 'full' ? 'w-full' : 'mx-auto w-1/3')
                          "
                        ></div>
                      </div>
                    </div>
                    <div
                      class="mt-1 text-xs"
                      [id]="item.value + '-description'"
                      aria-live="polite"
                    >
                      {{ item.label }}
                    </div>
                  </button>
                }
              </div>
              <div id="content-width-description" class="sr-only">
                Choose between full-width or compact centered content
              </div>
            </div>
          </div>
          <div hlmSheetFooter>
            <button
              hlmBtn
              variant="destructive"
              type="button"
              aria-label="Reset all settings to default values"
              (click)="handleReset()"
            >
              Reset
            </button>
          </div>
        </hlm-sheet-content>
      </ng-template>
    </hlm-sheet>
  `,
})
export class ConfigDrawerComponent {
  readonly themeService = inject(ThemeService)
  readonly layoutService = inject(LayoutService)
  readonly sidebarService = inject(SidebarService)

  readonly previewTint = PREVIEW_TINT

  readonly themeOptions: PreviewOption<Theme>[] = [
    { value: 'system', label: 'System', icon: IconThemeSystemComponent },
    { value: 'light', label: 'Light', icon: IconThemeLightComponent },
    { value: 'dark', label: 'Dark', icon: IconThemeDarkComponent },
  ]

  readonly sidebarOptions: PreviewOption<Variant>[] = [
    { value: 'inset', label: 'Inset', icon: IconSidebarInsetComponent },
    {
      value: 'floating',
      label: 'Floating',
      icon: IconSidebarFloatingComponent,
    },
    { value: 'sidebar', label: 'Sidebar', icon: IconSidebarSidebarComponent },
  ]

  readonly layoutOptions: PreviewOption<LayoutMode>[] = [
    { value: 'default', label: 'Default', icon: IconLayoutDefaultComponent },
    { value: 'icon', label: 'Compact', icon: IconLayoutCompactComponent },
    { value: 'offcanvas', label: 'Full layout', icon: IconLayoutFullComponent },
  ]

  readonly contentWidthOptions: { value: ContentWidth; label: string }[] = [
    { value: 'full', label: 'Full' },
    { value: 'compact', label: 'Compact' },
  ]

  readonly layoutRadioState = computed<LayoutMode>(() =>
    this.sidebarService.open() ? 'default' : this.layoutService.collapsible()
  )

  /** Bound select callbacks shared by click and keyboard activation. */
  readonly selectTheme = (value: Theme): void => {
    this.themeService.setTheme(value)
  }

  readonly selectVariant = (value: Variant): void => {
    this.layoutService.setVariant(value)
  }

  readonly selectLayoutOption = (value: LayoutMode): void => {
    this.selectLayout(value)
  }

  readonly selectContentWidth = (value: ContentWidth): void => {
    this.layoutService.setContentWidth(value)
  }

  /**
   * WAI-ARIA radio-group keyboard navigation shared by all three groups.
   * Bound to each option button (keydown bubbles from the focused option).
   * Arrow keys move (with wrap-around), Home/End jump; the target option is
   * selected through the same callback as a click and then focused.
   */
  onGroupKeydown<T>(
    event: KeyboardEvent,
    options: { value: T }[],
    current: T,
    select: (value: T) => void
  ): void {
    const target = event.target as HTMLElement | null
    if (target?.getAttribute('role') !== 'radio') return

    const currentIndex = options.findIndex((option) => option.value === current)
    const lastIndex = options.length - 1
    let nextIndex: number

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        nextIndex = currentIndex >= lastIndex ? 0 : currentIndex + 1
        break
      case 'ArrowLeft':
      case 'ArrowUp':
        nextIndex = currentIndex <= 0 ? lastIndex : currentIndex - 1
        break
      case 'Home':
        nextIndex = 0
        break
      case 'End':
        nextIndex = lastIndex
        break
      default:
        return
    }

    event.preventDefault()
    const next = options[nextIndex]
    select(next.value)
    target
      .closest('[role="radiogroup"]')
      ?.querySelector<HTMLElement>(`[data-value="${String(next.value)}"]`)
      ?.focus()
  }

  selectLayout(mode: LayoutMode): void {
    if (mode === 'default') {
      this.sidebarService.setOpen(true)
      return
    }
    this.sidebarService.setOpen(false)
    this.layoutService.setCollapsible(mode)
  }

  resetLayoutSection(): void {
    this.sidebarService.setOpen(this.sidebarService.defaultOpen)
    this.layoutService.setCollapsible(this.layoutService.defaultCollapsible)
  }

  handleReset(): void {
    this.sidebarService.setOpen(this.sidebarService.defaultOpen)
    this.themeService.resetTheme()
    this.layoutService.resetLayout()
  }
}
