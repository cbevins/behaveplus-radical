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
  ['configure.fire.firelineIntensity', ['firelineIntensity', 'flameLength'][1]],
  ['configure.wind.speed', ['at10m', 'at20ft', 'atMidflame'][1]]
])

test('1: Torching trees spotting distance configuration', () => {
  dag.clearSelected()
  // Selecting downwind canopy applied ht requires its 2 inputs
  dag.runSelected([['site.canopy.downwind.appliedHeight', true]])
  let inputNodes = dag.requiredInputNodes()
  expect(inputNodes.length).toEqual(2)
  expect(inputNodes).toContain(dag.get('site.canopy.downwind.height'))
  expect(inputNodes).toContain(dag.get('site.canopy.downwind.isOpen'))

  // Selecting flameHeight or flameDuration requires tree species, dbh, count
  dag.runSelected([
    ['spotting.torchingTrees.flameHeight', true],
    ['spotting.torchingTrees.flameDuration', true]
  ])
  inputNodes = dag.requiredInputNodes()
  expect(inputNodes.length).toEqual(5)
  expect(inputNodes).toContain(dag.get('site.canopy.downwind.height'))
  expect(inputNodes).toContain(dag.get('site.canopy.downwind.isOpen'))
  expect(inputNodes).toContain(dag.get('spotting.torchingTrees.species'))
  expect(inputNodes).toContain(dag.get('spotting.torchingTrees.dbh'))
  expect(inputNodes).toContain(dag.get('spotting.torchingTrees.count'))

  // Selecting firebrand ht requires tree height
  dag.runSelected([
    ['spotting.torchingTrees.firebrand.height', true],
    ['spotting.torchingTrees.firebrand.criticalCoverHeight', true]
  ])
  inputNodes = dag.requiredInputNodes()
  expect(inputNodes.length).toEqual(6)
  expect(inputNodes).toContain(dag.get('site.canopy.downwind.height'))
  expect(inputNodes).toContain(dag.get('site.canopy.downwind.isOpen'))
  expect(inputNodes).toContain(dag.get('spotting.torchingTrees.species'))
  expect(inputNodes).toContain(dag.get('spotting.torchingTrees.dbh'))
  expect(inputNodes).toContain(dag.get('spotting.torchingTrees.count'))
  expect(inputNodes).toContain(dag.get('spotting.torchingTrees.height'))

  // firebrand drift is calculated, but no new inputs are required when it is selected
  dag.runSelected([['spotting.torchingTrees.firebrand.drift', true]])
  inputNodes = dag.requiredInputNodes()
  expect(inputNodes.length).toEqual(6)
  expect(inputNodes).toContain(dag.get('site.canopy.downwind.height'))
  expect(inputNodes).toContain(dag.get('site.canopy.downwind.isOpen'))
  expect(inputNodes).toContain(dag.get('spotting.torchingTrees.species'))
  expect(inputNodes).toContain(dag.get('spotting.torchingTrees.dbh'))
  expect(inputNodes).toContain(dag.get('spotting.torchingTrees.count'))
  expect(inputNodes).toContain(dag.get('spotting.torchingTrees.height'))

  // Selecting spotting distance on flat terrain requires wind speed at 20-ft
  dag.runSelected([
    ['spotting.torchingTrees.spotDistance.flatTerrain', true],
    ['spotting.torchingTrees.spotDistance.flatTerrainWithDrift', true]
  ])
  inputNodes = dag.requiredInputNodes()
  expect(inputNodes.length).toEqual(7)
  expect(inputNodes).toContain(dag.get('site.canopy.downwind.height'))
  expect(inputNodes).toContain(dag.get('site.canopy.downwind.isOpen'))
  expect(inputNodes).toContain(dag.get('spotting.torchingTrees.species'))
  expect(inputNodes).toContain(dag.get('spotting.torchingTrees.dbh'))
  expect(inputNodes).toContain(dag.get('spotting.torchingTrees.count'))
  expect(inputNodes).toContain(dag.get('spotting.torchingTrees.height'))
  expect(inputNodes).toContain(dag.get('site.wind.speed.at20ft'))

  // Selecting spotting distance on mountain terrain requires
  // spot source location, and ridge-to-valley distance and elevation
  dag.runSelected([['spotting.torchingTrees.spotDistance.mountainTerrain', true]])
  inputNodes = dag.requiredInputNodes()
  expect(inputNodes.length).toEqual(10)
  expect(inputNodes).toContain(dag.get('site.canopy.downwind.height'))
  expect(inputNodes).toContain(dag.get('site.canopy.downwind.isOpen'))
  expect(inputNodes).toContain(dag.get('spotting.torchingTrees.species'))
  expect(inputNodes).toContain(dag.get('spotting.torchingTrees.dbh'))
  expect(inputNodes).toContain(dag.get('spotting.torchingTrees.count'))
  expect(inputNodes).toContain(dag.get('spotting.torchingTrees.height'))
  expect(inputNodes).toContain(dag.get('site.wind.speed.at20ft'))
  expect(inputNodes).toContain(dag.get('site.terrain.spotSourceLocation'))
  expect(inputNodes).toContain(dag.get('site.terrain.ridgeValleyDistance'))
  expect(inputNodes).toContain(dag.get('site.terrain.ridgeValleyElevation'))
})
