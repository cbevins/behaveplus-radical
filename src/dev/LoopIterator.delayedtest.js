import { LoopIterator } from './LoopIterator.js'

test.skip('LoopIterator requires babel, jest regeneratorRuntime', () => {
  const a = [...new LoopIterator(1, 10, 1)]
  expect(a).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  const b = [...new LoopIterator(10, -2, 2)]
  expect(b).toEqual([10, 8, 6, 4, 2, 0, -2])
})
