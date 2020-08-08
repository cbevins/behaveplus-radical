/* eslint-disable no-unused-vars */
import { Dag } from '../Dag.js'
import * as Dna from '../../../behaveplus/BpxDna.js'
import * as DagJest from '../../../../utils/matchers.js'

const value = DagJest.value
expect.extend({ value })

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

const moduleKeys = [
  'module.surfaceFire',
  'module.surfaceSpot',
  'module.crownFire',
  'module.crownSpot',
  'module.fireEllipse',
  'module.fireContain',
  'module.scorchHeight',
  'module.treeMortality',
  'module.spotting',
  'module.ignitionProbability'
]

const linkKeys = [
  'link.crownFire', // 'standAlone' or 'linkedToSurfaceFire'
  'link.crownSpot', // 'standAlone' or 'linkedToCrownFire'
  'link.fireEllipse', // 'standAlone' or 'linkedToSurfaceFire'
  'link.fireContain', // 'standAlone' or 'linkedToFireEllipse'
  'link.scorchHeight', // 'standAlone' or 'linkedToSurfaceFire'
  'link.surfaceSpot', // 'standAlone' or 'linkedToSurfaceFire'
  'link.treeMortality' // 'standAlone' or 'linkedToScorchHeight'
]

// CONVENIENCE
function enabledNodes (dag) { return dag.dna.node.filter(node => node.isEnabled) }
function setModules (dag, value) { dag.setModules(moduleKeys.map(key => [key, value])) }

test('1: Default Module and Link values', () => {
  const dag = new Dag(Dna)
  dag.setConfigs(config) // Standard configuration
  moduleKeys.forEach(key => { expect(dag.get(key).value).toEqual('active') })
  linkKeys.forEach(key => { expect(dag.get(key).value).not.toEqual('standAlone') })
})

test('2: Direct setting of module and link values (dont try this at home)', () => {
  const dag = new Dag(Dna)
  dag.setConfigs(config) // Standard configuration
  moduleKeys.forEach(key => { dag.get(key).setValue('inactive') })
  moduleKeys.forEach(key => { expect(dag.get(key).value).toEqual('inactive') })

  moduleKeys.forEach(key => { dag.get(key).setValue('active') })
  moduleKeys.forEach(key => { expect(dag.get(key).value).toEqual('active') })
})

