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
import * as Uom from '../index.js'

test('1: factor() for single terms', () => {
  expect(Uom.factor('1')).toEqual(1)
  expect(Uom.factor('ft')).toEqual(1)
  expect(Uom.factor('in')).toEqual(12)
  expect(Uom.factor('yd')).toEqual(1 / 3)
  expect(Uom.factor('ch')).toEqual(1 / 66)
  expect(Uom.factor('m')).toEqual(0.3048)

  expect(Uom.baseAmount(6, 'ft')).toEqual(6)
  expect(Uom.baseAmount(2, 'yd')).toEqual(6)
  expect(Uom.baseAmount(6, 'in')).toEqual(0.5)

  expect(Uom.asAmount(6, 'ft')).toEqual(6)
  expect(Uom.asAmount(6, 'yd')).toEqual(2)
  expect(Uom.asAmount(6, 'in')).toEqual(72)

  expect(Uom.convert(6, 'ft', 'ft')).toEqual(6)
  expect(Uom.convert(6, 'ft', 'yd')).toEqual(2)
  expect(Uom.convert(6, 'ft', 'in')).toEqual(72)
  expect(Uom.convert(6, 'in', 'ft')).toEqual(0.5)
  expect(Uom.convert(6, 'yd', 'ft')).toEqual(18)

  expect(Uom.factor('lb')).toEqual(1)
  expect(Uom.factor('ton')).toEqual(1 / 2000)

  expect(Uom.factor('F')).toEqual(1)
  expect(Uom.factor('C')).toEqual(5 / 9)
  expect(Uom.convert(10, 'C', 'F')).toEqual(50)
  expect(Uom.convert(50, 'F', 'C')).toEqual(10)

  expect(Uom.factor('ratio')).toEqual(1)
  expect(Uom.factor('percent')).toEqual(100)
  expect(Uom.factor('%')).toEqual(100)
  expect(Uom.convert(40, 'percent', 'ratio')).toEqual(0.4)
  expect(Uom.convert(40, '%', 'ratio')).toEqual(0.4)
})

test('2: factor() for single terms with powers', () => {
  expect(Uom.factor('ft2')).toEqual(1)
  expect(Uom.factor('in2')).toEqual(144)
  expect(Uom.factor('m2')).toEqual(0.3048 * 0.3048)
  expect(Uom.factor('ac')).toEqual(1 / 43560)
  expect(Uom.factor('ha')).toEqual(1 / 107639)

  expect(Uom.factor('ft3')).toEqual(1)
  expect(Uom.factor('in3')).toEqual(144 * 12)
  expect(Uom.factor('m3')).toEqual(0.3048 * 0.3048 * 0.3048)
})

test('3: factor() for single term numerator / single term denom', () => {
  expect(Uom.factor('ft')).toEqual(1)
  expect(Uom.factor('min')).toEqual(1)
  expect(Uom.factor('ft/min')).toEqual(1)

  expect(Uom.factor('mi')).toEqual(1 / 5280)
  expect(Uom.factor('h')).toEqual(1 / 60)
  expect(Uom.factor('mi/h')).toEqual((1 / 5280) / (1 / 60))
  expect(Uom.factor('mi/h')).toEqual(1 / 88)

  expect(Uom.factor('1/ft')).toEqual(1)
  expect(Uom.factor('1/m')).toEqual(1 / 0.3048)
  expect(Uom.convert(1000, 'ft2/ft3', '1/ft')).toEqual(1000)
  expect(Uom.convert(1000, 'ft2/ft3', '1/m')).toEqual(1000 / 0.3048)
})

test('4: factor() for complex terms', () => {
  expect(Uom.factor('btu')).toEqual(1)
  expect(Uom.factor('ft')).toEqual(1)
  expect(Uom.factor('min')).toEqual(1)
  expect(Uom.factor('btu/ft/min')).toEqual(1)
  expect(Uom.factor('btu/ft-min')).toEqual(1)
  expect(Uom.factor('btu/min-ft')).toEqual(1)
  expect(Uom.factor('btu/ft/s')).toEqual(1 / 60)
  expect(Uom.factor('btu/ft-s')).toEqual(1 / 60)
  expect(Uom.factor('btu/s-ft')).toEqual(1 / 60)
})

test('5: convert() between some benchmark amounts', () => {
  expect(Uom.convert(1, 'lb/ft2', 'ton/ac')).toBeCloseTo(21.78, 6)
  expect(Uom.convert(1, 'lb/ft2', 'kg/m2')).toBeCloseTo(4.88243, 5)

  expect(Uom.convert(1, 'W', 'btu/min')).toBeCloseTo(0.057, 6)

  expect(Uom.convert(1, 'ac', 'ft2')).toBeCloseTo(43560, 6)
  expect(Uom.convert(1, 'ac', 'ha')).toBeCloseTo(0.404686, 6)
  expect(Uom.convert(1, 'ha', 'm2')).toBeCloseTo(10000, 1)

  expect(Uom.convert(100, 'C', 'F')).toBeCloseTo(212, 6)
  expect(Uom.convert(0, 'C', 'F')).toBeCloseTo(32, 6)
  expect(Uom.convert(32, 'F', 'F')).toBeCloseTo(32, 6)
  expect(Uom.convert(32, 'F', 'C')).toBeCloseTo(0, 6)
  expect(Uom.convert(212, 'F', 'C')).toBeCloseTo(100, 6)
  expect(Uom.convert(32, 'F', 'K')).toBeCloseTo(273.15, 6)

  expect(Uom.convert(0, 'C', 'K')).toBeCloseTo(273.15, 6)
  expect(Uom.convert(100, 'C', 'K')).toBeCloseTo(373.15, 6)
  expect(Uom.convert(373.15, 'K', 'C')).toBeCloseTo(100, 6)
  expect(Uom.convert(373.15, 'K', 'F')).toBeCloseTo(212, 6)
})

test('6: factor() exceptions', () => {
  expect(() => Uom.convert(1, 'lb/ft2', 'junk')).toThrow()
  expect(() => Uom.convert(1, 'lb/ft4', 'ton/ac')).toThrow()
  expect(() => Uom.convert(1, '', 'ton/ac')).toThrow()
  expect(() => Uom.convert(1, {}, 'ton/ac')).toThrow()
  expect(() => Uom.convert(1, null, 'ton/ac')).toThrow()
})
