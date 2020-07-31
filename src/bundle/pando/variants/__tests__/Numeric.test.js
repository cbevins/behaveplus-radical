import { Numeric } from '../index.js'

test('new Numeric() default constructor', () => {
  const v = new Numeric()
  expect(v.defaultValue()).toEqual(0)
  expect(v.displayString(123)).toEqual('123')
  expect(v.displayValue(123)).toEqual('123')
  expect(v._specs._defaultValue).toEqual(0)
  expect(v._specs._minimumValue).toEqual(1 - Number.MAX_VALUE)
  expect(v._specs._maximumValue).toEqual(Number.MAX_VALUE)
})

test('new Numeric() custom constructor', () => {
  const v = new Numeric(1, -10, 3)
  expect(v.defaultValue()).toEqual(1)
  expect(v._specs._defaultValue).toEqual(1)
  expect(v._specs._minimumValue).toEqual(-10)
  expect(v._specs._maximumValue).toEqual(3)
})

test('new Numeric() Errors', () => {
  expect(() => new Numeric('aString')).toThrow()
  expect(() => new Numeric(1, 'aString')).toThrow()
  expect(() => new Numeric(1, 2, 'aString')).toThrow()
  expect(() => new Numeric(1, 999, 2)).toThrow()
  expect(() => new Numeric(0, 1, 10)).toThrow()
  expect(() => new Numeric(100, 1, 10)).toThrow()
})

test('Numeric validators', () => {
  const v = new Numeric(1, 1, 10)
  expect(v._validator.isNumeric(1)).toEqual(true)
  expect(v._validator.isNumeric('aString')).toEqual(false)
  expect(v._validator.minimumValue(0)).toEqual(false)
  expect(v._validator.minimumValue(1)).toEqual(true)
  expect(v._validator.minimumValue(11)).toEqual(true)
  expect(v._validator.maximumValue(0)).toEqual(true)
  expect(v._validator.maximumValue(1)).toEqual(true)
  expect(v._validator.maximumValue(11)).toEqual(false)

  expect(v.isValid(5)).toEqual({ pass: true, value: 5, fails: 'none' })
  expect(v.isValid('x')).toEqual({
    pass: false,
    value: 'x',
    fails: 'isNumeric'
  })
  expect(v.isValid(0)).toEqual({ pass: false, value: 0, fails: 'minimumValue' })
  expect(v.isValid(20)).toEqual({
    pass: false,
    value: 20,
    fails: 'maximumValue'
  })
})
