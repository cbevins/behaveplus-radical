/* eslint-disable no-unused-vars */
import { BpxDag } from '../../behaveplus/BpxDag.js'
import * as DagJest from '../../utils/matchers.js'

const sig = DagJest.sig
const value = DagJest.value
expect.extend({ value, sig })

const dag = new BpxDag('palmettoGallberry')

dag.runConfigs([
  ['configure.module', 'surfaceFire'],
  [
    'configure.fuel.primary',
    ['catalog', 'behave', 'chaparral', 'palmettoGallberry', 'westernAspen'][3]
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

const parms = 'surface.primary.fuel.model.palmettoGallberry.parms.'
const age = dag.get(parms + 'age')
const basal = dag.get(parms + 'basalArea')
const cover = dag.get(parms + 'cover')
const height = dag.get(parms + 'height')
const derived = 'surface.primary.fuel.model.palmettoGallberry.derived.'
const depth = dag.get(derived + 'depth')
const deadFineLoad = dag.get(derived + 'deadFineLoad')
const deadSmallLoad = dag.get(derived + 'deadSmallLoad')
const deadFoliageLoad = dag.get(derived + 'deadFoliageLoad')
const deadLitterLoad = dag.get(derived + 'deadLitterLoad')
const liveFineLoad = dag.get(derived + 'liveFineLoad')
const liveSmallLoad = dag.get(derived + 'liveSmallLoad')
const liveFoliageLoad = dag.get(derived + 'liveFoliageLoad')
const catalogKey = dag.get('surface.primary.fuel.model.catalogKey')

test('1 Palmetto-Gallberry library', () => {
  dag.runConfigs([
    ['configure.module', 'surfaceFire'],
    [
      'configure.fuel.primary',
      ['catalog', 'behave', 'chaparral', 'palmettoGallberry', 'westernAspen'][3]
    ]
  ])
  expect(dag.get('configure.fuel.primary').value.current).toEqual(
    'palmettoGallberry'
  )

  dag.runSelected([
    [depth, true],
    [deadFineLoad, true],
    [deadSmallLoad, true],
    [deadFoliageLoad, true],
    [deadLitterLoad, true],
    [liveFineLoad, true],
    [liveSmallLoad, true],
    [liveFoliageLoad, true]
  ])

  const inputNodes = dag.requiredInputNodes()
  expect(inputNodes.length).toEqual(4)
  expect(inputNodes).toContain(age) // required by all loads
  expect(inputNodes).toContain(basal) // required by litter load
  expect(inputNodes).toContain(cover) // deadSmallLoad, deadFoliageLoad, liveFoliageLoad
  expect(inputNodes).toContain(height) // required depth, deadFineLoad, liveFineLoad, liveSmallLoad, liveFoliage

  dag.runInputs([
    [age, 10],
    [cover, 0.5],
    [height, 6],
    [basal, 80]
  ])
  expect(age.value.current).toEqual(10)
  expect(basal.value.current).toEqual(80)
  expect(cover.value.current).toEqual(0.5)
  expect(height.value.current).toEqual(6)

  // Calculate derived fuel particle properties
  const d1 =
    -0.00121 +
    0.00379 * Math.log(age.value.current) +
    0.00118 * height.value.current * height.value.current
  expect(deadFineLoad.value.current).toEqual(d1)

  const d2 = Math.max(
    0,
    -0.00775 +
      0.00021 * cover.value.current +
      0.00007 * age.value.current * age.value.current
  )
  expect(deadSmallLoad.value.current).toEqual(d2)

  const dfol =
    0.00221 *
    Math.pow(age.value.current, 0.51263) *
    Math.exp(0.02482 * cover.value.current)
  expect(deadFoliageLoad.value.current).toEqual(dfol)

  const dlit =
    (0.03632 + 0.0005336 * basal.value.current) *
    (1.0 - Math.pow(0.25, age.value.current))
  expect(deadLitterLoad.value.current).toEqual(dlit)

  const lfol =
    -0.0036 +
    0.00253 * age.value.current +
    0.00049 * cover.value.current +
    0.00282 * height.value.current * height.value.current
  expect(liveFoliageLoad.value.current).toEqual(lfol)

  const l1 =
    0.00546 +
    0.00092 * age.value.current +
    0.00212 * height.value.current * height.value.current
  expect(liveFineLoad.value.current).toEqual(l1)

  const l2 =
    -0.02128 +
    0.00014 * age.value.current * age.value.current +
    0.00314 * height.value.current * height.value.current
  expect(liveSmallLoad.value.current).toEqual(l2)

  expect(depth.value.current).toEqual((2 * height.value.current) / 3)
})

test('2 Palmetto-Gallberry constants', () => {
  dag.runConfigs([
    ['configure.module', 'surfaceFire'],
    [
      'configure.fuel.primary',
      ['catalog', 'behave', 'chaparral', 'palmettoGallberry', 'westernAspen'][3]
    ]
  ])
  expect(dag.get('configure.fuel.primary').value.current).toEqual(
    'palmettoGallberry'
  )

  //      heat dens stot  seff    Foliage savr = 2000
  // Live 8300   46 0.03 0.015    0-0.25  savr = 350
  // Dead 8300   30 0.03 0.010    .25-1.0 savr = 140

  const data = [
    ['surface.primary.fuel.bed.dead.extinction.moistureContent', 0.4],

    // ['surface.primary.fuel.bed.dead.particle.class1.label', 'Dead 1-h time-lag (0 to 0.25 inch diameter) stem wood'],
    [
      'surface.primary.fuel.bed.dead.particle.class1.surfaceAreaToVolumeRatio',
      350
    ],
    ['surface.primary.fuel.bed.dead.particle.class1.heatOfCombustion', 8300],
    ['surface.primary.fuel.bed.dead.particle.class1.fiberDensity', 30],
    [
      'surface.primary.fuel.bed.dead.particle.class1.effective.mineralContent',
      0.01
    ],
    [
      'surface.primary.fuel.bed.dead.particle.class1.total.mineralContent',
      0.03
    ],

    // ['surface.primary.fuel.bed.dead.particle.class2.label', 'Dead 10-h time-lag (0.25 to 1 inch diameter) stem wood'],
    [
      'surface.primary.fuel.bed.dead.particle.class2.surfaceAreaToVolumeRatio',
      140
    ],
    ['surface.primary.fuel.bed.dead.particle.class2.heatOfCombustion', 8300],
    ['surface.primary.fuel.bed.dead.particle.class2.fiberDensity', 30],
    [
      'surface.primary.fuel.bed.dead.particle.class2.effective.mineralContent',
      0.01
    ],
    [
      'surface.primary.fuel.bed.dead.particle.class2.total.mineralContent',
      0.03
    ],

    // ['surface.primary.fuel.bed.dead.particle.class3.label', 'Dead foliage'],
    [
      'surface.primary.fuel.bed.dead.particle.class3.surfaceAreaToVolumeRatio',
      2000
    ],
    ['surface.primary.fuel.bed.dead.particle.class3.heatOfCombustion', 8300],
    ['surface.primary.fuel.bed.dead.particle.class3.fiberDensity', 30],
    [
      'surface.primary.fuel.bed.dead.particle.class3.effective.mineralContent',
      0.01
    ],
    [
      'surface.primary.fuel.bed.dead.particle.class3.total.mineralContent',
      0.03
    ],

    // ['surface.primary.fuel.bed.dead.particle.class4.label', 'Litter layer'],
    [
      'surface.primary.fuel.bed.dead.particle.class4.surfaceAreaToVolumeRatio',
      2000
    ],
    ['surface.primary.fuel.bed.dead.particle.class4.heatOfCombustion', 8300],
    ['surface.primary.fuel.bed.dead.particle.class4.fiberDensity', 30],
    [
      'surface.primary.fuel.bed.dead.particle.class4.effective.mineralContent',
      0.01
    ],
    [
      'surface.primary.fuel.bed.dead.particle.class4.total.mineralContent',
      0.03
    ],

    // ['surface.primary.fuel.bed.live.particle.class1.label', 'Live 0 to 0.25 inch diameter stem wood'],
    [
      'surface.primary.fuel.bed.live.particle.class1.surfaceAreaToVolumeRatio',
      350
    ],
    ['surface.primary.fuel.bed.live.particle.class1.heatOfCombustion', 8300],
    ['surface.primary.fuel.bed.live.particle.class1.fiberDensity', 46],
    [
      'surface.primary.fuel.bed.live.particle.class1.effective.mineralContent',
      0.015
    ],
    [
      'surface.primary.fuel.bed.live.particle.class1.total.mineralContent',
      0.03
    ],

    // ['surface.primary.fuel.bed.live.particle.class2.label', 'Live 0.25 to 1 inch diameter stem wood'],
    [
      'surface.primary.fuel.bed.live.particle.class2.surfaceAreaToVolumeRatio',
      140
    ],
    ['surface.primary.fuel.bed.live.particle.class2.heatOfCombustion', 8300],
    ['surface.primary.fuel.bed.live.particle.class2.fiberDensity', 46],
    [
      'surface.primary.fuel.bed.live.particle.class2.effective.mineralContent',
      0.015
    ],
    [
      'surface.primary.fuel.bed.live.particle.class2.total.mineralContent',
      0.03
    ],

    // ['surface.primary.fuel.bed.live.particle.class3.label', 'Live foliage'],
    ['surface.primary.fuel.bed.live.particle.class3.heatOfCombustion', 8300],
    ['surface.primary.fuel.bed.live.particle.class3.fiberDensity', 46],
    [
      'surface.primary.fuel.bed.live.particle.class3.effective.mineralContent',
      0.015
    ],
    [
      'surface.primary.fuel.bed.live.particle.class3.total.mineralContent',
      0.03
    ],
    [
      'surface.primary.fuel.bed.live.particle.class3.surfaceAreaToVolumeRatio',
      2000
    ]
  ]

  dag.runSelected(data.map(node => [node[0], true]))
  data.forEach(datum => {
    const [key, value] = datum
    expect(dag.get(key).value.current).sig(value, 10, key)
  })
})

test('3 Palmetto-Gallberry catalog', () => {
  dag.clearSelected()
  dag.runConfigs([
    ['configure.module', 'surfaceFire'],
    [
      'configure.fuel.primary',
      ['catalog', 'behave', 'chaparral', 'palmettoGallberry', 'westernAspen'][0]
    ]
  ])
  expect(dag.get('configure.fuel.primary').value.current).toEqual('catalog')

  dag.runSelected([
    [depth, true],
    [deadFineLoad, true],
    [deadSmallLoad, true],
    [deadFoliageLoad, true],
    [deadLitterLoad, true],
    [liveFineLoad, true],
    [liveSmallLoad, true],
    [liveFoliageLoad, true]
  ])

  const inputNodes = dag.requiredInputNodes()
  expect(inputNodes.length).toEqual(1)
  expect(inputNodes).toContain(catalogKey)
  dag.runInputs([[catalogKey, 'pg/age=20/basal=120/cover=.8/height=5']])

  expect(age.value.current).toEqual(20)
  expect(basal.value.current).toEqual(120)
  expect(cover.value.current).toEqual(0.8)
  expect(height.value.current).toEqual(5)

  // Calculate derived fuel particle properties
  const d1 =
    -0.00121 +
    0.00379 * Math.log(age.value.current) +
    0.00118 * height.value.current * height.value.current
  expect(deadFineLoad.value.current).toEqual(d1)

  const d2 = Math.max(
    0,
    -0.00775 +
      0.00021 * cover.value.current +
      0.00007 * age.value.current * age.value.current
  )
  expect(deadSmallLoad.value.current).toEqual(d2)

  const dfol =
    0.00221 *
    Math.pow(age.value.current, 0.51263) *
    Math.exp(0.02482 * cover.value.current)
  expect(deadFoliageLoad.value.current).toEqual(dfol)

  const dlit =
    (0.03632 + 0.0005336 * basal.value.current) *
    (1.0 - Math.pow(0.25, age.value.current))
  expect(deadLitterLoad.value.current).toEqual(dlit)

  const lfol =
    -0.0036 +
    0.00253 * age.value.current +
    0.00049 * cover.value.current +
    0.00282 * height.value.current * height.value.current
  expect(liveFoliageLoad.value.current).toEqual(lfol)

  const l1 =
    0.00546 +
    0.00092 * age.value.current +
    0.00212 * height.value.current * height.value.current
  expect(liveFineLoad.value.current).toEqual(l1)

  const l2 =
    -0.02128 +
    0.00014 * age.value.current * age.value.current +
    0.00314 * height.value.current * height.value.current
  expect(liveSmallLoad.value.current).toEqual(l2)

  expect(depth.value.current).toEqual((2 * height.value.current) / 3)
})
