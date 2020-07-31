import { Slope } from '../index.js'

test('1: new Slope() default constructor', () => {
  const v = new Slope()
  expect(v.defaultValue()).toEqual(0)
  expect(v.displayString(123)).toEqual('123.00 ratio')
  expect(v.displayValue(123)).toEqual('123.00')
  expect(v.uomKeys()).toEqual(['ratio', 'percent', '%', 'deg'])
  expect(v._specs._defaultValue).toEqual(0)
  expect(v._specs._minimumValue).toEqual(0)
})

test('2: Slope conversions', () => {
  const v = new Slope()
  expect(v.baseAsUom(1, 'ratio')).toEqual(1)
  expect(v.baseAsUom(1, 'percent')).toEqual(100)
  expect(v.baseAsUom(1, '%')).toEqual(100)
  expect(v.baseAsUom(1, 'deg')).toEqual(45)

  expect(v.baseFromUom(1, 'ratio')).toEqual(1)
  expect(v.baseFromUom(100, 'percent')).toEqual(1)
  expect(v.baseFromUom(100, '%')).toEqual(1)
  expect(v.baseFromUom(45, 'deg')).toBeCloseTo(1, 9)

  expect(v.convert(1, 'ratio', 'ratio')).toEqual(1)
  expect(v.convert(1, 'ratio', 'percent')).toEqual(100)
  expect(v.convert(1, 'ratio', '%')).toEqual(100)
  expect(v.convert(1, 'ratio', 'deg')).toEqual(45)

  expect(v.convert(100, 'percent', 'percent')).toEqual(100)
  expect(v.convert(100, 'percent', '%')).toEqual(100)
  expect(v.convert(100, 'percent', 'ratio')).toEqual(1)
  expect(v.convert(100, 'percent', 'deg')).toEqual(45)

  expect(v.convert(100, '%', 'percent')).toEqual(100)
  expect(v.convert(100, '%', '%')).toEqual(100)
  expect(v.convert(100, '%', 'ratio')).toEqual(1)
  expect(v.convert(100, '%', 'deg')).toEqual(45)

  expect(v.convert(45, 'deg', 'deg')).toBeCloseTo(45, 9)
  expect(v.convert(45, 'deg', 'ratio')).toBeCloseTo(1, 9)
  expect(v.convert(45, 'deg', 'percent')).toBeCloseTo(100, 9)
  expect(v.convert(45, 'deg', '%')).toBeCloseTo(100, 9)

  expect(v.convert(400, 'deg', 'deg')).toBeCloseTo(40, 9)
  expect(v.convert(-400, 'deg', 'deg')).toBeCloseTo(50, 9)
})
