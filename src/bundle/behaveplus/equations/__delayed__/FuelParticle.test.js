import { BpxDag } from '../../behaveplus/BpxDag.js'
import * as DagJest from '../../utils/matchers.js'
import * as FuelParticle from '../FuelParticle.js'

const sig = DagJest.sig
const value = DagJest.value
expect.extend({ value, sig })

const dag = new BpxDag('fuelParticle')

dag.runConfigs([
  ['configure.module', 'surfaceFire'],
  [
    'configure.fuel.primary',
    ['catalog', 'behave', 'chaparral', 'palmettoGallberry', 'westernAspen'][0]
  ],
  // NOT AS IMPORTANT
  [
    'configure.fuel.moisture',
    ['individual', 'liveCategory', 'category', 'catalog'][0]
  ],
  [
    'configure.wind.direction',
    ['sourceFromNorth', 'headingFromUpslope', 'upslope'][1]
  ],
  ['configure.wind.speed', ['at10m', 'at20ft', 'atMidflame'][1]],
  ['configure.fuel.windSpeedAdjustmentFactor', ['input', 'estimated'][0]],
  ['configure.fire.firelineIntensity', ['firelineIntensity', 'flameLength'][1]],
  ['configure.fire.vector', ['fromHead', 'fromUpslope', 'fromNorth'][0]],
  [
    'configure.fire.lengthToWidthRatio',
    ['lengthToWidthRatio', 'effectiveWindSpeed'][0]
  ],
  ['configure.fire.effectiveWindSpeedLimit', ['applied', 'ignored'][0]],
  ['configure.fire.weightingMethod', ['arithmetic', 'expected', 'harmonic'][2]],
  ['configure.fuel.chaparralTotalLoad', ['input', 'estimated'][0]],
  ['configure.fuel.curedHerbFraction', ['input', 'estimated'][1]],
  [
    'configure.fuel.secondary',
    [
      'none',
      'catalog',
      'behave',
      'chaparral',
      'palmettoGallberry',
      'westernAspen'
    ][0]
  ],
  ['configure.slope.steepness', ['ratio', 'degrees', 'map'][0]]
])

const cfgFuel = dag.get('configure.fuel.primary')
// const diam = dag.get('surface.primary.fuel.bed.dead.particle.class1.cylindricalDiameter')
const volm = dag.get('surface.primary.fuel.bed.dead.particle.class1.volume')
const catalogKey = dag.get('surface.primary.fuel.model.catalogKey')

test('1: sizeClass() tests for full code coverage', () => {
  expect(dag.get('configure.fuel.primary').value.current).toEqual('catalog')

  dag.runSelected([
    // [diam, true],
    [volm, true]
  ])
  const inputNodes = dag.requiredInputNodes()
  // console.log(DagJest.arrayList(inputNodes, 'Input Nodes'))
  expect(inputNodes.length).toEqual(1)
  expect(inputNodes).toContain(catalogKey)

  const configNodes = dag.requiredConfigNodes()
  // expect(configNodes.length).toEqual(1)
  expect(configNodes).toContain(cfgFuel)

  dag.runInputs([[catalogKey, '10']])
  let diameter = 4 / 2000
  // expect(diam.value.current).toEqual(diameter)
  let volume = 0.138 / 32
  expect(volm.value.current).toEqual(volume)

  // FM 10 10-h
  diameter = 4 / 192 // 0.02083333 ft, 0.25 in
  volume = 0.092 / 32 // 0.002875 ft3, 4.968 in3
  const length = FuelParticle.cylindricalLength(diameter, volume) // 8.43393 ft
  expect(length).toEqual(volume / (Math.PI * 0.25 * diameter * diameter))

  expect(FuelParticle.sizeClass(3000)).toEqual(0)
  expect(FuelParticle.sizeClass(1200)).toEqual(0)

  expect(FuelParticle.sizeClass(1199)).toEqual(1)
  expect(FuelParticle.sizeClass(192)).toEqual(1)

  expect(FuelParticle.sizeClass(191)).toEqual(2)
  expect(FuelParticle.sizeClass(96)).toEqual(2)

  expect(FuelParticle.sizeClass(95)).toEqual(3)
  expect(FuelParticle.sizeClass(48)).toEqual(3)

  expect(FuelParticle.sizeClass(47)).toEqual(4)
  expect(FuelParticle.sizeClass(16)).toEqual(4)

  expect(FuelParticle.sizeClass(15)).toEqual(5)
})

test('Coverage tests', () => {
  expect(FuelParticle.cylindricalDiameter(1200)).toEqual(4 / 1200)

  expect(() => FuelParticle.selectByDomain('junk', 1, 2, 3, 4)).toThrow()
})