test('3: setModules(dag), Dag.setModules(), Dag.module()', () => {
  const dag = new Dag(Dna)
  dag.setConfigs(config) // Standard configuration
  // Start with no active modules
  setModules(dag, 'inactive')
  moduleKeys.forEach(key => { expect(dag.get(key).value).toEqual('inactive') })
  linkKeys.forEach(key => { expect(dag.get(key).value).toEqual('standAlone') })

  // Only 71 site.*, 4 docs.*, 10 configure.*, 7 link.*, and 10 module.* Nodes should be active
  expect(enabledNodes(dag).length).toEqual(102)

  // Activating tree mortality enables 4 additional Nodes
  dag.setModules([['module.treeMortality', 'active']])
  expect(dag.get('module.treeMortality').value).toEqual('active')
  expect(dag.get('link.treeMortality').value).toEqual('standAlone')
  expect(dag.get('scorch.height').isEnabled).toEqual(false)
  expect(enabledNodes(dag).length).toEqual(106)

  // Activating scorchHeight enables 1 additional Node and links with treeMortality
  dag.setModules([['module.scorchHeight', 'active']])
  expect(dag.get('module.scorchHeight').value).toEqual('active')
  expect(dag.get('link.scorchHeight').value).toEqual('standAlone')
  expect(dag.get('module.treeMortality').value).toEqual('active')
  expect(dag.get('link.treeMortality').value).toEqual('linkedToScorchHeight')
  expect(enabledNodes(dag).length).toEqual(107)

  // Activating surfaceSpot enables a 7 more Nodes with no additional links
  dag.setModules([['module.surfaceSpot', 'active']])
  expect(dag.get('module.surfaceSpot').value).toEqual('active')
  expect(dag.get('module.scorchHeight').value).toEqual('active')
  expect(dag.get('link.scorchHeight').value).toEqual('standAlone')
  expect(dag.get('module.treeMortality').value).toEqual('active')
  expect(dag.get('link.treeMortality').value).toEqual('linkedToScorchHeight')
  expect(enabledNodes(dag).length).toEqual(114)

  // Activating surfaceFire enables 686 more Nodes
  // and links it with surfaceSpot, scorchHeight and treeMortality
  dag.setModules([['module.surfaceFire', 'active']])
  expect(dag.get('module.surfaceFire').value).toEqual('active')
  expect(dag.get('module.surfaceSpot').value).toEqual('active')
  expect(dag.get('link.surfaceSpot').value).toEqual('linkedToSurfaceFire')
  expect(dag.get('module.scorchHeight').value).toEqual('active')
  expect(dag.get('link.scorchHeight').value).toEqual('linkedToSurfaceFire')
  expect(dag.get('module.treeMortality').value).toEqual('active')
  expect(dag.get('link.treeMortality').value).toEqual('linkedToScorchHeight')
  expect(enabledNodes(dag).length).toEqual(800)

  // Activating crownFire enables 320 more Nodes and links it with surfaceFire
  dag.setModules([['module.crownFire', 'active']])
  expect(dag.get('module.crownFire').value).toEqual('active')
  expect(dag.get('link.crownFire').value).toEqual('linkedToSurfaceFire')
  expect(dag.get('module.surfaceFire').value).toEqual('active')
  expect(dag.get('module.surfaceSpot').value).toEqual('active')
  expect(dag.get('link.surfaceSpot').value).toEqual('linkedToSurfaceFire')
  expect(dag.get('module.scorchHeight').value).toEqual('active')
  expect(dag.get('link.scorchHeight').value).toEqual('linkedToSurfaceFire')
  expect(dag.get('module.treeMortality').value).toEqual('active')
  expect(dag.get('link.treeMortality').value).toEqual('linkedToScorchHeight')
  expect(enabledNodes(dag).length).toEqual(1120)

  // Activating crownSpot enables 8 more Nodes and links it with crownFire
  dag.setModules([['module.crownSpot', 'active']])
  expect(dag.get('module.crownSpot').value).toEqual('active')
  expect(dag.get('link.crownSpot').value).toEqual('linkedToCrownFire')
  expect(dag.get('module.crownFire').value).toEqual('active')
  expect(dag.get('link.crownFire').value).toEqual('linkedToSurfaceFire')
  expect(dag.get('module.surfaceFire').value).toEqual('active')
  expect(dag.get('module.surfaceSpot').value).toEqual('active')
  expect(dag.get('link.surfaceSpot').value).toEqual('linkedToSurfaceFire')
  expect(dag.get('module.scorchHeight').value).toEqual('active')
  expect(dag.get('link.scorchHeight').value).toEqual('linkedToSurfaceFire')
  expect(dag.get('module.treeMortality').value).toEqual('active')
  expect(dag.get('link.treeMortality').value).toEqual('linkedToScorchHeight')
  expect(enabledNodes(dag).length).toEqual(1128)

  // Activating spotting enables 19 more Nodes and no new links
  dag.setModules([['module.spotting', 'active']])
  expect(dag.get('module.spotting').value).toEqual('active')
  expect(dag.get('module.crownSpot').value).toEqual('active')
  expect(dag.get('link.crownSpot').value).toEqual('linkedToCrownFire')
  expect(dag.get('module.crownFire').value).toEqual('active')
  expect(dag.get('link.crownFire').value).toEqual('linkedToSurfaceFire')
  expect(dag.get('module.surfaceFire').value).toEqual('active')
  expect(dag.get('module.surfaceSpot').value).toEqual('active')
  expect(dag.get('link.surfaceSpot').value).toEqual('linkedToSurfaceFire')
  expect(dag.get('module.scorchHeight').value).toEqual('active')
  expect(dag.get('link.scorchHeight').value).toEqual('linkedToSurfaceFire')
  expect(dag.get('module.treeMortality').value).toEqual('active')
  expect(dag.get('link.treeMortality').value).toEqual('linkedToScorchHeight')
  expect(enabledNodes(dag).length).toEqual(1147)

  // Activating fireEllipse enables 67 more Nodes and links it to surfaceFire
  dag.setModules([['module.fireEllipse', 'active']])
  expect(dag.get('module.fireEllipse').value).toEqual('active')
  expect(dag.get('link.fireEllipse').value).toEqual('linkedToSurfaceFire')
  expect(dag.get('module.spotting').value).toEqual('active')
  expect(dag.get('module.crownSpot').value).toEqual('active')
  expect(dag.get('link.crownSpot').value).toEqual('linkedToCrownFire')
  expect(dag.get('module.crownFire').value).toEqual('active')
  expect(dag.get('link.crownFire').value).toEqual('linkedToSurfaceFire')
  expect(dag.get('module.surfaceFire').value).toEqual('active')
  expect(dag.get('module.surfaceSpot').value).toEqual('active')
  expect(dag.get('link.surfaceSpot').value).toEqual('linkedToSurfaceFire')
  expect(dag.get('module.scorchHeight').value).toEqual('active')
  expect(dag.get('link.scorchHeight').value).toEqual('linkedToSurfaceFire')
  expect(dag.get('module.treeMortality').value).toEqual('active')
  expect(dag.get('link.treeMortality').value).toEqual('linkedToScorchHeight')
  expect(enabledNodes(dag).length).toEqual(1214)

  // Activating ignitionProbability enables 5 more Nodes and no new links
  dag.setModules([['module.ignitionProbability', 'active']])
  expect(dag.get('module.ignitionProbability').value).toEqual('active')
  expect(dag.get('module.fireEllipse').value).toEqual('active')
  expect(dag.get('link.fireEllipse').value).toEqual('linkedToSurfaceFire')
  expect(dag.get('module.spotting').value).toEqual('active')
  expect(dag.get('module.crownSpot').value).toEqual('active')
  expect(dag.get('link.crownSpot').value).toEqual('linkedToCrownFire')
  expect(dag.get('module.crownFire').value).toEqual('active')
  expect(dag.get('link.crownFire').value).toEqual('linkedToSurfaceFire')
  expect(dag.get('module.surfaceFire').value).toEqual('active')
  expect(dag.get('module.surfaceSpot').value).toEqual('active')
  expect(dag.get('link.surfaceSpot').value).toEqual('linkedToSurfaceFire')
  expect(dag.get('module.scorchHeight').value).toEqual('active')
  expect(dag.get('link.scorchHeight').value).toEqual('linkedToSurfaceFire')
  expect(dag.get('module.treeMortality').value).toEqual('active')
  expect(dag.get('link.treeMortality').value).toEqual('linkedToScorchHeight')
  expect(enabledNodes(dag).length).toEqual(1219)

  // Activating fireContain enables 0 more Nodes and links it to fireEllipse
  dag.setModules([['module.fireContain', 'active']])
  expect(dag.get('module.fireContain').value).toEqual('active')
  expect(dag.get('link.fireContain').value).toEqual('linkedToFireEllipse')
  expect(dag.get('module.ignitionProbability').value).toEqual('active')
  expect(dag.get('module.fireEllipse').value).toEqual('active')
  expect(dag.get('link.fireEllipse').value).toEqual('linkedToSurfaceFire')
  expect(dag.get('module.spotting').value).toEqual('active')
  expect(dag.get('module.crownSpot').value).toEqual('active')
  expect(dag.get('link.crownSpot').value).toEqual('linkedToCrownFire')
  expect(dag.get('module.crownFire').value).toEqual('active')
  expect(dag.get('link.crownFire').value).toEqual('linkedToSurfaceFire')
  expect(dag.get('module.surfaceFire').value).toEqual('active')
  expect(dag.get('module.surfaceSpot').value).toEqual('active')
  expect(dag.get('link.surfaceSpot').value).toEqual('linkedToSurfaceFire')
  expect(dag.get('module.scorchHeight').value).toEqual('active')
  expect(dag.get('link.scorchHeight').value).toEqual('linkedToSurfaceFire')
  expect(dag.get('module.treeMortality').value).toEqual('active')
  expect(dag.get('link.treeMortality').value).toEqual('linkedToScorchHeight')
  expect(enabledNodes(dag).length).toEqual(1219)

  // De-activating ignitionProbability disables 5 Nodes and affects no links
  dag.setModules([['module.ignitionProbability', 'inactive']])
  expect(enabledNodes(dag).length).toEqual(1214)

  // De-activating spotting disables 19 Nodes and affects no links
  dag.setModules([['module.spotting', 'inactive']])
  expect(enabledNodes(dag).length).toEqual(1195)

  // De-activating fireContain disables 0 Nodes and affects 1 link to fireEllipse
  dag.setModules([['module.fireContain', 'inactive']])
  expect(dag.get('module.fireContain').value).toEqual('inactive')
  expect(dag.get('link.fireContain').value).toEqual('standAlone')
  expect(enabledNodes(dag).length).toEqual(1195)

  // De-activating surface fire disables 686 Nodes and 4 links to surfaceFire
  dag.setModules([['module.surfaceFire', 'inactive']])
  expect(enabledNodes(dag).length).toEqual(509)
  expect(dag.get('link.crownFire').value).toEqual('standAlone')
  expect(dag.get('link.crownSpot').value).toEqual('linkedToCrownFire')
  expect(dag.get('link.fireContain').value).toEqual('standAlone')
  expect(dag.get('link.fireEllipse').value).toEqual('standAlone')
  expect(dag.get('link.scorchHeight').value).toEqual('standAlone')
  expect(dag.get('link.surfaceSpot').value).toEqual('standAlone')
  expect(dag.get('link.treeMortality').value).toEqual('linkedToScorchHeight')

  // De-activating scorch height disables 1 Nodes and 1 link
  dag.setModules([['module.scorchHeight', 'inactive']])
  expect(enabledNodes(dag).length).toEqual(508)
  expect(dag.get('link.crownFire').value).toEqual('standAlone')
  expect(dag.get('link.crownSpot').value).toEqual('linkedToCrownFire')
  expect(dag.get('link.fireContain').value).toEqual('standAlone')
  expect(dag.get('link.fireEllipse').value).toEqual('standAlone')
  expect(dag.get('link.scorchHeight').value).toEqual('standAlone')
  expect(dag.get('link.surfaceSpot').value).toEqual('standAlone')
  expect(dag.get('link.treeMortality').value).toEqual('standAlone')

  // De-activating fire ellipse disables 67 Nodes
  dag.setModules([['module.fireEllipse', 'inactive']])
  expect(enabledNodes(dag).length).toEqual(441)
  expect(dag.get('link.crownFire').value).toEqual('standAlone')
  expect(dag.get('link.crownSpot').value).toEqual('linkedToCrownFire')
  expect(dag.get('link.fireContain').value).toEqual('standAlone')
  expect(dag.get('link.fireEllipse').value).toEqual('standAlone')
  expect(dag.get('link.scorchHeight').value).toEqual('standAlone')
  expect(dag.get('link.surfaceSpot').value).toEqual('standAlone')
  expect(dag.get('link.treeMortality').value).toEqual('standAlone')

  // De-activating crown fire disables 320 Nodes and 1 link
  dag.setModules([['module.crownFire', 'inactive']])
  expect(enabledNodes(dag).length).toEqual(121)
  expect(dag.get('link.crownFire').value).toEqual('standAlone')
  expect(dag.get('link.crownSpot').value).toEqual('standAlone')
  expect(dag.get('link.fireContain').value).toEqual('standAlone')
  expect(dag.get('link.fireEllipse').value).toEqual('standAlone')
  expect(dag.get('link.scorchHeight').value).toEqual('standAlone')
  expect(dag.get('link.surfaceSpot').value).toEqual('standAlone')
  expect(dag.get('link.treeMortality').value).toEqual('standAlone')

  // De-activating crown spotting disables 8 Nodes and no links
  dag.setModules([['module.crownSpot', 'inactive']])
  expect(enabledNodes(dag).length).toEqual(113)

  // De-activating surface spotting disables 7 Nodes and no links
  dag.setModules([['module.surfaceSpot', 'inactive']])
  expect(enabledNodes(dag).length).toEqual(106)

  // De-activating tree mortality disables 4 Nodes and no links
  dag.setModules([['module.treeMortality', 'inactive']])
  expect(enabledNodes(dag).length).toEqual(102)
})

