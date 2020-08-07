import { Bpx } from '../../Bpx.js'
import * as crownSpot from '../../equations/CrownSpotting.js'
import * as DagJest from '../../../../utils/matchers.js'

const value = DagJest.value
expect.extend({ value })

test('1: Crown fire with zero flame length', () => {
  const dag = new Bpx()
  dag.runConfigs([
    ['link.crownSpot', 'standAlone'],
    ['configure.fire.firelineIntensity', 'flameLength'],
    ['configure.wind.speed', 'at20ft']
  ])

  const node = dag.get('spotting.crownFire.spotDistance.mountainTerrain')
  dag.runSelected([['spotting.crownFire.spotDistance.mountainTerrain', true]])

  const inputNodes = dag.requiredInputNodes()
  expect(inputNodes.length).toEqual(6)
  // Always require the site.terrain inputs
  expect(inputNodes).toContain(dag.get('site.canopy.crown.totalHeight'))
  expect(inputNodes).toContain(dag.get('site.wind.speed.at20ft'))
  expect(inputNodes).toContain(dag.get('site.terrain.ridgeValleyElevation'))
  expect(inputNodes).toContain(dag.get('site.terrain.ridgeValleyDistance'))
  expect(inputNodes).toContain(dag.get('site.terrain.spotSourceLocation'))
  expect(inputNodes).toContain(dag.get('site.fire.crown.flameLength'))

  // Zero canopy height
  dag.runInputs([
    // Inputs arranged in BP6 order...
    ['site.canopy.crown.totalHeight', [0]],
    ['site.wind.speed.at20ft', [88 * 10]],
    ['site.terrain.ridgeValleyElevation', [1000]],
    ['site.terrain.ridgeValleyDistance', [5280]],
    ['site.terrain.spotSourceLocation', ['ridgeTop', 'midslopeWindward', 'valleyBottom', 'midslopeLeeward']],
    ['site.fire.crown.flameLength', [40]]
  ])
  expect(dag.resultValue(node, 0)).toBeCloseTo(0, 12)
  expect(dag.resultValue(node, 1)).toBeCloseTo(0, 12)
  expect(dag.resultValue(node, 2)).toBeCloseTo(0, 12)
  expect(dag.resultValue(node, 3)).toBeCloseTo(0, 12)

  // Zero flame length
  dag.runInputs([
    ['site.canopy.crown.totalHeight', [80]],
    ['site.wind.speed.at20ft', [880]],
    ['site.fire.crown.flameLength', [0]]
  ])
  expect(dag.resultValue(node, 0)).toBeCloseTo(0, 12)
  expect(dag.resultValue(node, 1)).toBeCloseTo(0, 12)
  expect(dag.resultValue(node, 2)).toBeCloseTo(0, 12)
  expect(dag.resultValue(node, 3)).toBeCloseTo(0, 12)

  // Zero wind speed
  dag.runInputs([
    ['site.canopy.crown.totalHeight', [80]],
    ['site.wind.speed.at20ft', [0]],
    ['site.fire.crown.flameLength', [40]]
  ])
  expect(dag.resultValue(node, 0)).toBeCloseTo(0, 12)
  expect(dag.resultValue(node, 1)).toBeCloseTo(0, 12)
  expect(dag.resultValue(node, 2)).toBeCloseTo(0, 12)
  expect(dag.resultValue(node, 3)).toBeCloseTo(0, 12)
})

test('2: drift()', () => {
  expect(crownSpot.drift(0, 1, 2)).toEqual(0)
  expect(crownSpot.drift(1, 0, 2)).toEqual(0)
  expect(crownSpot.drift(1, 2, 0)).toEqual(0)
})

test('3: dropout()', () => {
  expect(() => { crownSpot.dropout(0, 10, 10) }).toThrow('dropout() exceeded 50000 layers')
  expect(() => { crownSpot.dropout(10, 0, 10) }).toThrow('dropout() exceeded 50000 layers')
  expect(crownSpot.dropout(10, 10, 0)).toEqual([
    39.97370284280681, 2783.1059454742726, 13222])
  // if eta >= 1944, plume cannot lift particle of that size
  expect(crownSpot.dropout(10, 10, 1944)).toEqual([0, 0, 0])
})

test('4: fireIntensityAlbini()', () => {
  expect(crownSpot.fireIntensityAlbini(0, 10, 10)).toEqual(0)
  expect(crownSpot.fireIntensityAlbini(10, 0, 10)).toEqual(0)
  expect(crownSpot.fireIntensityAlbini(10, 10, 0)).toEqual(0)
  expect(crownSpot.fireIntensityAlbini(10, 10, 10)).toBeCloseTo(69342.2160, 2)
})

test('5: flameLengthThomas()', () => {
  expect(crownSpot.flameLengthThomas(0)).toEqual(0)
  expect(crownSpot.flameLengthThomas(100)).toBeCloseTo(4.308869380063768, 2)
})

test('6: flameHeightAlbini()', () => {
  expect(crownSpot.flameHeightAlbini(1001, 0.11, 0.11)).toBeCloseTo(4.901349909, 2)
  expect(crownSpot.flameHeightAlbini(1001, 0.10, 0.10)).toBeCloseTo(5.227671269, 2)
  expect(crownSpot.flameHeightAlbini(1001, 0.001, 0.001)).toBeCloseTo(199.702, 2)
  expect(crownSpot.flameHeightAlbini(1001, 0.00001, 0.00001)).toBeCloseTo(12063.386, 2)
})
