import { Injectable, effect, inject, signal } from '@angular/core'
import { fonts, type Font } from '../../config/fonts'
import { StorageService } from './storage.service'

const FONT_KEY = 'font'

@Injectable({ providedIn: 'root' })
export class FontService {
  readonly defaultFont: Font = 'shantell-sans'
  readonly font = signal<Font>(this.defaultFont)

  private readonly storage = inject(StorageService)

  constructor() {
    const saved = this.storage.get<Font>(FONT_KEY)
    if (saved !== null && fonts.includes(saved)) {
      this.font.set(saved)
    }

    effect(() => {
      this.applyFont(this.font())
    })
  }

  setFont(font: Font): void {
    this.font.set(font)
    this.applyFont(font)
    this.storage.set(FONT_KEY, font)
  }

  resetFont(): void {
    this.font.set(this.defaultFont)
    this.applyFont(this.defaultFont)
    this.storage.remove(FONT_KEY)
  }

  private applyFont(font: Font): void {
    const root = document.documentElement
    root.classList.forEach((cls) => {
      if (cls.startsWith('font-')) root.classList.remove(cls)
    })
    root.classList.add(`font-${font}`)
  }
}
