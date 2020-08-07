/* eslint-disable no-unused-vars */
import { Bpx } from '../../Bpx.js'
import * as DagJest from '../../../../utils/matchers.js'

const value = DagJest.value
expect.extend({ value })

const dag = new Bpx()

dag.runConfigs([
  ['configure.fuel.windSpeedAdjustmentFactor', ['input', 'estimated'][0]],
  ['configure.wind.speed', ['at10m', 'at20ft', 'atMidflame'][1]],
  ['configure.wind.direction', ['sourceFromNorth', 'headingFromUpslope', 'upslope'][0]],
  ['configure.fuel.primary', ['catalog', 'behave', 'chaparral', 'palmettoGallberry', 'westernAspen'][0]],
  // NOT AS IMPORTANT
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
    'configure.fuel.moisture',
    ['individual', 'liveCategory', 'category', 'catalog'][0]
  ],
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

// Wind configuration Nodes
const cfgDirection = dag.get('configure.wind.direction')
const cfgPrimary = dag.get('configure.fuel.primary')
const cfgSpeed = dag.get('configure.wind.speed')
const cfgWaf = dag.get('configure.fuel.windSpeedAdjustmentFactor')

const depth = dag.get('surface.primary.fuel.bed.depth')
const openWaf = dag.get('surface.primary.fuel.bed.open.windSpeedAdjustmentFactor')
const catalogKey = dag.get('surface.primary.fuel.model.catalogKey')

// These are ALL 9 of the WAF Nodes
const crownOpenWaf = dag.get('crown.canopy.fuel.bed.open.windSpeedAdjustmentFactor')
const crownFuelWaf = dag.get('crown.canopy.fuel.fire.windSpeedAdjustmentFactor')
const canopyShelteredWaf = dag.get('site.canopy.sheltered.windSpeedAdjustmentFactor')
const siteWaf = dag.get('site.windSpeedAdjustmentFactor')
const primaryOpenWaf = dag.get('surface.primary.fuel.bed.open.windSpeedAdjustmentFactor')
const primaryFuelWaf = dag.get('surface.primary.fuel.fire.windSpeedAdjustmentFactor')
const secondaryOpenWaf = dag.get('surface.secondary.fuel.bed.open.windSpeedAdjustmentFactor')
const secondaryFuelWaf = dag.get('surface.secondary.fuel.fire.windSpeedAdjustmentFactor')
const weightedFuelWaf = dag.get('surface.weighted.fire.windSpeedAdjustmentFactor')

const canopyCover = dag.get('site.canopy.cover')
const crownLength = dag.get('site.canopy.crown.length')
const crownRatio = dag.get('site.canopy.crown.ratio')
const crownFill = dag.get('site.canopy.crown.fill')
const sheltersFuel = dag.get('site.canopy.fuel.isSheltered')
const shelteredWaf = dag.get('site.canopy.sheltered.windSpeedAdjustmentFactor')
const crownBase = dag.get('site.canopy.crown.baseHeight')
const crownHeight = dag.get('site.canopy.crown.totalHeight')
const behaveDepth = dag.get('surface.primary.fuel.model.behave.parms.depth')

const siteAt10m = dag.get('site.wind.speed.at10m')
const siteAt20ft = dag.get('site.wind.speed.at20ft')
const siteAtMidflame = dag.get('site.wind.speed.atMidflame')
const primaryFuelAtMidflame = dag.get('surface.primary.fuel.fire.wind.speed.atMidflame')
const secondaryFuelAtMidflame = dag.get('surface.secondary.fuel.fire.wind.speed.atMidflame')

test('1: Select open-canopy WAF only', () => {
  dag.clearSelected()
  dag.runConfigs([
    ['configure.fuel.windSpeedAdjustmentFactor', ['input', 'estimated'][0]],
    ['configure.wind.speed', ['at10m', 'at20ft', 'atMidflame'][1]],
    ['configure.wind.direction', ['sourceFromNorth', 'headingFromUpslope', 'upslope'][0]],
    ['configure.fuel.primary', ['catalog', 'behave', 'chaparral', 'palmettoGallberry', 'westernAspen'][0]]
  ])
  // Verify initial configuration
  expect(cfgWaf.value).toEqual('input')
  expect(cfgPrimary.value).toEqual('catalog')
  expect(cfgSpeed.value).toEqual('at20ft')

  // Selecting just the primary fuel bed open-canopy WAF
  // requires just the fuel bed depth
  dag.runSelected([
    [openWaf, true],
    [depth, true]
  ])
  const selectedNodes = dag.selectedNodes()
  expect(selectedNodes.length).toEqual(2)
  expect(selectedNodes).toContain(depth)
  expect(selectedNodes).toContain(openWaf)

  // Fuel bed open-canopy WAF requires just the primary config
  const configNodes = dag.requiredConfigNodes()
  expect(configNodes.length).toEqual(1)
  expect(configNodes).toContain(cfgPrimary)

  // So primary fuel model key is the only input
  const inputNodes = dag.requiredInputNodes()
  expect(inputNodes.length).toEqual(1)
  expect(inputNodes).toContain(catalogKey)

  // Fuel Model 10 open-canopy WAF
  dag.runInputs([[catalogKey, ['10']]])
  expect(depth.value).toEqual(1)
  // let waf010 = 1.83 / Math.log((20.0 + 0.36 * depth.value) / (0.13 * depth.value))
  // console.log(waf010) // === 0.36210426360602416
  expect(openWaf.value).toEqual(0.36210426360602416)

  // Fuel Model 124 open-canopy WAF
  dag.runInputs([[catalogKey, ['124']]])
  expect(depth.value).toEqual(2.1)
  // let waf124 = 1.83/Math.log((20.0+0.36*depth)/(0.13*depth))
  // console.log(waf124) // === 0.4225236169597915
  expect(openWaf.value).toEqual(0.4225236169597915)
})

test('2: Fuel bed WAF with input vs estimated WAF', () => {
  dag.clearSelected()
  dag.runConfigs([
    ['configure.fuel.windSpeedAdjustmentFactor', ['input', 'estimated'][0]],
    ['configure.wind.speed', ['at10m', 'at20ft', 'atMidflame'][1]],
    [
      'configure.wind.direction',
      ['sourceFromNorth', 'headingFromUpslope', 'upslope'][0]
    ],
    [
      'configure.fuel.primary',
      ['catalog', 'behave', 'chaparral', 'palmettoGallberry', 'westernAspen'][0]
    ]
  ])
  // Verify initial configuration
  expect(cfgWaf.value).toEqual('input')
  expect(cfgPrimary.value).toEqual('catalog')
  expect(cfgSpeed.value).toEqual('at20ft')

  // Selecting fuel bed WAF with input WAF
  dag.runSelected([[primaryFuelWaf, true]])
  const selectedNodes = dag.selectedNodes()
  expect(selectedNodes.length).toEqual(1)
  expect(selectedNodes).toContain(primaryFuelWaf)

  let configNodes = dag.requiredConfigNodes()
  expect(configNodes.length).toEqual(1)
  expect(configNodes).toContain(cfgWaf)

  // Since WAF is input, fuel bed waf is bound to site WAF
  let inputNodes = dag.requiredInputNodes()
  expect(inputNodes.length).toEqual(1)
  expect(inputNodes).toContain(siteWaf)
  dag.runInputs([[siteWaf, [0, 0.5, 1]]])
  expect(dag.resultValue(primaryFuelWaf, 0)).toEqual(0)
  expect(dag.resultValue(primaryFuelWaf, 1)).toEqual(0.5)
  expect(dag.resultValue(primaryFuelWaf, 2)).toEqual(1)

  // If WAF is estimated, we need canopy and depth inputs
  dag.runConfigs([[cfgWaf, 'estimated']])
  configNodes = dag.requiredConfigNodes()
  expect(configNodes.length).toEqual(2)
  expect(configNodes).toContain(cfgWaf)
  expect(configNodes).toContain(cfgPrimary)

  inputNodes = dag.requiredInputNodes()
  expect(inputNodes.length).toEqual(4)
  expect(inputNodes).toContain(crownBase)
  expect(inputNodes).toContain(crownHeight)
  expect(inputNodes).toContain(canopyCover)
  expect(inputNodes).toContain(catalogKey)

  // We'll want to see these already required intermediates as well
  dag.runSelected([
    [openWaf, true],
    [crownLength, true],
    [crownRatio, true],
    [crownFill, true],
    [sheltersFuel, true],
    [shelteredWaf, true]
  ])

  inputNodes = dag.requiredInputNodes()
  expect(inputNodes.length).toEqual(4)
  expect(inputNodes).toContain(catalogKey)
  expect(inputNodes).toContain(canopyCover)
  expect(inputNodes).toContain(crownBase)
  expect(inputNodes).toContain(crownHeight)
  dag.runInputs([
    [catalogKey, '10'],
    [canopyCover, 0.5],
    [crownBase, 10],
    [crownHeight, 40]
  ])

  expect(depth.value).toBeCloseTo(1, 12)
  expect(canopyCover.value).toBeCloseTo(0.5, 12)
  expect(crownBase.value).toBeCloseTo(10, 12)
  expect(crownHeight.value).toBeCloseTo(40, 12)
  expect(crownLength.value).toBeCloseTo(30, 12)
  expect(crownRatio.value).toBeCloseTo(0.75, 12)
  // let fill = 0.75 * 0.5 / 3  // 0.125
  expect(crownFill.value).toBeCloseTo(0.125, 12)
  // let w = BpxLibCanopy.waf(canopyCover.value, canopy.crownHeight.value,
  //   canopy.crownFill.value)
  expect(shelteredWaf.value).toBeCloseTo(0.1313664741590494, 12)
  expect(sheltersFuel.value).toEqual(true)
  expect(primaryFuelWaf.value).toBeCloseTo(0.1313664741590494, 12)
  expect(openWaf.value).toBeCloseTo(0.36210426360602416, 12)
  // expect(at20ft.value).toBeCloseTo((10 / 0.1313664741590494), 12)

  // If fuel is unsheltered, WAF should be openWaf
  dag.runInputs([[canopyCover, [0]]])
  expect(canopyCover.value).toBeCloseTo(0, 12)
  expect(shelteredWaf.value).toBeCloseTo(1, 12)
  expect(sheltersFuel.value).toEqual(false)
  expect(openWaf.value).toBeCloseTo(0.36210426360602416, 12)
  expect(primaryFuelWaf.value).toBeCloseTo(0.36210426360602416, 12)
  // expect(at20ft.value).toBeCloseTo((10 / 0.36210426360602416), 12)

  dag.runInputs([
    [canopyCover, [0.5]],
    [crownHeight, [5]]
  ])
  expect(sheltersFuel.value).toEqual(false)
  expect(openWaf.value).toBeCloseTo(0.36210426360602416, 12)
  expect(primaryFuelWaf.value).toBeCloseTo(0.36210426360602416, 12)

  dag.runInputs([
    [crownBase, [40]],
    [crownHeight, [40]]
  ])
  expect(sheltersFuel.value).toEqual(false)
  expect(openWaf.value).toBeCloseTo(0.36210426360602416, 12)
  expect(primaryFuelWaf.value).toBeCloseTo(0.36210426360602416, 12)

  dag.runInputs([
    [canopyCover, [0.5]],
    [crownBase, [10]],
    [crownHeight, [40]]
  ])
  expect(sheltersFuel.value).toEqual(true)
  expect(shelteredWaf.value).toBeCloseTo(0.1313664741590494, 12)
  expect(openWaf.value).toBeCloseTo(0.36210426360602416, 12)
  expect(primaryFuelWaf.value).toBeCloseTo(0.1313664741590494, 12)

  // Change primary fuel input to 'behave'
  // and we must enter the primary behave model depth parameter
  dag.runConfigs([[cfgPrimary, 'behave']])

  inputNodes = dag.requiredInputNodes()
  expect(inputNodes.length).toEqual(4)
  expect(inputNodes).toContain(crownBase)
  expect(inputNodes).toContain(crownHeight)
  expect(inputNodes).toContain(canopyCover)
  expect(inputNodes).toContain(behaveDepth)

  dag.runInputs([[behaveDepth, [2]]])
  expect(openWaf.value).toBeCloseTo(0.4179825632019431, 12)
  expect(primaryFuelWaf.value).toBeCloseTo(0.1313664741590494, 12)
  // expect(at20ft.value).toBeCloseTo((10/0.1313664741590494), 12)
})

test('3: Fuel bed midflame wind speed', () => {
  dag.clearSelected()
  dag.runConfigs([
    ['configure.fuel.windSpeedAdjustmentFactor', ['input', 'estimated'][0]],
    ['configure.wind.speed', ['at10m', 'at20ft', 'atMidflame'][1]],
    [
      'configure.wind.direction',
      ['sourceFromNorth', 'headingFromUpslope', 'upslope'][0]
    ],
    [
      'configure.fuel.primary',
      ['catalog', 'behave', 'chaparral', 'palmettoGallberry', 'westernAspen'][0]
    ]
  ])
  // Verify initial configuration
  expect(cfgWaf.value).toEqual('input')
  expect(cfgPrimary.value).toEqual('catalog')
  expect(cfgSpeed.value).toEqual('at20ft')

  // Selecting fuel bed midflame wind speed
  dag.runSelected([[primaryFuelAtMidflame, true]])
  const selectedNodes = dag.selectedNodes()
  expect(selectedNodes.length).toEqual(1)
  expect(selectedNodes).toContain(primaryFuelAtMidflame)

  // WAF is input, so no need for fuel
  let configNodes = dag.requiredConfigNodes()
  expect(configNodes.length).toEqual(2)
  expect(configNodes).toContain(cfgSpeed)
  expect(configNodes).toContain(cfgWaf)

  // Since WAF is input, fuel bed waf is bound to site WAF
  let inputNodes = dag.requiredInputNodes()
  expect(inputNodes.length).toEqual(2)
  expect(inputNodes).toContain(siteAt20ft)
  expect(inputNodes).toContain(siteWaf)

  dag.runInputs([
    [siteAt20ft, [20]],
    [siteWaf, [0.5]]
  ])
  expect(primaryFuelAtMidflame.value).toEqual(10)

  dag.runConfigs([[cfgSpeed, 'at10m']])
  dag.runInputs([
    [siteAt10m, [20]],
    [siteWaf, [0.5]]
  ])
  expect(primaryFuelAtMidflame.value).toEqual(10 / 1.13)

  // Set wind speed input to 'atMidflame'
  dag.runConfigs([[cfgSpeed, 'atMidflame']])

  // Now the only required config is wind speed
  configNodes = dag.requiredConfigNodes()
  expect(configNodes.length).toEqual(1)
  expect(configNodes).toContain(cfgSpeed)

  inputNodes = dag.requiredInputNodes()
  expect(inputNodes.length).toEqual(1)
  expect(inputNodes).toContain(siteAtMidflame)

  dag.runInputs([[siteAtMidflame, [12.3]]])
  expect(primaryFuelAtMidflame.value).toEqual(12.3)

  // Change wind speed back to 20ft
  dag.runConfigs([[cfgSpeed, 'at20ft']])

  configNodes = dag.requiredConfigNodes()
  expect(configNodes.length).toEqual(2)
  expect(configNodes).toContain(cfgSpeed)
  expect(configNodes).toContain(cfgWaf)

  // Estimate the WAF, and fuel config now needed
  dag.runConfigs([[cfgWaf, 'estimated']])

  configNodes = dag.requiredConfigNodes()
  expect(configNodes.length).toEqual(3)
  expect(configNodes).toContain(cfgSpeed)
  expect(configNodes).toContain(cfgWaf)
  expect(configNodes).toContain(cfgPrimary)

  dag.runConfigs([[cfgPrimary, 'catalog']])

  inputNodes = dag.requiredInputNodes()
  expect(inputNodes.length).toEqual(5)
  expect(inputNodes).toContain(crownBase)
  expect(inputNodes).toContain(crownHeight)
  expect(inputNodes).toContain(canopyCover)
  expect(inputNodes).toContain(catalogKey)
  expect(inputNodes).toContain(siteAt20ft)

  dag.runInputs([
    [catalogKey, ['10']],
    [canopyCover, [0.5]],
    [crownBase, [10]],
    [crownHeight, [40]],
    [siteAt20ft, [10]]
  ])
  expect(depth.value).toBeCloseTo(1, 12)
  expect(canopyCover.value).toBeCloseTo(0.5, 12)
  expect(crownBase.value).toBeCloseTo(10, 12)
  expect(crownHeight.value).toBeCloseTo(40, 12)
  expect(crownLength.value).toBeCloseTo(30, 12)
  expect(crownRatio.value).toBeCloseTo(0.75, 12)
  // let fill = 0.75 * 0.5 / 3  // 0.125
  expect(crownFill.value).toBeCloseTo(0.125, 12)
  // let w = BpxLibCanopy.waf(canopyCover.value, canopy.crownHeight.value,
  //   canopy.crownFill.value)
  expect(shelteredWaf.value).toBeCloseTo(0.1313664741590494, 12)
  expect(sheltersFuel.value).toEqual(true)
  expect(primaryFuelWaf.value).toBeCloseTo(0.1313664741590494, 12)
  expect(openWaf.value).toEqual(0.36210426360602416)
  expect(primaryFuelAtMidflame.value).toBeCloseTo(10 * 0.1313664741590494, 12)
})
