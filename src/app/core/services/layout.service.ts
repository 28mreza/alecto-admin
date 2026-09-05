import { Injectable, inject, signal } from '@angular/core'
import { StorageService } from './storage.service'

export type Collapsible = 'offcanvas' | 'icon' | 'none'
export type Variant = 'inset' | 'sidebar' | 'floating'
export type ContentWidth = 'full' | 'compact'

const DEFAULT_COLLAPSIBLE: Collapsible = 'icon'
const DEFAULT_VARIANT: Variant = 'floating'
const DEFAULT_CONTENT_WIDTH: ContentWidth = 'full'
const KEY_COLLAPSIBLE = 'layout-collapsible'
const KEY_VARIANT = 'layout-variant'
const KEY_CONTENT_WIDTH = 'layout-content-width'

@Injectable({ providedIn: 'root' })
export class LayoutService {
  readonly defaultCollapsible = DEFAULT_COLLAPSIBLE
  readonly defaultVariant = DEFAULT_VARIANT
  readonly defaultContentWidth = DEFAULT_CONTENT_WIDTH

  readonly collapsible = signal<Collapsible>(DEFAULT_COLLAPSIBLE)
  readonly variant = signal<Variant>(DEFAULT_VARIANT)
  readonly contentWidth = signal<ContentWidth>(DEFAULT_CONTENT_WIDTH)

  private readonly storage = inject(StorageService)

  constructor() {
    const savedCollapsible = this.storage.get<Collapsible>(KEY_COLLAPSIBLE)
    if (
      savedCollapsible === 'offcanvas' ||
      savedCollapsible === 'icon' ||
      savedCollapsible === 'none'
    ) {
      this.collapsible.set(savedCollapsible)
    }
    const savedVariant = this.storage.get<Variant>(KEY_VARIANT)
    if (
      savedVariant === 'inset' ||
      savedVariant === 'sidebar' ||
      savedVariant === 'floating'
    ) {
      this.variant.set(savedVariant)
    }
    const savedContentWidth = this.storage.get<ContentWidth>(KEY_CONTENT_WIDTH)
    if (savedContentWidth === 'full' || savedContentWidth === 'compact') {
      this.contentWidth.set(savedContentWidth)
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

  setContentWidth(contentWidth: ContentWidth): void {
    this.contentWidth.set(contentWidth)
    this.storage.set(KEY_CONTENT_WIDTH, contentWidth)
  }

  resetLayout(): void {
    this.collapsible.set(DEFAULT_COLLAPSIBLE)
    this.variant.set(DEFAULT_VARIANT)
    this.contentWidth.set(DEFAULT_CONTENT_WIDTH)
    this.storage.remove(KEY_COLLAPSIBLE)
    this.storage.remove(KEY_VARIANT)
    this.storage.remove(KEY_CONTENT_WIDTH)
  }
}
