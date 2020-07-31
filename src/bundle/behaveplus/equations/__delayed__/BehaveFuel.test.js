/* eslint-disable no-unused-vars */
import { BpxDag } from '../../behaveplus/BpxDag.js'
import * as DagJest from '../../utils/matchers.js'

const sig = DagJest.sig
const value = DagJest.value
expect.extend({ value, sig })

const dag = new BpxDag('behave')

dag.runConfigs([
  ['configure.module', 'surfaceFire'],
  [
    'configure.fuel.primary',
    ['catalog', 'behave', 'chaparral', 'palmettoGallberry', 'westernAspen'][1]
  ],
  ['configure.fuel.curedHerbFraction', ['input', 'estimated'][0]],
  // NOT AS IMPORTANT
  ['configure.fuel.chaparralTotalLoad', ['input', 'estimated'][1]],
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

const catalogKey = dag.get('surface.primary.fuel.model.catalogKey')
const prefix = 'surface.primary.fuel.model.behave'
const bed = 'surface.primary.fuel.bed.'
const dead = 'surface.primary.fuel.bed.dead.particle.'
const live = 'surface.primary.fuel.bed.live.particle.'

const curedHerbFraction = dag.get(`${prefix}.parms.cured.herb.fraction`)
const depth = dag.get(`${prefix}.parms.depth`)
const deadMext = dag.get(`${prefix}.parms.dead.extinction.moistureContent`)
const totalHerbLoad = dag.get(`${prefix}.parms.total.herb.ovendryLoad`)
const dead1Load = dag.get(`${prefix}.parms.dead.tl1h.ovendryLoad`)
const dead10Load = dag.get(`${prefix}.parms.dead.tl10h.ovendryLoad`)
const dead100Load = dag.get(`${prefix}.parms.dead.tl100h.ovendryLoad`)
const liveStemLoad = dag.get(`${prefix}.parms.live.stem.ovendryLoad`)
const dead1Savr = dag.get(`${prefix}.parms.dead.tl1h.surfaceAreaToVolumeRatio`)
const liveHerbSavr = dag.get(
  `${prefix}.parms.live.herb.surfaceAreaToVolumeRatio`
)
const liveStemSavr = dag.get(
  `${prefix}.parms.live.stem.surfaceAreaToVolumeRatio`
)
const deadHeat = dag.get(`${prefix}.parms.dead.heatOfCombustion`)
const liveHeat = dag.get(`${prefix}.parms.live.heatOfCombustion`)

const deadHerbLoad = dag.get(`${prefix}.derived.dead.herb.ovendryLoad`)
const liveHerbLoad = dag.get(`${prefix}.derived.live.herb.ovendryLoad`)

const dead1Mois = dag.get('site.moisture.dead.tl1h')
const dead10Mois = dag.get('site.moisture.dead.tl10h')
const dead100Mois = dag.get('site.moisture.dead.tl100h')
const liveHerbMois = dag.get('site.moisture.live.herb')
const liveStemMois = dag.get('site.moisture.live.stem')

const Inputs = [
  [curedHerbFraction, [0.75]],
  [depth, [4]],
  [deadMext, [0.6]],
  [dead1Load, [1]],
  [dead10Load, [2]],
  [dead100Load, [3]],
  [totalHerbLoad, [4]],
  [liveStemLoad, [5]],
  [dead1Savr, [2000]],
  [liveHerbSavr, [1800]],
  [liveStemSavr, [1600]],
  [deadHeat, [8500]],
  [liveHeat, [9500]],
  [dead1Mois, [0.05]],
  [dead10Mois, [0.07]],
  [dead100Mois, [0.09]],
  [liveHerbMois, [0.5]],
  [liveStemMois, [1.5]]
]

test('1 Behave Parms input', () => {
  dag.clearSelected()

  dag.runConfigs([
    ['configure.module', 'surfaceFire'],
    [
      'configure.fuel.primary',
      ['catalog', 'behave', 'chaparral', 'palmettoGallberry', 'westernAspen'][1]
    ],
    ['configure.fuel.curedHerbFraction', ['input', 'estimated'][0]]
  ])
  dag.runSelected([['surface.primary.fuel.fire.reactionIntensity', true]])

  const inputNodes = dag.requiredInputNodes()
  expect(inputNodes.length).toEqual(18)
  Inputs.forEach(input => {
    expect(inputNodes).toContain(input[0])
  })
  dag.runInputs(Inputs)

  expect(
    dag.get(bed + 'dead.extinction.moistureContent').value.current
  ).toEqual(0.6)
  expect(dag.get(bed + 'depth').value.current).toEqual(4)

  expect(dag.get(dead + 'class1.ovendryLoad').value.current).toEqual(1)
  expect(
    dag.get(dead + 'class1.surfaceAreaToVolumeRatio').value.current
  ).toEqual(2000)
  expect(dag.get(dead + 'class1.heatOfCombustion').value.current).toEqual(8500)
  expect(dag.get(dead + 'class1.fiberDensity').value.current).toEqual(32)
  expect(
    dag.get(dead + 'class1.effective.mineralContent').value.current
  ).toEqual(0.01)
  expect(dag.get(dead + 'class1.total.mineralContent').value.current).toEqual(
    0.0555
  )

  expect(dag.get(dead + 'class2.ovendryLoad').value.current).toEqual(2)
  expect(
    dag.get(dead + 'class2.surfaceAreaToVolumeRatio').value.current
  ).toEqual(109)
  expect(dag.get(dead + 'class2.heatOfCombustion').value.current).toEqual(8500)
  expect(dag.get(dead + 'class2.fiberDensity').value.current).toEqual(32)
  expect(
    dag.get(dead + 'class2.effective.mineralContent').value.current
  ).toEqual(0.01)
  expect(dag.get(dead + 'class2.total.mineralContent').value.current).toEqual(
    0.0555
  )

  expect(dag.get(dead + 'class3.ovendryLoad').value.current).toEqual(3)
  expect(
    dag.get(dead + 'class3.surfaceAreaToVolumeRatio').value.current
  ).toEqual(30)
  expect(dag.get(dead + 'class3.heatOfCombustion').value.current).toEqual(8500)
  expect(dag.get(dead + 'class3.fiberDensity').value.current).toEqual(32)
  expect(
    dag.get(dead + 'class3.effective.mineralContent').value.current
  ).toEqual(0.01)
  expect(dag.get(dead + 'class3.total.mineralContent').value.current).toEqual(
    0.0555
  )

  expect(dag.get(dead + 'class4.ovendryLoad').value.current).toEqual(0.75 * 4)
  expect(
    dag.get(dead + 'class4.surfaceAreaToVolumeRatio').value.current
  ).toEqual(1800)
  expect(dag.get(dead + 'class4.heatOfCombustion').value.current).toEqual(8500)
  expect(dag.get(dead + 'class4.fiberDensity').value.current).toEqual(32)
  expect(dag.get(dead + 'class4.fiberDensity').value.current).toEqual(32)
  expect(
    dag.get(dead + 'class4.effective.mineralContent').value.current
  ).toEqual(0.01)
  expect(dag.get(dead + 'class4.total.mineralContent').value.current).toEqual(
    0.0555
  )

  expect(dag.get(dead + 'class5.ovendryLoad').value.current).toEqual(0)

  expect(dag.get(live + 'class1.ovendryLoad').value.current).toEqual(
    (1 - 0.75) * 4
  )
  expect(
    dag.get(live + 'class1.surfaceAreaToVolumeRatio').value.current
  ).toEqual(1800)
  expect(dag.get(live + 'class1.heatOfCombustion').value.current).toEqual(9500)
  expect(dag.get(live + 'class1.fiberDensity').value.current).toEqual(32)
  expect(
    dag.get(live + 'class1.effective.mineralContent').value.current
  ).toEqual(0.01)
  expect(dag.get(live + 'class1.total.mineralContent').value.current).toEqual(
    0.0555
  )

  expect(dag.get(live + 'class2.ovendryLoad').value.current).toEqual(5)
  expect(
    dag.get(live + 'class2.surfaceAreaToVolumeRatio').value.current
  ).toEqual(1600)
  expect(dag.get(live + 'class2.heatOfCombustion').value.current).toEqual(9500)
  expect(dag.get(live + 'class2.fiberDensity').value.current).toEqual(32)
  expect(
    dag.get(live + 'class2.effective.mineralContent').value.current
  ).toEqual(0.01)
  expect(dag.get(live + 'class2.total.mineralContent').value.current).toEqual(
    0.0555
  )

  expect(dag.get(live + 'class3.ovendryLoad').value.current).toEqual(0)
  expect(dag.get(live + 'class4.ovendryLoad').value.current).toEqual(0)
  expect(dag.get(live + 'class5.ovendryLoad').value.current).toEqual(0)
})

test('2 Behave estimated cured herb fraction', () => {
  dag.clearSelected()

  dag.runConfigs([
    ['configure.module', 'surfaceFire'],
    [
      'configure.fuel.primary',
      ['catalog', 'behave', 'chaparral', 'palmettoGallberry', 'westernAspen'][1]
    ],
    ['configure.fuel.curedHerbFraction', ['input', 'estimated'][1]]
  ])
  dag.runSelected([
    ['surface.primary.fuel.fire.reactionIntensity', true],
    [curedHerbFraction, true]
  ])

  const inputNodes = dag.requiredInputNodes()
  expect(inputNodes.length).toEqual(17)
  expect(inputNodes).not.toContain(curedHerbFraction)
  dag.runInputs(Inputs)

  expect(curedHerbFraction.value.current).toBeCloseTo(0.778, 12)
  expect(dag.get(dead + 'class4.ovendryLoad').value.current).toBeCloseTo(
    0.778 * 4,
    12
  )
  expect(dag.get(live + 'class1.ovendryLoad').value.current).toBeCloseTo(
    (1 - 0.778) * 4,
    12
  )
})
