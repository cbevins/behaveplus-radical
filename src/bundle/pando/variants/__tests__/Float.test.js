import { Float } from '../index.js'

test('1: new Float() default constructor', () => {
  const v = new Float()
  expect(v.defaultValue()).toEqual(0)
  expect(v.displayString(123)).toEqual('123.00')
  expect(v.displayValue(123)).toEqual('123.00')
  expect(v._specs._defaultValue).toEqual(0)
  expect(v._specs._minimumValue).toEqual(1 - Number.MAX_VALUE)
  expect(v._specs._maximumValue).toEqual(Number.MAX_VALUE)
})

test('2: new Float() custom constructor', () => {
  const v = new Float(1, -10, 3)
  expect(v.defaultValue()).toEqual(1)
  expect(v._specs._defaultValue).toEqual(1)
  expect(v._specs._minimumValue).toEqual(-10)
  expect(v._specs._maximumValue).toEqual(3)
})

test('3: new Float() Errors', () => {
  expect(() => new Float('aString')).toThrow()
  expect(() => new Float(1, 'aString')).toThrow()
  expect(() => new Float(1, 2, 'aString')).toThrow()
  expect(() => new Float(1, 999, 2)).toThrow()
  expect(() => new Float(0, 1, 10)).toThrow()
  expect(() => new Float(100, 1, 10)).toThrow()
})

test('4: Float validators', () => {
  const v = new Float(1, 1, 10)
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

test('5: Float displayValue() fixed', () => {
  const v = new Float()
  expect(v.displayValue(123.45678)).toEqual('123.46')
  v.setDisplayFixed(3)
  expect(v.displayValue(123.45678)).toEqual('123.457')
  expect(v.displayValue(123.4561)).toEqual('123.456')
  v.setDisplayFixed(0)
  expect(v.displayValue(123.45678)).toEqual('123')
})

test('6: Float displayValue() precision', () => {
  const v = new Float()
  v.setDisplayPrecision(1)
  expect(v.displayValue(123.45678)).toEqual('1e+2')
  v.setDisplayPrecision(2)
  expect(v.displayValue(123.45678)).toEqual('1.2e+2')
  v.setDisplayPrecision(3)
  expect(v.displayValue(123.45678)).toEqual('123')
  v.setDisplayPrecision(4)
  expect(v.displayValue(123.45678)).toEqual('123.5')
  v.setDisplayPrecision(5)
  expect(v.displayValue(123.45678)).toEqual('123.46')
  v.setDisplayPrecision(6)
  expect(v.displayValue(123.45678)).toEqual('123.457')
  v.setDisplayPrecision(7)
  expect(v.displayValue(123.45678)).toEqual('123.4568')
  v.setDisplayPrecision(8)
  expect(v.displayValue(123.45678)).toEqual('123.45678')
  v.setDisplayPrecision(9)
  expect(v.displayValue(123.45678)).toEqual('123.456780')
})

test('7: Float displayValue() exponential', () => {
  const v = new Float()
  v.setDisplayExponential(9)
  expect(v.displayValue(123.45678)).toEqual('1.234567800e+2')
  expect(v.displayValue(123.4561)).toEqual('1.234561000e+2')
  v.setDisplayExponential(0)
  expect(v.displayValue(123.45678)).toEqual('1e+2')
  v.setDisplayExponential(1)
  expect(v.displayValue(123.45678)).toEqual('1.2e+2')
  v.setDisplayExponential(2)
  expect(v.displayValue(123.45678)).toEqual('1.23e+2')
  v.setDisplayExponential(3)
  expect(v.displayValue(123.45678)).toEqual('1.235e+2')
  v.setDisplayExponential(4)
  expect(v.displayValue(123.45678)).toEqual('1.2346e+2')
  v.setDisplayExponential(5)
  expect(v.displayValue(123.45678)).toEqual('1.23457e+2')
  v.setDisplayExponential(6)
  expect(v.displayValue(123.45678)).toEqual('1.234568e+2')
})
