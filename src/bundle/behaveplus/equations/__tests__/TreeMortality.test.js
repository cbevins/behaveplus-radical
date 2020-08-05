import * as DagJest from '../../utils/matchers.js'
import * as TM from '../TreeMortality.js'

const sig = DagJest.sig
const value = DagJest.value
expect.extend({ value, sig })

test('TreeMortality', () => {
  const flameLength = 10
  const lowSeverity = 0.5
  const highSeverity = 1.5
  const dbh = 30
  expect(TM.aspenMortality(lowSeverity, flameLength, dbh)).toEqual(
    1 / (1 + Math.exp(-4.407 + 0.638 * dbh - 2.134 * (flameLength / 1.8)))
  )
  expect(TM.aspenMortality(highSeverity, flameLength, dbh)).toEqual(
    1 / (1 + Math.exp(-2.157 + 0.218 * dbh - 3.6 * (flameLength / 1.8)))
  )

  expect(() => TM.ensureEquationIdx('ABBA', 50)).toThrow()
  expect(() => TM.ensureFofem6Code('Collin')).toThrow()

  expect(TM.fofem6Codes()).toContain('PIPO')
  expect(TM.fofem5Codes()).toContain('PINPON')
  expect(TM.commonNames()).toContain('Ponderosa pine')
  expect(TM.scientificNames()).toContain('Pinus ponderosa')
})
