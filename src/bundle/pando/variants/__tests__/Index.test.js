import { Index } from '../index.js'

test('new Index() default constructor', () => {
  const v = new Index()
  expect(v.defaultValue()).toEqual(0)
  expect(v.displayString(123)).toEqual('123')
  expect(v.displayValue(123)).toEqual('123')
  expect(v._specs._defaultValue).toEqual(0)
  expect(v._specs._minimumValue).toEqual(0)
  expect(v._specs._maximumValue).toEqual(0)
})

test('new Index() custom constructor', () => {
  const v = new Index(6)
  expect(v.defaultValue()).toEqual(0)
  expect(v._specs._defaultValue).toEqual(0)
  expect(v._specs._minimumValue).toEqual(0)
  expect(v._specs._maximumValue).toEqual(5)
})

test('new Index() Errors', () => {
  expect(() => new Index('aString')).toThrow()
  expect(() => new Index(false)).toThrow()
  expect(() => new Index(-1)).toThrow()
  expect(() => new Index(3.14159)).toThrow()
})

test('Index validators', () => {
  const v = new Index(10)
  expect(v._validator.isNumeric(1)).toEqual(true)
  expect(v._validator.isNumeric('aString')).toEqual(false)
  expect(v._validator.minimumValue(0)).toEqual(true)
  expect(v._validator.minimumValue(1)).toEqual(true)
  expect(v._validator.minimumValue(9)).toEqual(true)
  expect(v._validator.minimumValue(10)).toEqual(true)
  expect(v._validator.minimumValue(11)).toEqual(true)
  expect(v._validator.minimumValue(-1)).toEqual(false)
  expect(v._validator.maximumValue(-1)).toEqual(true)
  expect(v._validator.maximumValue(0)).toEqual(true)
  expect(v._validator.maximumValue(1)).toEqual(true)
  expect(v._validator.maximumValue(9)).toEqual(true)
  expect(v._validator.maximumValue(10)).toEqual(false)

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
  expect(v.isValid(10)).toEqual({
    pass: false,
    value: 10,
    fails: 'maximumValue'
  })
})
