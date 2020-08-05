/**
 * @file Tests the Bpx spotting module DAG configurations
 * @copyright 2020 Systems for Environmental Management
 * @author Collin D. Bevins, <cbevins@montana.com>
 * @license OSL-3.0 Open Software License v. 3.0
 * @version 0.1.0
 */
import { Bpx } from '../../Bpx.js'
import * as DagJest from '../../../../utils/matchers.js'
import * as Spot from '../../equations/Spotting.js'

const value = DagJest.value
expect.extend({ value })

const dag = new Bpx()
dag.runConfigs([
  ['link.surfaceSpot', 'linkedToSurfaceFire'],
  ['configure.fire.firelineIntensity', ['firelineIntensity', 'flameLength'][0]],
  ['configure.wind.speed', ['at10m', 'at20ft', 'atMidflame'][1]]
])

test('1: Surface fire spotting', () => {
  dag.clearSelected()
  dag.runConfigs([['link.surfaceSpot', 'standAlone']])

  // When linked to surfaceFire, bound to 'surface.weighted.fire.firelineIntensity'
  // Currently in stand-alone mode, so linked to 'site.fire.observed.firelineIntensity'
  dag.runSelected([['spotting.surfaceFire.firelineIntensity', true]])
  let inputNodes = dag.requiredInputNodes()
  // console.log(DagJest.arrayList(inputNodes, 'INPUTS:'))
  expect(inputNodes.length).toEqual(1)
  expect(inputNodes).toContain(dag.get('site.fire.observed.firelineIntensity'))

  // Linking to surfaceFire requires a lot more inputs
  dag.runConfigs([['link.surfaceSpot', 'linkedToSurfaceFire']])
  inputNodes = dag.requiredInputNodes()
  expect(inputNodes.length).toEqual(12)
  expect(inputNodes).toContain(dag.get('surface.primary.fuel.model.catalogKey'))
  expect(inputNodes).toContain(dag.get('site.moisture.dead.tl1h'))

  // Back to stand-alone
  dag.runConfigs([['link.surfaceSpot', 'standAlone']])
  inputNodes = dag.requiredInputNodes()
  expect(inputNodes.length).toEqual(1)
  expect(inputNodes).toContain(dag.get('site.fire.observed.firelineIntensity'))

  // firebrand.height requires 'spotting.surfaceFire.firelineIntensity', 'site.wind.speed.at20ft'
  dag.runSelected([['spotting.surfaceFire.firebrand.height', true]])
  inputNodes = dag.requiredInputNodes()
  expect(inputNodes.length).toEqual(2)
  expect(inputNodes).toContain(dag.get('site.fire.observed.firelineIntensity'))
  expect(inputNodes).toContain(dag.get('site.wind.speed.at20ft'))

  // firebrand.drift requires 'spotting.surfaceFire.firebrand.height', 'site.wind.speed.at20ft',
  // but no new inputs
  dag.runSelected([['spotting.surfaceFire.firebrand.drift', true]])
  inputNodes = dag.requiredInputNodes()
  expect(inputNodes.length).toEqual(2)
  expect(inputNodes).toContain(dag.get('site.fire.observed.firelineIntensity'))
  expect(inputNodes).toContain(dag.get('site.wind.speed.at20ft'))

  // Requires 'spotting.surfaceFire.firebrand.height',  'site.canopy.downwind.appliedHeight',
  // the letter which requires site.canopy.downwind.{height|isOpen}
  dag.runSelected([['spotting.surfaceFire.firebrand.criticalCoverHeight', true]])
  inputNodes = dag.requiredInputNodes()
  // console.log(DagJest.arrayList(inputNodes, 'Inputs'))
  expect(inputNodes.length).toEqual(4)
  expect(inputNodes).toContain(dag.get('site.fire.observed.firelineIntensity'))
  expect(inputNodes).toContain(dag.get('site.wind.speed.at20ft'))
  expect(inputNodes).toContain(dag.get('site.canopy.downwind.height'))
  expect(inputNodes).toContain(dag.get('site.canopy.downwind.isOpen'))

  // spotDistance.flatTerrain requires 'spotting.surfaceFire.firebrand.height',
  // 'spotting.surfaceFire.firebrand.criticalCoverHeight', and 'site.wind.speed.at20ft',
  // but no new inputs
  dag.runSelected([['spotting.surfaceFire.spotDistance.flatTerrain', true]])
  inputNodes = dag.requiredInputNodes()
  expect(inputNodes.length).toEqual(4)
  expect(inputNodes).toContain(dag.get('site.fire.observed.firelineIntensity'))
  expect(inputNodes).toContain(dag.get('site.wind.speed.at20ft'))
  expect(inputNodes).toContain(dag.get('site.canopy.downwind.height'))
  expect(inputNodes).toContain(dag.get('site.canopy.downwind.isOpen'))

  // Requires 'spotting.surfaceFire.spotDistance.flatTerrain', 'spotting.surfaceFire.firebrand.drift',
  // but no new inputs
  dag.runSelected([['spotting.surfaceFire.spotDistance.flatTerrainWithDrift', true]])
  inputNodes = dag.requiredInputNodes()
  expect(inputNodes.length).toEqual(4)
  expect(inputNodes).toContain(dag.get('site.fire.observed.firelineIntensity'))
  expect(inputNodes).toContain(dag.get('site.wind.speed.at20ft'))
  expect(inputNodes).toContain(dag.get('site.canopy.downwind.height'))
  expect(inputNodes).toContain(dag.get('site.canopy.downwind.isOpen'))

  // Selecting spotting distance on mountain terrain requires
  // spot source location, and ridge-to-valley distance and elevation
  dag.runSelected([['spotting.surfaceFire.spotDistance.mountainTerrain', true]])
  inputNodes = dag.requiredInputNodes()
  expect(inputNodes.length).toEqual(7)
  expect(inputNodes).toContain(dag.get('site.fire.observed.firelineIntensity'))
  expect(inputNodes).toContain(dag.get('site.wind.speed.at20ft'))
  expect(inputNodes).toContain(dag.get('site.canopy.downwind.height'))
  expect(inputNodes).toContain(dag.get('site.canopy.downwind.isOpen'))
  expect(inputNodes).toContain(dag.get('site.terrain.spotSourceLocation'))
  expect(inputNodes).toContain(dag.get('site.terrain.ridgeValleyDistance'))
  expect(inputNodes).toContain(dag.get('site.terrain.ridgeValleyElevation'))
})

