import { Option } from '../index.js'

const options = ['a', 'b', 'c']

test('new Option() errors', () => {
  expect(() => new Option()).toThrow()
  expect(() => new Option(options, -1)).toThrow()
  expect(() => new Option(options, 9)).toThrow()
  const v = new Option(options)
  expect(() => v.ensure('a')).not.toThrow()
  expect(() => v.ensure('junk')).toThrow()
  expect(() => v.displayString('junk')).toThrow()
})

test('new Option() constructor', () => {
  const v = new Option(options)
  expect(v.defaultValue()).toEqual('a')
  expect(v.displayString('a')).toEqual('a')
  expect(v.options()).toEqual(options)
  expect(v.ensure('a')).toEqual(true)
  expect(v.has('a')).toEqual(true)
  expect(v.has('junk')).toEqual(false)
})

test('Option validators', () => {
  const v = new Option(options, 1)
  expect(v.defaultValue()).toEqual('b')
  expect(v.displayString('b')).toEqual('b')
  expect(v.options()).toEqual(options)
  expect(v._validator.isString(1)).toEqual(false)
  expect(v._validator.isString('aString')).toEqual(true)
  expect(v._validator.isMember('a')).toEqual(true)
  expect(v._validator.isMember('z')).toEqual(false)

  expect(v.isValid(1)).toEqual({ pass: false, value: 1, fails: 'isString' })
  expect(v.isValid('a')).toEqual({ pass: true, value: 'a', fails: 'none' })
  expect(v.isValid('z')).toEqual({ pass: false, value: 'z', fails: 'isMember' })
})
