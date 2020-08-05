import { Bpx } from '../Bpx.js'
import { configMinimalInput } from './testData.js'

import * as DagJest from '../../../utils/matchers.js'
const sig = DagJest.sig
const value = DagJest.value
expect.extend({ value, sig })

const dag = new Bpx()
dag.runConfigs(configMinimalInput)
const ros = dag.get('surface.primary.fuel.fire.spreadRate')
const catalogKey = dag.get('surface.primary.fuel.model.catalogKey')
const deadMoisture = dag.get('site.moisture.dead.category')
const liveMoisture = dag.get('site.moisture.live.category')
const slopeRatio = dag.get('site.slope.steepness.ratio')
const midflameWind = dag.get('site.wind.speed.atMidflame')

test('1: Casewise test', () => {
  dag.runSelected([[ros, true]])

  const requiredInputs = dag.requiredInputNodes()
  expect(requiredInputs.length).toEqual(5)
  // console.log(DagJest.arrayList(requiredInputs, 'Required Inputs:'))
  expect(requiredInputs).toContain(catalogKey)
  expect(requiredInputs).toContain(deadMoisture)
  expect(requiredInputs).toContain(liveMoisture)
  expect(requiredInputs).toContain(slopeRatio)
  expect(requiredInputs).toContain(midflameWind)

  const Inputs = [
    ['surface.primary.fuel.model.catalogKey', ['10', '124']],
    ['site.moisture.dead.category', [0.05, 0.1, 0.15]],
    ['site.moisture.live.category', [1]],
    ['site.slope.steepness.ratio', [0.25]],
    ['site.wind.speed.atMidflame', [0, 5 * 88, 10 * 88, 15 * 88, 20 * 88]]
  ]

  const results = [
    // fm10
    [
      // [5%, 10%, 15%]
      [1.936618, 1.599618, 1.409515], // 0 mph
      [10.87064, 8.978989, 7.911903], // 5 mph
      [26.022827, 21.494465, 18.940014], // 10 mph
      [44.96196, 37.137905, 32.724352], // 15 mph
      [66.873268, 55.236317, 48.671907] // 20 mph
    ],
    [
      // fm 124
      [1.237166, 1.007065, 0.906727], // 0 mph
      [7.86269, 6.400307, 5.762615], // 5 mph
      [18.379303, 14.960933, 13.470308], // 10 mph
      [31.129764, 25.339934, 22.815202], // 15 mph
      [45.588809, 37.109738, 33.412328] // 20 mph
    ]
  ]
  dag.setModeOrthogonal()
  dag.runInputs(Inputs)
  expect(dag.runs()).toEqual(2 * 3 * 5)
  for (let fm = 0, idx = 0; fm < 2; fm += 1) {
    for (let dm = 0; dm < 3; dm += 1) {
      for (let ws = 0; ws < 5; ws += 1, idx += 1) {
        expect(dag.runValue(ros, idx)).sig(
          results[fm][ws][dm], 5, `fm=${fm}, ws=${ws}, dm=${dm}, idx=${idx}`)
      }
    }
  }

  dag.setModeCasewise()
  dag.runInputs(Inputs)
  expect(dag.runs()).toEqual(5) //  fm  dm  ws
  expect(dag.runValue(ros, 0)).sig(results[0][0][0], 5) //  10   5   0
  expect(dag.runValue(ros, 1)).sig(results[1][1][1], 5) // 124  10   5
  expect(dag.runValue(ros, 2)).sig(results[1][2][2], 5) // 124  15  10
  expect(dag.runValue(ros, 3)).sig(results[1][3][2], 5) // 124  15  15
  expect(dag.runValue(ros, 4)).sig(results[1][4][2], 5) // 124  15  20
})
