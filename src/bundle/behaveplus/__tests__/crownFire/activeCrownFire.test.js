/* eslint-disable no-unused-vars */
import { Bpx } from '../../Bpx.js'
import * as DagJest from '../../../../utils/matchers.js'
import * as Crown from '../../equations/CrownFire.js'

const value = DagJest.value
expect.extend({ value })

const Configs = [
  ['configure.fire.effectiveWindSpeedLimit', ['applied', 'ignored'][0]],
  ['configure.fire.firelineIntensity', ['firelineIntensity', 'flameLength'][0]],
  ['configure.fire.lengthToWidthRatio', ['lengthToWidthRatio', 'effectiveWindSpeed'][0]],
  ['configure.fire.weightingMethod', ['arithmetic', 'expected', 'harmonic'][2]],
  ['configure.fire.vector', ['fromHead', 'fromUpslope', 'fromNorth'][2]],
  ['configure.fuel.windSpeedAdjustmentFactor', ['input', 'estimated'][0]],
  ['configure.fuel.chaparralTotalLoad', ['input', 'estimated'][0]],
  ['configure.fuel.curedHerbFraction', ['input', 'estimated'][1]],
  ['configure.fuel.moisture', ['individual', 'liveCategory', 'category', 'catalog'][0]],
  ['configure.fuel.primary', ['catalog', 'behave', 'chaparral', 'palmettoGallberry', 'westernAspen'][0]],
  ['configure.fuel.secondary', ['none', 'catalog', 'behave', 'chaparral', 'palmettoGallberry', 'westernAspen'][0]],
  ['link.crownFire', 'linkedToSurfaceFire'],
  ['configure.slope.steepness', ['ratio', 'degrees', 'map'][0]],
  ['configure.wind.direction', ['sourceFromNorth', 'headingFromUpslope', 'upslope'][0]],
  ['configure.wind.speed', ['at10m', 'at20ft', 'atMidflame'][1]]
]

const Inputs1 = [
  ['site.moisture.dead.tl1h', [0.05]],
  ['site.moisture.dead.tl10h', [0.07]],
  ['site.moisture.dead.tl100h', [0.09]],
  ['site.moisture.live.herb', [0.5]],
  ['site.moisture.live.stem', [1.5]],
  ['site.slope.direction.aspect', [180]],
  ['site.slope.steepness.ratio', [0.25]],
  ['site.wind.direction.source.fromNorth', [270]],
  ['site.windSpeedAdjustmentFactor', [0.4]],
  ['site.wind.speed.at20ft', [25 * 88]],
  ['surface.primary.fuel.model.catalogKey', ['124']]
]

const Inputs2 = [
  ['site.canopy.crown.baseHeight', [10]],
  ['site.canopy.crown.totalHeight', [100]],
  ['site.canopy.fuel.bulkDensity', [0.02]]
]

const Inputs3 = [['site.canopy.fuel.foliar.moistureContent', [0.5]]]

const Inputs4 = []

const Inputs5 = [
  ['site.fire.time.sinceIgnition', [60]],
  ['site.map.scale', [12000]]
]

const InputsUnused = [
  ['site.fire.observed.heatPerUnitArea', [3054.970441574617]],
  ['site.fire.vector.fromNorth', [45]],
  ['site.temperature.air', [95]]
]

// Basic surface fire results to ensure correct values
const surface = 'surface.primary.fuel.fire.' // or 'surface.weighted.fire.'
const Results1 = [
  [surface + 'spreadRate', 48.47042599399056, 10],
  [surface + 'firelineIntensity', 2467.9286450361865, 10],
  [surface + 'flameLength', 16.35631663317114, 12],
  [surface + 'reactionIntensity', 12976.692888496578, 12],
  [surface + 'heatPerUnitArea', 3054.970441574617, 12],
  ['surface.primary.fuel.bed.heatSink', 319.216404, 9]
]

