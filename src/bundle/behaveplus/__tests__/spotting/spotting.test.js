/**
 * @file Tests the Bpx spotting module DAG configurations
 * @copyright 2020 Systems for Environmental Management
 * @author Collin D. Bevins, <cbevins@montana.com>
 * @license MIT
 * @version 0.1.0
 */
import { Bpx } from '../../Bpx.js'
import * as DagJest from '../../../../utils/matchers.js'

const value = DagJest.value
expect.extend({ value })

const dag = new Bpx()
dag.runConfigs([
  ['configure.fire.firelineIntensity', ['firelineIntensity', 'flameLength'][0]],
  ['configure.wind.speed', ['at10m', 'at20ft', 'atMidflame'][1]]
])

test('1: Validate stand-alone with firelineIntensity input results against BP6', () => {
  dag.clearSelected()
  dag.runConfigs([
    ['link.crownSpot', 'standAlone'],
    ['link.surfaceSpot', 'standAlone'],
    ['configure.fire.firelineIntensity', 'firelineIntensity']
  ])
  dag.runSelected([['spotting.surfaceFire.spotDistance.mountainTerrain', true]])

  let inputNodes = dag.requiredInputNodes()
  expect(inputNodes.length).toEqual(7)
  // console.log(DagJest.arrayList(inputNodes, 'Test 5 Input Nodes'))
  // Always require the site.terrain inputs
  expect(inputNodes).toContain(dag.get('site.terrain.spotSourceLocation'))
  expect(inputNodes).toContain(dag.get('site.terrain.ridgeValleyDistance'))
  expect(inputNodes).toContain(dag.get('site.terrain.ridgeValleyElevation'))
  // Always (except crown fire spotting) downwind canopy parms
  expect(inputNodes).toContain(dag.get('site.canopy.downwind.height'))
  expect(inputNodes).toContain(dag.get('site.canopy.downwind.isOpen'))
  expect(inputNodes).toContain(dag.get('site.wind.speed.at20ft'))
  // Surface fire spotting requires firelineIntensity or flameLength
  expect(inputNodes).toContain(dag.get('site.fire.observed.firelineIntensity'))

  // Burning pile adds burning pile flame height input
  dag.runSelected([['spotting.burningPile.spotDistance.mountainTerrain', true]])
  inputNodes = dag.requiredInputNodes()
  expect(inputNodes.length).toEqual(8)
  expect(inputNodes).toContain(dag.get('spotting.burningPile.flameHeight'))

  // Torching trees adds 4 inputs
  dag.runSelected([
    ['spotting.torchingTrees.spotDistance.mountainTerrain', true]
  ])
  inputNodes = dag.requiredInputNodes()
  expect(inputNodes.length).toEqual(12)
  expect(inputNodes).toContain(dag.get('spotting.torchingTrees.count'))
  expect(inputNodes).toContain(dag.get('spotting.torchingTrees.dbh'))
  expect(inputNodes).toContain(dag.get('spotting.torchingTrees.height'))
  expect(inputNodes).toContain(dag.get('spotting.torchingTrees.species'))

  // Crown fire
  dag.runSelected([['spotting.crownFire.spotDistance.mountainTerrain', true]])
  inputNodes = dag.requiredInputNodes()
  expect(inputNodes.length).toEqual(14)
  // Always require the site.terrain inputs
  expect(inputNodes).toContain(dag.get('site.terrain.spotSourceLocation'))
  expect(inputNodes).toContain(dag.get('site.terrain.ridgeValleyDistance'))
  expect(inputNodes).toContain(dag.get('site.terrain.ridgeValleyElevation'))
  // Always (except crown fire spotting) require downwind canopy parms
  expect(inputNodes).toContain(dag.get('site.canopy.downwind.height'))
  expect(inputNodes).toContain(dag.get('site.canopy.downwind.isOpen'))
  expect(inputNodes).toContain(dag.get('site.wind.speed.at20ft'))
  // Surface fire spotting requires firelineIntensity or flameLength
  expect(inputNodes).toContain(dag.get('site.fire.observed.firelineIntensity'))
  // Burning pile adds:
  expect(inputNodes).toContain(dag.get('spotting.burningPile.flameHeight'))
  // Torching trees add:
  expect(inputNodes).toContain(dag.get('spotting.torchingTrees.count'))
  expect(inputNodes).toContain(dag.get('spotting.torchingTrees.dbh'))
  expect(inputNodes).toContain(dag.get('spotting.torchingTrees.height'))
  expect(inputNodes).toContain(dag.get('spotting.torchingTrees.species'))
  // Crown fire adds:
  expect(inputNodes).toContain(dag.get('site.canopy.crown.totalHeight'))
  expect(inputNodes).toContain(dag.get('site.fire.crown.flameLength'))
})

