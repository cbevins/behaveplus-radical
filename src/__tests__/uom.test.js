/**
 * Must be able to parse the following UoM synatx
 * - 'ft' (simple one-dim measure, simple single term)
 * - 'ft2'  (multi-dim measure, simple single term)
 * - 'ft3' (multi-dim measure, simple single term)
 * - 'ft/min' (simple one-dim numerator with simple on-dim denom)
 * - 'ft2/ft3' (simple multi-dim numerator with simple multi-dim denom)
 * - '1/ft'  (reduced simple multi-dim numerator with simple multi-dim denom)
 * - 'lb/ft2'
 * - 't/ha' (multi-dim measure with an alias)
 * - 'lb/ft3'
 * - 'btu/ft/s'
 * - 'btu/ft-s',
 */
import { asAmount, baseAmount, convert, factor } from '../uom/uom.js'

test('1: factor() for single terms', () => {
  expect(factor('1')).toEqual(1)
  expect(factor('ft')).toEqual(1)
  expect(factor('in')).toEqual(12)
  expect(factor('yd')).toEqual(1 / 3)
  expect(factor('ch')).toEqual(1 / 66)
  expect(factor('m')).toEqual(0.3048)

  expect(baseAmount(6, 'ft')).toEqual(6)
  expect(baseAmount(2, 'yd')).toEqual(6)
  expect(baseAmount(6, 'in')).toEqual(0.5)

  expect(asAmount(6, 'ft')).toEqual(6)
  expect(asAmount(6, 'yd')).toEqual(2)
  expect(asAmount(6, 'in')).toEqual(72)

  expect(convert(6, 'ft', 'ft')).toEqual(6)
  expect(convert(6, 'ft', 'yd')).toEqual(2)
  expect(convert(6, 'ft', 'in')).toEqual(72)
  expect(convert(6, 'in', 'ft')).toEqual(0.5)
  expect(convert(6, 'yd', 'ft')).toEqual(18)

  expect(factor('lb')).toEqual(1)
  expect(factor('ton')).toEqual(1 / 2000)

  expect(factor('F')).toEqual(1)
  expect(factor('C')).toEqual(5 / 9)
  expect(convert(10, 'C', 'F')).toEqual(50)
  expect(convert(50, 'F', 'C')).toEqual(10)

  expect(factor('ratio')).toEqual(1)
  expect(factor('percent')).toEqual(100)
  expect(factor('%')).toEqual(100)
  expect(convert(40, 'percent', 'ratio')).toEqual(0.4)
  expect(convert(40, '%', 'ratio')).toEqual(0.4)
})

test('2: factor() for single terms with powers', () => {
  expect(factor('ft2')).toEqual(1)
  expect(factor('in2')).toEqual(144)
  expect(factor('m2')).toEqual(0.3048 * 0.3048)
  expect(factor('ac')).toEqual(1 / 43560)
  expect(factor('ha')).toEqual(1 / 107639)

  expect(factor('ft3')).toEqual(1)
  expect(factor('in3')).toEqual(144 * 12)
  expect(factor('m3')).toEqual(0.3048 * 0.3048 * 0.3048)
})

test('3: factor() for single term numerator / single term denom', () => {
  expect(factor('ft')).toEqual(1)
  expect(factor('min')).toEqual(1)
  expect(factor('ft/min')).toEqual(1)

  expect(factor('mi')).toEqual(1 / 5280)
  expect(factor('h')).toEqual(1 / 60)
  expect(factor('mi/h')).toEqual((1 / 5280) / (1 / 60))
  expect(factor('mi/h')).toEqual(1 / 88)

  expect(factor('1/ft')).toEqual(1)
  expect(factor('1/m')).toEqual(1 / 0.3048)
  expect(convert(1000, 'ft2/ft3', '1/ft')).toEqual(1000)
  expect(convert(1000, 'ft2/ft3', '1/m')).toEqual(1000 / 0.3048)
})

test('3: factor() for complex terms', () => {
  expect(factor('btu')).toEqual(1)
  expect(factor('ft')).toEqual(1)
  expect(factor('min')).toEqual(1)
  expect(factor('btu/ft/min')).toEqual(1)
  expect(factor('btu/ft-min')).toEqual(1)
  expect(factor('btu/min-ft')).toEqual(1)
  expect(factor('btu/ft/s')).toEqual(1 / 60)
  expect(factor('btu/ft-s')).toEqual(1 / 60)
  expect(factor('btu/s-ft')).toEqual(1 / 60)
})