// Rothermel crown fire results
const Results2 = [
  ['site.canopy.fuel.bulkDensity', 0.02, 12],
  ['site.canopy.fuel.ovendryLoad', 1.8, 12],
  ['site.canopy.fire.heatPerUnitArea', 14400, 12],
  ['crown.canopy.fuel.fire.noWindNoSlope.spreadRate', 0.67900860922904482, 12],
  ['crown.canopy.fuel.fire.slope.phi', 0, 12],
  ['crown.canopy.fuel.fire.wind.phi', 26.298112107312534, 12],
  ['crown.canopy.fuel.fire.phiEffectiveWind', 26.298112107312534, 12],
  ['crown.canopy.fuel.fire.spreadRate', 18.535653136564, 12],
  ['crown.canopy.fuel.fire.reactionIntensity', 5794.6954002291168, 12],
  ['crown.fire.active.heatPerUnitArea', 17454.97044157461, 12],
  ['crown.fire.active.lengthToWidthRatio', 4.125, 12],
  ['crown.fire.active.spreadRate', 61.909081476126, 12],
  ['crown.fire.active.powerOfTheWind', 47.96568165233, 12],
  ['crown.fire.active.powerOfTheFire', 139.615140469098, 12],
  ['crown.fire.active.powerRatio', 2.9107298314046, 12],
  ['crown.fire.active.firelineIntensity', 18010.35312051372, 12],
  ['crown.fire.active.flameLength', 137.418376789506, 12],
  ['crown.fire.active.isPlumeDominated', true, null],
  ['crown.fire.active.isWindDriven', false, null],
  ['crown.fire.surface.heatPerUnitArea', 3054.970441574617, 12]
]

// Crown fire initiation results
const Results3 = [
  ['crown.fire.initiation.firelineIntensity', 112.938700503, 12],
  ['crown.fire.initiation.spreadRate', 2.21813014553, 11],
  ['crown.fire.initiation.rPrime', 30.7223522801, 5],
  ['crown.fire.initiation.transitionRatio', 21.851930596532, 11],
  ['crown.fire.initiation.activeRatio', 2.015115278658, 5],
  ['crown.fire.initiation.canTransition', true, null],
  ['crown.fire.initiation.type', 'Active', null],
  ['crown.fire.initiation.isActiveCrownFire', true, null],
  ['crown.fire.initiation.isConditionalCrownFire', false, null],
  ['crown.fire.initiation.isCrownFire', true, null],
  ['crown.fire.initiation.isPassiveCrownFire', false, null],
  ['crown.fire.initiation.isSurfaceFire', false, null],
  ['crown.fire.initiation.oActive', 1311.5956871074688, 12]
]

// Final crown fire behavior results
const Results4 = [
  ['crown.fire.final.rSa', 26.512798896145366, 12],
  ['crown.fire.final.crownFractionBurned', 1, 12],
  ['crown.fire.final.spreadRate', 61.909081476126, 12],
  ['crown.fire.final.firelineIntensity', 18010.35312051372, 12],
  ['crown.fire.final.flameLength', 137.418376789506, 12]
]

// Final fire size, perimeter, distances
const Results5 = [
  ['crown.fire.active.size.length', 3714.544888567592, 12],
  ['crown.fire.active.size.width', 900.49573056184, 12],
  ['crown.fire.active.size.perimeter', 7249.28885253776, 12],
  ['crown.fire.active.size.area', 2627103.302726261, 12],
  ['crown.fire.active.map.length', 3714.544888567592 / 12000, 12],
  ['crown.fire.active.map.width', 900.49573056184 / 12000, 12],
  ['crown.fire.active.map.perimeter', 7249.28885253776 / 12000, 12],
  ['crown.fire.active.map.area', 2627103.302726261 / 12000 / 12000, 12],
  ['crown.fire.final.size.length', 3714.544888567592, 12],
  ['crown.fire.final.size.width', 900.49573056184, 12],
  ['crown.fire.final.size.perimeter', 7249.28885253776, 12],
  ['crown.fire.final.size.area', 2627103.302726261, 12],
  ['crown.fire.final.map.length', 3714.544888567592 / 12000, 12],
  ['crown.fire.final.map.width', 900.49573056184 / 12000, 12],
  ['crown.fire.final.map.perimeter', 7249.28885253776 / 12000, 12],
  ['crown.fire.final.map.area', 2627103.302726261 / 12000 / 12000, 12]
]

/**
 * Note that for the Benchmark124 case,
 * the wind is NOT blowing upslope, so S&R final results are invalid
 */
