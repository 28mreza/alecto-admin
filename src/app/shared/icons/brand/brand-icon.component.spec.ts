import { TestBed } from '@angular/core/testing'
import { describe, expect, it } from 'vitest'
import { BrandIconComponent, type BrandIconName } from './brand-icon.component'

const names: BrandIconName[] = [
  'discord',
  'docker',
  'facebook',
  'figma',
  'github',
  'gitlab',
  'gmail',
  'medium',
  'notion',
  'skype',
  'slack',
  'stripe',
  'telegram',
  'trello',
  'whatsapp',
  'zoom',
]

describe('BrandIconComponent', () => {
  it('renders an svg for each of the 16 brand names', async () => {
    expect(names).toHaveLength(16)
    for (const name of names) {
      TestBed.resetTestingModule()
      await TestBed.configureTestingModule({
        imports: [BrandIconComponent],
      }).compileComponents()
      const fixture = TestBed.createComponent(BrandIconComponent)
      fixture.componentRef.setInput('name', name)
      fixture.detectChanges()
      await fixture.whenStable()
      const svg = fixture.nativeElement.querySelector('svg')
      expect(svg, `expected <svg> for brand "${name}"`).toBeTruthy()
    }
    TestBed.resetTestingModule()
  })

  it('preserves the static stroke class when className is passed', async () => {
    await TestBed.configureTestingModule({
      imports: [BrandIconComponent],
    }).compileComponents()
    const fixture = TestBed.createComponent(BrandIconComponent)
    fixture.componentRef.setInput('name', 'github')
    fixture.componentRef.setInput('className', 'size-4')
    fixture.detectChanges()
    await fixture.whenStable()
    const svg = fixture.nativeElement.querySelector('svg') as SVGElement | null
    expect(svg).toBeTruthy()
    expect(svg!.getAttribute('class')).toContain('[&>path]:stroke-current')
    expect(svg!.getAttribute('class')).toContain('size-4')
    TestBed.resetTestingModule()
  })
})
