/* eslint-disable no-unused-vars */
/**
 * @file Tests the Bpx spotting module DAG configurations
 * @copyright 2020 Systems for Environmental Management
 * @author Collin D. Bevins, <cbevins@montana.com>
 * @license OSL-3.0 Open Software License v. 3.0
 * @version 0.1.0
 */
import { Bpx } from '../../Bpx.js'
import * as DagJest from '../../../../utils/matchers.js'

const value = DagJest.value
expect.extend({ value })

const dag = new Bpx()
dag.runConfigs([
  ['link.crownSpot', 'linkedToCrownFire'],
  ['configure.fire.firelineIntensity', ['firelineIntensity', 'flameLength'][1]],
  ['configure.wind.speed', ['at10m', 'at20ft', 'atMidflame'][1]]
])

test('1: Crown fire spotting configuration', () => {
  dag.clearSelected()
  dag.runConfigs([['link.crownSpot', 'standAlone']])
  // Critical cover height is fixed at 0
  dag.runSelected([['spotting.crownFire.firebrand.criticalCoverHeight', true]])
  let inputNodes = dag.requiredInputNodes()
  expect(inputNodes.length).toEqual(0)

  // Currently in stand-alone mode
  dag.runSelected([['spotting.crownFire.firelineIntensity', true]])
  inputNodes = dag.requiredInputNodes()
  expect(inputNodes.length).toEqual(1)
  expect(inputNodes).toContain(dag.get('site.fire.crown.flameLength'))

  // Linking to crownFire requires a lot more inputs
  dag.runConfigs([['link.crownSpot', 'linkedToCrownFire']])
  inputNodes = dag.requiredInputNodes()
  expect(inputNodes.length).toEqual(11)

  // Linking to surfaceFire requires a lot more inputs
  dag.runConfigs([
    ['link.crownFire', 'linkedToSurfaceFire'],
    ['link.crownSpot', 'linkedToCrownFire']
  ])
  inputNodes = dag.requiredInputNodes()
  expect(inputNodes.length).toEqual(11)

  // Back to stand-alone
  dag.runConfigs([['link.crownSpot', 'standAlone']])
  inputNodes = dag.requiredInputNodes()
  expect(inputNodes.length).toEqual(1)
  expect(inputNodes).toContain(dag.get('site.fire.crown.flameLength'))

  dag.runSelected([['spotting.crownFire.firebrandObject', true]])
  inputNodes = dag.requiredInputNodes()
  expect(inputNodes.length).toEqual(3)
  expect(inputNodes).toContain(dag.get('site.fire.crown.flameLength'))
  expect(inputNodes).toContain(dag.get('site.canopy.crown.totalHeight'))
  expect(inputNodes).toContain(dag.get('site.wind.speed.at20ft'))

  // Firebrand height, drift, and distance over flat terrain need the firebrandObject, but no new inputs
  dag.runSelected([
    ['spotting.crownFire.firebrand.height', true],
    ['spotting.crownFire.firebrand.drift', true],
    ['spotting.crownFire.spotDistance.flatTerrain', true],
    ['spotting.crownFire.spotDistance.flatTerrainWithDrift', true]
  ])
  inputNodes = dag.requiredInputNodes()
  expect(inputNodes.length).toEqual(3)
  expect(inputNodes).toContain(dag.get('site.fire.crown.flameLength'))
  expect(inputNodes).toContain(dag.get('site.canopy.crown.totalHeight'))
  expect(inputNodes).toContain(dag.get('site.wind.speed.at20ft'))

  // Selecting spotting distance on mountain terrain requires
  // spot source location, and ridge-to-valley distance and elevation
  dag.runSelected([['spotting.crownFire.spotDistance.mountainTerrain', true]])
  inputNodes = dag.requiredInputNodes()
  expect(inputNodes.length).toEqual(6)
  expect(inputNodes).toContain(dag.get('site.fire.crown.flameLength'))
  expect(inputNodes).toContain(dag.get('site.canopy.crown.totalHeight'))
  expect(inputNodes).toContain(dag.get('site.wind.speed.at20ft'))
  expect(inputNodes).toContain(dag.get('site.terrain.spotSourceLocation'))
  expect(inputNodes).toContain(dag.get('site.terrain.ridgeValleyDistance'))
  expect(inputNodes).toContain(dag.get('site.terrain.ridgeValleyElevation'))
})

test('2: Validate stand-alone crown fire results against BP6', () => {
  dag.clearSelected()
  dag.runConfigs([
    ['link.crownSpot', 'standAlone'],
    ['configure.fire.firelineIntensity', 'flameLength']
  ])
  dag.runSelected([
    ['spotting.crownFire.firebrand.height', true],
    ['spotting.crownFire.firebrand.drift', true],
    ['spotting.crownFire.spotDistance.flatTerrain', true],
    ['spotting.crownFire.spotDistance.flatTerrainWithDrift', true],
    ['spotting.crownFire.spotDistance.mountainTerrain', true]
  ])

  const inputNodes = dag.requiredInputNodes()
  expect(inputNodes.length).toEqual(6)
  // console.log(DagJest.arrayList(inputNodes, 'Test 6 Input Nodes'))
  // Always require the site.terrain inputs
  expect(inputNodes).toContain(dag.get('site.canopy.crown.totalHeight'))
  expect(inputNodes).toContain(dag.get('site.wind.speed.at20ft'))
  expect(inputNodes).toContain(dag.get('site.terrain.ridgeValleyElevation'))
  expect(inputNodes).toContain(dag.get('site.terrain.ridgeValleyDistance'))
  expect(inputNodes).toContain(dag.get('site.terrain.spotSourceLocation'))
  expect(inputNodes).toContain(dag.get('site.fire.crown.flameLength'))

  // Validate results
  const location = dag.get('site.terrain.spotSourceLocation')
  // NOTE: Crown fire does not use open-closed, so its not in the results
  const isOpen = dag.get('site.canopy.downwind.isOpen')
  dag.runInputs([
    // Inputs arranged in BP6 order...
    ['site.canopy.crown.totalHeight', [80]],
    ['site.wind.speed.at20ft', [88 * 10]],
    ['site.terrain.ridgeValleyElevation', [1000]],
    ['site.terrain.ridgeValleyDistance', [5280]],
    [location, ['ridgeTop', 'midslopeWindward', 'valleyBottom', 'midslopeLeeward']],
    ['site.fire.crown.flameLength', [40]]
  ])

  // const results = {
  //   crownFire: {
  //     ridgeTop: { closed: 881.615994, open: 881.615994 },
  //     midslopeWindward: { closed: 816.907774, open: 816.907774 },
  //     valleyBottom: { closed: 726.989367, open: 726.989367 },
  //     midslopeLeeward: { closed: 779.67935, open: 779.67935 }
  //   },
  //   firebrandHt: { 157.737995
  //    flameHeightAboveCanopy: 22.249698
  // }

  expect(dag.get('spotting.crownFire.firebrand.height').value).toBeCloseTo(157.737995, 2)
  const node = dag.get('spotting.crownFire.spotDistance.mountainTerrain')
  expect(dag.runValue(node, 0)).toBeCloseTo(881.615994, 2)
  expect(dag.runValue(node, 1)).toBeCloseTo(816.907774, 2)
  expect(dag.runValue(node, 2)).toBeCloseTo(726.989367, 2)
  expect(dag.runValue(node, 3)).toBeCloseTo(779.67935, 2)
})
