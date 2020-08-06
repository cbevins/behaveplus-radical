/* eslint-disable no-unused-vars */
import { Dag } from '../Dag.js'
import * as Dna from '../../../behaveplus/BpxDna.js'
import * as DagJest from '../../../../utils/matchers.js'
import * as Test from './testData.js'

const value = DagJest.value
expect.extend({ value })

let stores = 0
function noStore (dag) {
  stores += 1
}

const config = [
  ['configure.fire.effectiveWindSpeedLimit', ['applied', 'ignored'][0]],
  ['configure.fire.firelineIntensity', ['firelineIntensity', 'flameLength'][1]],
  ['configure.fire.lengthToWidthRatio', ['lengthToWidthRatio', 'effectiveWindSpeed'][0]],
  ['configure.fire.weightingMethod', ['arithmetic', 'expected', 'harmonic'][0]],
  ['configure.fire.vector', ['fromHead', 'fromUpslope', 'fromNorth'][0]],
  ['configure.fuel.chaparralTotalLoad', ['input', 'estimated'][0]],
  ['configure.fuel.curedHerbFraction', ['input', 'estimated'][1]],
  ['configure.fuel.moisture', ['individual', 'liveCategory', 'category', 'catalog'][0]],
  ['configure.fuel.primary', ['catalog', 'behave', 'chaparral', 'palmettoGallberry', 'westernAspen'][0]],
  ['configure.fuel.secondary', ['none', 'catalog', 'behave', 'chaparral', 'palmettoGallberry', 'westernAspen'][0]],
  ['configure.fuel.windSpeedAdjustmentFactor', ['input', 'estimated'][0]],
  ['configure.slope.steepness', ['ratio', 'degrees', 'map'][0]],
  ['configure.wind.direction', ['sourceFromNorth', 'headingFromUpslope', 'upslope'][2]],
  ['configure.wind.speed', ['at10m', 'at20ft', 'atMidflame'][2]]
]

const inputs = [
  ['site.fire.time.sinceIgnition', [60]],
  ['site.fire.vector.fromNorth', [45]],
  ['site.map.scale', [24000]],
  ['site.moisture.dead.tl1h', [0.01, 0.02, 0.03, 0.04, 0.05]],
  ['site.moisture.dead.tl10h', [0.07]],
  ['site.moisture.dead.tl100h', [0.09]],
  ['site.moisture.dead.category', [0.05]],
  ['site.moisture.live.herb', [0.5, 1, 1.5]],
  ['site.moisture.live.stem', [1.5]],
  ['site.moisture.live.category', [1.5]],
  ['site.slope.direction.aspect', [180]],
  ['site.slope.steepness.ratio', [0.25]],
  ['site.temperature.air', [95]],
  ['site.terrain.spotSourceLocation', ['ridgeTop']],
  ['site.terrain.ridgeValleyDistance', [5000]],
  ['site.terrain.ridgeValleyElevation', [1000]],
  ['site.wind.direction.source.fromNorth', [270]],
  ['site.windSpeedAdjustmentFactor', [0.5]],
  ['site.wind.speed.atMidflame', [880]],
  ['surface.primary.fuel.model.catalogKey', ['10', '124']],
  ['surface.secondary.fuel.model.catalogKey', ['124']],
  ['surface.weighted.fire.primaryCover', [0.6]]
]

test('1: Alternate store function', () => {
  const dag = new Dag(Dna)

  // Step 1 - configuration
  dag.setConfigs(config) // Standard configuration
  dag.setStoreFunction(noStore)
  expect(stores).toEqual(0)

  // Step 2 - selection
  dag.setSelected([['surface.primary.fuel.fire.spreadRate', true]])

  // Step 3: set and run inputs
  dag.runInputs(inputs)

  const results = dag.results()
  expect(results.ok).toEqual(true)
  expect(results.message).toEqual('')
  expect(results.runs).toEqual(30)
  expect(results.runLimit).toEqual(10000)
  expect(stores).toEqual(30)
})

test('2: Run limit orthogonalStack', () => {
  const dag = new Dag(Dna)

  // Step 1 - configuration
  dag.setConfigs(config) // Standard configuration

  // Step 2 - selection
  dag.setSelected([['surface.primary.fuel.fire.spreadRate', true]])

  // Step 3: set and run inputs
  dag.runInputs(inputs)

  let results = dag.results()
  expect(results.ok).toEqual(true)
  expect(results.message).toEqual('')
  expect(results.runs).toEqual(30)
  expect(results.runLimit).toEqual(10000)
  expect(stores).toEqual(30)

  expect(dag.dna.results.runLimit).toEqual(10000)
  dag.setRunLimit(25)
  expect(dag.dna.results.runLimit).toEqual(25)

  dag.runInputs([])
  results = dag.results()
  expect(results.runLimit).toEqual(25)
  expect(results.runs).toEqual(25)
  expect(results.ok).toEqual(false)
  expect(results.message).toEqual('Run limit of 25 exceeded.')

  let indices = dag.runIndices([['site.moisture.dead.tl1h', 0.03]])
  expect(indices).toEqual([2, 7, 12, 17, 22]) // 5 deadMois x 3 liveMois x 2 fuelModel

  indices = dag.runIndices([
    ['site.moisture.dead.tl1h', 0.03],
    ['site.moisture.live.herb', 1]
  ])
  expect(indices).toEqual([7, 22]) // 5 deadMois x 3 liveMois x 2 fuelModel

  indices = dag.runIndices([
    ['site.moisture.dead.tl1h', 0.03],
    ['site.moisture.live.herb', 1],
    ['surface.primary.fuel.model.catalogKey', '124']
  ])
  expect(indices).toEqual([22])

  expect(() => dag.runValue('surface.primary.fuel.fire.scorchHeight', 0)).toThrow()
  expect(() => dag.runInputs([[['site.wind.speed.atMidflame', [880]]]])).toThrow()
  expect(() => dag.runInputs()).toThrow()
})

test('3: Run limit orthogonalRecursive', () => {
  const dag = new Dag(Dna)
  dag.dna.mode = 'orthogonal'

  // Step 1 - configuration
  dag.setConfigs(config) // Standard configuration

  // Step 2 - selection
  dag.setSelected([['surface.primary.fuel.fire.spreadRate', true]])

  // Step 3: set and run inputs
  dag.runInputs(inputs)

  let results = dag.results()
  expect(results.ok).toEqual(true)
  expect(results.message).toEqual('')
  expect(results.runs).toEqual(30)
  expect(results.runLimit).toEqual(10000)
  expect(stores).toEqual(30)

  expect(dag.dna.results.runLimit).toEqual(10000)
  dag.setRunLimit(25)
  expect(dag.dna.results.runLimit).toEqual(25)

  dag.runInputs([])
  results = dag.results()
  expect(results.runLimit).toEqual(25)
  expect(results.runs).toEqual(25)
  expect(results.ok).toEqual(false)
  expect(results.message).toEqual('Run limit of 25 exceeded.')
})
