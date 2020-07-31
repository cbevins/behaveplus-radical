import { Text } from '../index.js'

test('new Text() default constructor', () => {
  const v = new Text()
  expect(v.defaultValue()).toEqual('')
  expect(v.displayString('Hello, World!')).toEqual('Hello, World!')
  expect(v.displayValue('Hello, World!')).toEqual('Hello, World!')
  expect(v._specs._defaultValue).toEqual('')
  expect(v._specs._minimumLength).toEqual(0)
  expect(v._specs._maximumLength).toEqual(999999)
})

test('new Text() custom constructor', () => {
  const v = new Text('Hello, Collin!', 10, 100)
  expect(v.defaultValue()).toEqual('Hello, Collin!')
  expect(v._specs._defaultValue).toEqual('Hello, Collin!')
  expect(v._specs._minimumLength).toEqual(10)
  expect(v._specs._maximumLength).toEqual(100)
})

test('new Text() Errors', () => {
  expect(() => new Text(1)).toThrow()
  expect(() => new Text('hello', 'aString')).toThrow()
  expect(() => new Text('hello', 2, 'aString')).toThrow()
  expect(() => new Text('hello', 999, 2)).toThrow()
  expect(() => new Text('', 1, 10)).toThrow()
  expect(() => new Text('ajkfkjhkahkhkfhkjf', 1, 10)).toThrow()
})

test('Text validators', () => {
  const v = new Text('hello', 1, 10)
  expect(v._validator.isString(1)).toEqual(false)
  expect(v._validator.isString('aString')).toEqual(true)
  expect(v._validator.minimumLength('')).toEqual(false)
  expect(v._validator.minimumLength('1')).toEqual(true)
  expect(v._validator.minimumLength('01234567890')).toEqual(true)
  expect(v._validator.maximumLength('0123456789')).toEqual(true)
  expect(v._validator.maximumLength('')).toEqual(true)
  expect(v._validator.maximumLength('012345678901')).toEqual(false)

  expect(v.isValid('Hello, ')).toEqual({
    pass: true,
    value: 'Hello, ',
    fails: 'none'
  })
  expect(v.isValid(5)).toEqual({ pass: false, value: 5, fails: 'isString' })
  expect(v.isValid('')).toEqual({
    pass: false,
    value: '',
    fails: 'minimumLength'
  })
  expect(v.isValid('Hello, Collin!')).toEqual({
    pass: false,
    value: 'Hello, Collin!',
    fails: 'maximumLength'
  })
})
