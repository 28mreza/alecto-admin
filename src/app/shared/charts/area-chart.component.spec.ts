import { TestBed } from '@angular/core/testing'
import { describe, expect, it } from 'vitest'
import { AreaChartComponent } from './area-chart.component'

const sampleData = [
  { name: 'Mon', clicks: 400, uniques: 240 },
  { name: 'Tue', clicks: 300, uniques: 200 },
  { name: 'Wed', clicks: 500, uniques: 280 },
]

async function setup(
  data: { name: string; clicks: number; uniques: number }[]
) {
  TestBed.resetTestingModule()
  await TestBed.configureTestingModule({
    imports: [AreaChartComponent],
  }).compileComponents()
  const fixture = TestBed.createComponent(AreaChartComponent)
  fixture.componentRef.setInput('data', data)
  fixture.detectChanges()
  await fixture.whenStable()
  TestBed.resetTestingModule()
  return fixture.nativeElement as HTMLElement
}

describe('AreaChartComponent', () => {
  it('renders a responsive svg with two area series and two lines', async () => {
    const element = await setup(sampleData)
    const svg = element.querySelector('svg')
    expect(svg).not.toBeNull()
    expect(svg?.getAttribute('width')).toBe('100%')
    expect(svg?.getAttribute('height')).toBe('300')
    expect(element.querySelectorAll('[data-series-area]')).toHaveLength(2)
    expect(element.querySelectorAll('[data-series-line]')).toHaveLength(2)
  })

  it('applies source fill opacities and theme classes per series', async () => {
    const element = await setup(sampleData)
    const clicksArea = element.querySelector('[data-series-area="clicks"]')
    const uniquesArea = element.querySelector('[data-series-area="uniques"]')
    expect(clicksArea?.getAttribute('fill-opacity')).toBe('0.15')
    expect(clicksArea?.getAttribute('class')).toContain('text-primary')
    expect(uniquesArea?.getAttribute('fill-opacity')).toBe('0.1')
    expect(uniquesArea?.getAttribute('class')).toContain(
      'text-muted-foreground'
    )
  })

  it('renders smoothed lines with x labels and y ticks', async () => {
    const element = await setup(sampleData)
    const clicksLine = element.querySelector('[data-series-line="clicks"]')
    expect(clicksLine?.getAttribute('d')).toContain('C')
    const xLabels = [...element.querySelectorAll('[data-x-label]')].map(
      (node) => node.textContent?.trim()
    )
    expect(xLabels).toEqual(['Mon', 'Tue', 'Wed'])
    expect(element.querySelectorAll('[data-y-label]').length).toBeGreaterThan(0)
  })

  it('renders without crashing for empty data', async () => {
    const element = await setup([])
    expect(element.querySelector('svg')).not.toBeNull()
    expect(element.querySelector('[data-series-line="clicks"]')).not.toBeNull()
  })
})