test('3: Module selection', () => {
  const dag = new Dag(Dna)
  dag.setConfigs(config) // Standard configuration
  setModules(dag, 'inactive')
  expect(enabledNodes(dag).length).toEqual(102)

  // Part 1: activating surface fire spotting enables 7 Nodes in standAlone mode
  dag.runModules([['module.surfaceSpot', 'active']])
  expect(enabledNodes(dag).length).toEqual(109)

  dag.runSelected([['spotting.surfaceFire.spotDistance.mountainTerrain', true]])
  let inputNodes = dag.requiredInputNodes()
  expect(inputNodes.length).toEqual(8)
  expect(inputNodes).toContain(dag.get('site.wind.speed.atMidflame'))
  expect(inputNodes).toContain(dag.get('site.fire.observed.flameLength'))
  expect(inputNodes).toContain(dag.get('site.windSpeedAdjustmentFactor'))
  expect(inputNodes).toContain(dag.get('site.canopy.downwind.height'))
  expect(inputNodes).toContain(dag.get('site.canopy.downwind.isOpen'))
  expect(inputNodes).toContain(dag.get('site.terrain.spotSourceLocation'))
  expect(inputNodes).toContain(dag.get('site.terrain.ridgeValleyDistance'))
  expect(inputNodes).toContain(dag.get('site.terrain.ridgeValleyElevation'))

  // Part 2: activating surface fire link to surface spotting
  dag.runSelected([['surface.primary.fuel.fire.spreadRate', true]])
  // nothing changes since we haven't activated Surface Fire yet!
  expect(dag.requiredNodes().length).toEqual(21)
  inputNodes = dag.requiredInputNodes()
  expect(inputNodes.length).toEqual(8)

  dag.runModules([['module.surfaceFire', 'active']])
  inputNodes = dag.requiredInputNodes()
  console.log(inputNodes.reduce((acc, node) => acc + node.key + '\n', ''))
  // We have to add 1 fuel key, 5 moistures, 1 slope,
  // But, no longer need to input surface fire flameLength
  expect(inputNodes.length).toEqual(14)
  expect(inputNodes).not.toContain(dag.get('site.fire.observed.flameLength'))
})
