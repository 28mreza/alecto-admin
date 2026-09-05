import { sleep } from './sleep'

describe('sleep', () => {
  it('resolves with undefined', async () => {
    await expect(sleep(0)).resolves.toBeUndefined()
  })

  it('waits at least the requested duration', async () => {
    const start = Date.now()
    await sleep(50)
    expect(Date.now() - start).toBeGreaterThanOrEqual(40)
  })

  it('can be awaited in sequence', async () => {
    const order: number[] = []
    await sleep(10).then(() => order.push(1))
    await sleep(10).then(() => order.push(2))
    expect(order).toEqual([1, 2])
  })
})