test('2: Validate stand-alone with flameLength input results against BP6', () => {
  dag.clearSelected()
  dag.runConfigs([
    ['link.crownSpot', 'standAlone'],
    ['link.surfaceSpot', 'standAlone'],
    ['configure.fire.firelineIntensity', 'flameLength']
  ])
  dag.runSelected([['spotting.surfaceFire.spotDistance.mountainTerrain', true]])

  let inputNodes = dag.requiredInputNodes()
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

  // Burning pile adds burning pile flame height input
  dag.runSelected([['spotting.burningPile.spotDistance.mountainTerrain', true]])
  inputNodes = dag.requiredInputNodes()
  expect(inputNodes.length).toEqual(8)
  expect(inputNodes).toContain(dag.get('spotting.burningPile.flameHeight'))

  // Torching trees adds 4 inputs
  dag.runSelected([
    ['spotting.torchingTrees.spotDistance.mountainTerrain', true]
  ])
  inputNodes = dag.requiredInputNodes()
  expect(inputNodes.length).toEqual(12)
  expect(inputNodes).toContain(dag.get('spotting.torchingTrees.count'))
  expect(inputNodes).toContain(dag.get('spotting.torchingTrees.dbh'))
  expect(inputNodes).toContain(dag.get('spotting.torchingTrees.height'))
  expect(inputNodes).toContain(dag.get('spotting.torchingTrees.species'))

  // Crown fire
  dag.runSelected([['spotting.crownFire.spotDistance.mountainTerrain', true]])
  inputNodes = dag.requiredInputNodes()
  expect(inputNodes.length).toEqual(14)
  expect(inputNodes).toContain(dag.get('site.canopy.crown.totalHeight'))
  expect(inputNodes).toContain(dag.get('site.fire.observed.flameLength'))

  // Validate results
  const location = dag.get('site.terrain.spotSourceLocation')
  const isOpen = dag.get('site.canopy.downwind.isOpen')
  dag.runInputs([
    // Inputs arranged in BP6 order...
    // Fuel/Vegetation, Overstory
    ['site.canopy.crown.totalHeight', [80]],
    ['site.canopy.downwind.height', [60]],
    ['site.canopy.downwind.isOpen', [false, true]], // depth = 11
    ['spotting.torchingTrees.height', [80]],
    ['spotting.torchingTrees.species', ['PSME']],
    ['spotting.torchingTrees.dbh', [36]],
    // Weather
    ['site.wind.speed.at20ft', [88 * 10]],
    // Terrain
    ['site.terrain.ridgeValleyElevation', [1000]],
    ['site.terrain.ridgeValleyDistance', [5280]],
    [location, ['ridgeTop', 'midslopeWindward', 'valleyBottom', 'midslopeLeeward']],
    // Fire
    ['site.fire.observed.flameLength', [10]],
    ['spotting.burningPile.flameHeight', [20]],
    ['spotting.torchingTrees.count', [5]],
    ['site.fire.crown.flameLength', [40]]
  ])

  expect(
    dag.runIndices([
      [location, 'ridgeTop'],
      [isOpen, false]
    ])).toEqual([0])
  expect(
    dag.runIndices([
      [location, 'ridgeTop'],
      [isOpen, true]
    ])).toEqual([4])
  expect(
    dag.runIndices([
      [location, 'midslopeWindward'],
      [isOpen, false]
    ])).toEqual([1])
  expect(
    dag.runIndices([
      [location, 'midslopeWindward'],
      [isOpen, true]
    ])).toEqual([5])
  expect(
    dag.runIndices([
      [location, 'valleyBottom'],
      [isOpen, false]
    ])).toEqual([2])
  expect(
    dag.runIndices([
      [location, 'valleyBottom'],
      [isOpen, true]
    ])).toEqual([6])
  expect(
    dag.runIndices([
      [location, 'midslopeLeeward'],
      [isOpen, false]
    ])).toEqual([3])
  expect(
    dag.runIndices([
      [location, 'midslopeLeeward'],
      [isOpen, true]
    ])).toEqual([7])

  expect(dag.runIndices([[location, 'ridgeTop']])).toEqual([0, 4])
  expect(dag.runIndices([[location, 'midslopeLeeward']])).toEqual([3, 7])

  expect(dag.runIndices([[location, 'junk']])).toEqual([])

  const results = {
    torchingTrees: {
      ridgeTop: { closed: 1740.434066, open: 2111.270405 },
      midslopeWindward: { closed: 1672.439664, open: 2062.939851 },
      valleyBottom: { closed: 1467.096496, open: 1803.761828 },
      midslopeLeeward: { closed: 1530.841898, open: 1858.727335 }
    },
    burningPile: {
      ridgeTop: { closed: 578.365634, open: 770.106324 },
      midslopeWindward: { closed: 529.950082, open: 710.560639 },
      valleyBottom: { closed: 474.811843, open: 633.867748 },
      midslopeLeeward: { closed: 513.869098, open: 682.109524 }
    },
    crownFire: {
      ridgeTop: { closed: 881.615994, open: 881.615994 },
      midslopeWindward: { closed: 816.907774, open: 816.907774 },
      valleyBottom: { closed: 726.989367, open: 726.989367 },
      midslopeLeeward: { closed: 779.67935, open: 779.67935 }
    },
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
          results[nodeKey][locationKey][openKey], 2,
          `'${nodeKey}'-'${locationKey}'-'${openKey}'`
        )
      })
    })
  })
})

test('3: Validate stand-alone surface fire spotting with flameLength input results against BP6', () => {
  dag.clearSelected()
  dag.runConfigs([
    ['link.crownSpot', 'standAlone'],
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
})
