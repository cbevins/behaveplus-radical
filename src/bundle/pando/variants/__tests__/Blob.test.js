import { Blob } from '../index.js'

const obj = { say: 'Hello', to: 'World!' }
const json = JSON.stringify(obj)

test('new Blob() default constructor', () => {
  const v = new Blob()
  expect(v.defaultValue()).toEqual({})
  expect(v.displayString(obj)).toEqual(json)
  expect(v._specs._defaultValue).toEqual({})
})

test('new Blob() custom constructor', () => {
  const v = new Blob(obj)
  expect(v.defaultValue()).toEqual(obj)
  expect(v._specs._defaultValue).toEqual(obj)
  expect(v.displayString(v.defaultValue())).toEqual(json)
})

test('new Blob() Errors', () => {
  expect(() => new Blob(1)).toThrow()
  expect(() => new Blob('aString')).toThrow()
  expect(() => new Blob(true)).toThrow()
})
