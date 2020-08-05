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
  ['configure.fire.firelineIntensity', ['firelineIntensity', 'flameLength'][0]],
  ['configure.wind.speed', ['at10m', 'at20ft', 'atMidflame'][1]]
])

test('3. Crown fire spotting', () => {
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
  // console.log(inputNodes.map(node => node.key))
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