test('7: Validate stand-alone surface fire spotting with flameLength input results against BP6', () => {
  dag.clearSelected()
  dag.runConfigs([
    ['link.surfaceSpot', 'standAlone'],
    ['configure.fire.firelineIntensity', 'flameLength']
  ])
  dag.runSelected([['spotting.surfaceFire.spotDistance.mountainTerrain', true]])

  const inputNodes = dag.requiredInputNodes()
  expect(inputNodes.length).toEqual(7)
  // console.log(DagJest.arrayList(inputNodes, 'Test 6 Input Nodes'))
  // Always require the site.terrain inputs
  expect(inputNodes).toContain(dag.get('site.terrain.spotSourceLocation'))
  expect(inputNodes).toContain(dag.get('site.terrain.ridgeValleyDistance'))
  expect(inputNodes).toContain(dag.get('site.terrain.ridgeValleyElevation'))
  // Always (except crown fire spotting) downwind canopy parms
  expect(inputNodes).toContain(dag.get('site.canopy.downwind.height'))
  expect(inputNodes).toContain(dag.get('site.canopy.downwind.isOpen'))
  expect(inputNodes).toContain(dag.get('site.wind.speed.at20ft'))
  // Surface fire spotting requires firelineIntensity or flameLength
  expect(inputNodes).toContain(dag.get('site.fire.observed.flameLength'))

  // Validate results
  const location = dag.get('site.terrain.spotSourceLocation')
  const isOpen = dag.get('site.canopy.downwind.isOpen')
  dag.runInputs([
    // Inputs arranged in BP6 order...
    // Fuel/Vegetation, Overstory
    ['site.canopy.downwind.height', [60]],
    ['site.canopy.downwind.isOpen', [false, true]], // depth = 11
    // Weather
    ['site.wind.speed.at20ft', [88 * 10]],
    // Terrain
    ['site.terrain.ridgeValleyElevation', [1000]],
    ['site.terrain.ridgeValleyDistance', [5280]],
    [location, ['ridgeTop', 'midslopeWindward', 'valleyBottom', 'midslopeLeeward']],
    // Fire
    ['site.fire.observed.flameLength', [10]]
  ])

  const results = {
    surfaceFire: {
      ridgeTop: { closed: 1155.470325, open: 1346.573583 },
      midslopeWindward: { closed: 1082.484627, open: 1271.729868 },
      valleyBottom: { closed: 958.108061, open: 1121.831362 },
      midslopeLeeward: { closed: 1018.864376, open: 1185.746013 }
    }
  }

  Object.keys(results).forEach(nodeKey => {
    const node = dag.get(`spotting.${nodeKey}.spotDistance.mountainTerrain`)
    Object.keys(results[nodeKey]).forEach(locationKey => {
      Object.keys(results[nodeKey][locationKey]).forEach(openKey => {
        const idxArray = dag.runIndices([
          [location, locationKey],
          [isOpen, openKey === 'open']
        ])
        expect(idxArray.length).toEqual(1)
        const idx = idxArray[0]
        expect(dag.runValue(node, idx)).toBeCloseTo(
          results[nodeKey][locationKey][openKey], 5,
          `'${nodeKey}'-'${locationKey}'-'${openKey}'`
        )
      })
    })
  })

  // Coverage test
  expect(Spot.surfaceFireFirebrandHeight(0.0001, 0.0001)).toBeCloseTo(277.2528, 2)
  expect(Spot.surfaceFireFirebrandHeight(10000, 0.0001)).toBeCloseTo(2772528.906, 2)
})
