/* eslint-disable no-undef, no-unused-vars, no-prototype-builtins */
import { Dag } from '../Dag.js'
import * as Dna from '../../../behaveplus/BpxDna.js'
import * as DagJest from '../../../../utils/matchers.js'
import { configMinimalInput } from './testData.js'

const value = DagJest.value
expect.extend({ value })

const dag = new Dag(Dna)

dag.runConfigs(configMinimalInput)
const ros = dag.get('surface.primary.fuel.fire.spreadRate')
const catalogKey = dag.get('surface.primary.fuel.model.catalogKey')
const deadMoisture = dag.get('site.moisture.dead.category')
const liveMoisture = dag.get('site.moisture.live.category')
const slopeRatio = dag.get('site.slope.steepness.ratio')
const midflameWind = dag.get('site.wind.speed.atMidflame')

test('1: Quantity displayValue()', () => {
  dag.runSelected([[ros, true]])

  const requiredInputs = dag.requiredInputNodes()
  expect(requiredInputs.length).toEqual(5)
  expect(requiredInputs).toContain(catalogKey)
  expect(requiredInputs).toContain(deadMoisture)
  expect(requiredInputs).toContain(liveMoisture)
  expect(requiredInputs).toContain(slopeRatio)
  expect(requiredInputs).toContain(midflameWind)

  dag.runInputs([
    [catalogKey, ['10']],
    [deadMoisture, [0.05]],
    [liveMoisture, [1]],
    [slopeRatio, [0.25]],
    [midflameWind, [0]]
  ])
  const rosExpected = 1.936618219012
  const chainsPerHour = (rosExpected * 60) / 66 // 1.760562017
  expect(ros).value(rosExpected, 9)

  // Default Number display is 2 'decimals'
  expect(ros.displayString()).toEqual('1.94 ft/min')
  expect(ros.displayValue()).toEqual('1.94')

  // Set the FireSpreadRate Variant display to 4 fixed decimals
  ros.variant.setDisplayFixed(4)
  expect(ros.displayString()).toEqual('1.9366 ft/min')

  // Set the FireSpreadRate Variant display to 6 exponential decimals
  ros.variant.setDisplayExponential(6)
  expect(ros.displayString()).toEqual('1.936618e+0 ft/min')

  // Set the FireSpreadRate Variant display to 4 precision
  ros.variant.setDisplayPrecision(4)
  expect(ros.displayString()).toEqual('1.937 ft/min')

  // Change display units to ch/h
  ros.variant.setDisplayUnits('ch/h')
  ros.variant.setDisplayFixed(9)
  expect(ros.displayString()).toEqual('1.760562017 ch/h')
  expect(ros.displayValue()).toEqual('1.760562017')
})
