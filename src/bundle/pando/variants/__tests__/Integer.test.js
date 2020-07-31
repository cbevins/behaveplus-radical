import { Integer } from '../index.js'

test('new Integer() default constructor', () => {
  const v = new Integer()
  expect(v.defaultValue()).toEqual(0)
  expect(v.displayString(123)).toEqual('123')
  expect(v.displayValue(123)).toEqual('123')
  expect(v._specs._defaultValue).toEqual(0)
  expect(v._specs._minimumValue).toEqual(1 - Number.MAX_VALUE)
  expect(v._specs._maximumValue).toEqual(Number.MAX_VALUE)
})

test('new Integer() custom constructor', () => {
  const v = new Integer(1, -10, 3)
  expect(v.defaultValue()).toEqual(1)
  expect(v._specs._defaultValue).toEqual(1)
  expect(v._specs._minimumValue).toEqual(-10)
  expect(v._specs._maximumValue).toEqual(3)
})

test('new Integer() Errors', () => {
  expect(() => new Integer('aString')).toThrow()
  expect(() => new Integer(1, 'aString')).toThrow()
  expect(() => new Integer(1, 2, 'aString')).toThrow()
  expect(() => new Integer(1, 999, 2)).toThrow()
  expect(() => new Integer(0, 1, 10)).toThrow()
  expect(() => new Integer(100, 1, 10)).toThrow()
  expect(() => new Integer(1.0)).not.toThrow()
  expect(() => new Integer(1.1)).toThrow()
  expect(() => new Integer(1.0, 0.0)).not.toThrow()
  expect(() => new Integer(1.0, 0.1)).toThrow()
  expect(() => new Integer(1.0, 0.0, 10.0)).not.toThrow()
  expect(() => new Integer(1, 0, 10.1)).toThrow()
})

test('Integer validators', () => {
  const v = new Integer(1, 1, 10)
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
