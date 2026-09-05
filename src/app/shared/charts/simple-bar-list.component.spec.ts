import { TestBed } from '@angular/core/testing'
import { describe, expect, it } from 'vitest'
import { SimpleBarListComponent } from './simple-bar-list.component'

const sampleItems = [
  { name: 'Direct', value: 512 },
  { name: 'Product Hunt', value: 256 },
  { name: 'Blog', value: 0 },
]

async function setup(options?: {
  barClass?: string
  valueFormatter?: (value: number) => string
}) {
  TestBed.resetTestingModule()
  await TestBed.configureTestingModule({
    imports: [SimpleBarListComponent],
  }).compileComponents()
  const fixture = TestBed.createComponent(SimpleBarListComponent)
  fixture.componentRef.setInput('items', sampleItems)
  if (options?.barClass !== undefined) {
    fixture.componentRef.setInput('barClass', options.barClass)
  }
  if (options?.valueFormatter !== undefined) {
    fixture.componentRef.setInput('valueFormatter', options.valueFormatter)
  }
  fixture.detectChanges()
  await fixture.whenStable()
  TestBed.resetTestingModule()
  return fixture.nativeElement as HTMLElement
}

describe('SimpleBarListComponent', () => {
  it('renders one row per item with source markup classes', async () => {
    const element = await setup()
    const rows = element.querySelectorAll('ul.space-y-3 > li')
    expect(rows).toHaveLength(sampleItems.length)
    expect(element.querySelector('li')?.getAttribute('class')).toContain('flex')
    expect(
      element.querySelector('.bg-muted > div')?.getAttribute('class')
    ).toContain('bg-primary')
  })

  it('scales bar widths relative to the max value', async () => {
    const element = await setup()
    const bars = [...element.querySelectorAll('.bg-muted > div')]
    expect((bars[0] as HTMLElement).style.width).toBe('100%')
    expect((bars[1] as HTMLElement).style.width).toBe('50%')
    expect((bars[2] as HTMLElement).style.width).toBe('0%')
  })

  it('applies a custom bar class and value formatter', async () => {
    const element = await setup({
      barClass: 'bg-muted-foreground',
      valueFormatter: (value: number) => `${value}%`,
    })
    expect(
      element.querySelector('.bg-muted > div')?.getAttribute('class')
    ).toContain('bg-muted-foreground')
    expect(element.textContent).toContain('512%')
  })
})
