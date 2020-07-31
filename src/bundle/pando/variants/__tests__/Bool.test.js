import { Bool } from '../index.js'

test('new Bool() default constructor', () => {
  const v = new Bool()
  expect(v.defaultValue()).toEqual(false)
  expect(v._specs._defaultValue).toEqual(false)
  expect(v._specs._trueString).toEqual('true')
  expect(v._specs._falseString).toEqual('false')
  expect(v.displayString(false)).toEqual('false')
  expect(v.displayString(true)).toEqual('true')
})

test('new Bool() custom constructor', () => {
  const v = new Bool(false, 'enabled', 'disabled')
  expect(v.defaultValue()).toEqual(false)
  expect(v._specs._defaultValue).toEqual(false)
  expect(v._specs._trueString).toEqual('enabled')
  expect(v._specs._falseString).toEqual('disabled')
  expect(v.displayString(false)).toEqual('disabled')
  expect(v.displayString(true)).toEqual('enabled')
})

test('new Bool() Errors', () => {
  expect(() => new Bool(1)).toThrow()
  expect(() => new Bool('hello')).toThrow()
  expect(() => new Bool(true, 2, 'aString')).toThrow()
  expect(() => new Bool(false, 'ok', 2)).toThrow()
})

test('Bool validators', () => {
  const v = new Bool()
  expect(v._validator.isBool(1)).toEqual(false)
  expect(v._validator.isBool(0)).toEqual(false)
  expect(v._validator.isBool(null)).toEqual(false)
  expect(v._validator.isBool('aString')).toEqual(false)
  expect(v._validator.isBool(true)).toEqual(true)
  expect(v._validator.isBool(false)).toEqual(true)
  expect(v.isValid(true)).toEqual({ pass: true, value: true, fails: 'none' })
  expect(v.isValid(false)).toEqual({ pass: true, value: false, fails: 'none' })
  expect(v.isValid(5)).toEqual({ pass: false, value: 5, fails: 'isBool' })
  expect(v.isValid('x')).toEqual({
    pass: false,
    value: 'x',
    fails: 'isBool'
  })
})