test('1: Active crown fire per BP6', () => {
  const dag = new Bpx()
  dag.runConfigs(Configs)

  // Start with the basic surface fire behaviors to ensure correct values
  dag.runSelected(Results1.map(node => [node[0], true]))
  let requiredInputs = dag.requiredInputNodes()
  expect(requiredInputs.length).toEqual(Inputs1.length)
  Inputs1.forEach(input => {
    expect(requiredInputs).toContain(dag.get(input[0]))
  })

  dag.runInputs(Inputs1)
  Results1.forEach(result => {
    const [key, value, prec] = result
    expect(dag.get(key)).value(value, prec)
  })

  // Now request the Rothermel crown fire results
  dag.runSelected(Results2.map(node => [node[0], true]))
  requiredInputs = dag.requiredInputNodes()
  expect(requiredInputs.length).toEqual(Inputs1.length + Inputs2.length)
  Inputs2.forEach(input => {
    expect(requiredInputs).toContain(dag.get(input[0]))
  })

  dag.runInputs(Inputs2)
  let results = [...Results1, ...Results2]
  results.forEach(result => {
    const [key, value, prec] = result
    expect(dag.get(key)).value(value, prec)
  })

  // Now request crown fire initiation
  dag.runSelected(Results3.map(node => [node[0], true]))
  requiredInputs = dag.requiredInputNodes()
  expect(requiredInputs.length).toEqual(
    Inputs1.length + Inputs2.length + Inputs3.length
  )
  expect(requiredInputs).toContain(
    dag.get('site.canopy.fuel.foliar.moistureContent')
  )

  dag.runInputs(Inputs3)
  results = [...Results1, ...Results2, ...Results3]
  results.forEach(result => {
    const [key, value, prec] = result
    expect(dag.get(key)).value(value, prec)
  })

  // Final crown fire results (no new inputs required)
  dag.runSelected(Results4.map(node => [node[0], true]))
  requiredInputs = dag.requiredInputNodes()
  expect(requiredInputs.length).toEqual(
    Inputs1.length + Inputs2.length + Inputs3.length
  )

  dag.runInputs(Inputs4)
  results = [...Results1, ...Results2, ...Results3, ...Results4]
  results.forEach(result => {
    const [key, value, prec] = result
    expect(dag.get(key)).value(value, prec)
  })

  // Finally, verify distances and sizes
  dag.runSelected(Results5.map(node => [node[0], true]))
  requiredInputs = dag.requiredInputNodes()
  expect(requiredInputs.length).toEqual(
    Inputs1.length + Inputs2.length + Inputs3.length + Inputs5.length
  )
  expect(requiredInputs).toContain(dag.get('site.fire.time.sinceIgnition'))
  expect(requiredInputs).toContain(dag.get('site.map.scale'))

  dag.runInputs(Inputs5)
  results = [...Results1, ...Results2, ...Results3, ...Results4, ...Results5]
  results.forEach(result => {
    const [key, value, prec] = result
    expect(dag.get(key)).value(value, prec)
  })
})

test('2: Crown fire equations coverage', () => {
  let oActive = 100
  const surfRos0 = 100
  let surfWaf = 1
  const surfWindB = 1
  const surfWindK = 1
  const surfPhiS = 1
  const mwspd = surfWaf * oActive
  const surfPhiW = mwspd <= 0 ? 0 : surfWindK * Math.pow(mwspd, surfWindB)
  const rsa = surfRos0 * (1 + surfPhiW + surfPhiS)
  expect(Crown.rSa(oActive, surfRos0, surfWaf, surfWindB, surfWindK, surfPhiS))
    .toEqual(10200)

  oActive = 0
  surfWaf = 1
  expect(Crown.rSa(oActive, surfRos0, surfWaf, surfWindB, surfWindK, surfPhiS))
    .toEqual(200)

  oActive = 100
  surfWaf = 0
  expect(Crown.rSa(oActive, surfRos0, surfWaf, surfWindB, surfWindK, surfPhiS))
    .toEqual(200)

  expect(Crown.transitionRatio(1, 1)).toEqual(1)
  expect(Crown.transitionRatio(0, 1)).toEqual(0)
  expect(Crown.transitionRatio(1, 0)).toEqual(0)
  expect(Crown.transitionRatio(0, 0)).toEqual(0)

  expect(Crown.type(0, 0)).toEqual(Crown.SURFACE)
  expect(Crown.type(0, 1)).toEqual(Crown.CONDITIONAL)
  expect(Crown.type(1, 0)).toEqual(Crown.PASSIVE)
  expect(Crown.type(1, 1)).toEqual(Crown.ACTIVE)
})
