import { Count } from '../index.js'

test('new Count() default constructor', () => {
  const v = new Count()
  expect(v.defaultValue()).toEqual(0)
  expect(v.displayString(123)).toEqual('123')
  expect(v.displayValue(123)).toEqual('123')
  expect(v._specs._defaultValue).toEqual(0)
  expect(v._specs._minimumValue).toEqual(0)
  expect(v._specs._maximumValue).toEqual(Number.MAX_VALUE)
})

test('new Count() custom constructor', () => {
  const v = new Count(1, 3)
  expect(v.defaultValue()).toEqual(1)
  expect(v._specs._defaultValue).toEqual(1)
  expect(v._specs._minimumValue).toEqual(0)
  expect(v._specs._maximumValue).toEqual(3)
})

test('new Count() Errors', () => {
  expect(() => new Count('aString')).toThrow()
  expect(() => new Count(1, 'aString')).toThrow()
  expect(() => new Count(1, -1)).toThrow()
  expect(() => new Count(-1)).toThrow()
  expect(() => new Count(100, 1)).toThrow()
  expect(() => new Count(1.1)).toThrow()
  expect(() => new Count(1, 10.1)).toThrow()
  expect(() => new Count(1.0, 10.0)).not.toThrow()
})

test('Count validators', () => {
  const v = new Count(1, 10)
  expect(v._validator.isNumeric(1)).toEqual(true)
  expect(v._validator.isNumeric('aString')).toEqual(false)
  expect(v._validator.minimumValue(0)).toEqual(true)
  expect(v._validator.minimumValue(1)).toEqual(true)
  expect(v._validator.minimumValue(10)).toEqual(true)
  expect(v._validator.minimumValue(11)).toEqual(true)
  expect(v._validator.minimumValue(-1)).toEqual(false)
  expect(v._validator.maximumValue(-1)).toEqual(true)
  expect(v._validator.maximumValue(0)).toEqual(true)
  expect(v._validator.maximumValue(1)).toEqual(true)
  expect(v._validator.maximumValue(10)).toEqual(true)
  expect(v._validator.maximumValue(11)).toEqual(false)

  expect(v.isValid(5)).toEqual({ pass: true, value: 5, fails: 'none' })
  expect(v.isValid('x')).toEqual({
    pass: false,
    value: 'x',
    fails: 'isNumeric'
  })
  expect(v.isValid(-1)).toEqual({
    pass: false,
    value: -1,
    fails: 'minimumValue'
  })
  expect(v.isValid(20)).toEqual({
    pass: false,
    value: 20,
    fails: 'maximumValue'
  })
})
