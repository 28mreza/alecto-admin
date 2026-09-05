import { TestBed } from '@angular/core/testing'
import { describe, expect, it } from 'vitest'
import { BarChartComponent } from './bar-chart.component'

const sampleData = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 5000 },
]

async function setup(data: { name: string; value: number }[]) {
  TestBed.resetTestingModule()
  await TestBed.configureTestingModule({
    imports: [BarChartComponent],
  }).compileComponents()
  const fixture = TestBed.createComponent(BarChartComponent)
  fixture.componentRef.setInput('data', data)
  fixture.detectChanges()
  await fixture.whenStable()
  TestBed.resetTestingModule()
  return fixture.nativeElement as HTMLElement
}

describe('BarChartComponent', () => {
  it('renders a responsive svg with one bar per datum', async () => {
    const element = await setup(sampleData)
    const svg = element.querySelector('svg')
    expect(svg).not.toBeNull()
    expect(svg?.getAttribute('width')).toBe('100%')
    expect(svg?.getAttribute('height')).toBe('350')
    expect(element.querySelectorAll('[data-bar]')).toHaveLength(
      sampleData.length
    )
  })

  it('renders x labels and $-prefixed y ticks with source styling', async () => {
    const element = await setup(sampleData)
    const xLabels = [...element.querySelectorAll('[data-x-label]')].map(
      (node) => node.textContent?.trim()
    )
    expect(xLabels).toEqual(['Jan', 'Feb', 'Mar'])
    const yLabels = [...element.querySelectorAll('[data-y-label]')]
    expect(yLabels.length).toBeGreaterThan(0)
    for (const label of yLabels) {
      expect(label.textContent?.trim().startsWith('$')).toBe(true)
      expect(label.getAttribute('fill')).toBe('#888888')
      expect(label.getAttribute('font-size')).toBe('12')
    }
  })

  it('fills bars with currentColor and rounds the top corners', async () => {
    const element = await setup(sampleData)
    const bars = [...element.querySelectorAll('[data-bar]')]
    for (const bar of bars) {
      expect(bar.getAttribute('fill')).toBe('currentColor')
      expect(bar.getAttribute('d')).toContain('Q')
    }
  })

  it('renders axes with zero ticks and no crash for empty data', async () => {
    const element = await setup([])
    expect(element.querySelector('svg')).not.toBeNull()
    expect(element.querySelectorAll('[data-bar]')).toHaveLength(0)
  })
})
