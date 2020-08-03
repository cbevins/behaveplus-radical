import { Bpx } from '../../Bpx.js'
import * as DagJest from '../../../../utils/matchers.js'
import { configMinimalInput } from '../testData.js'

const value = DagJest.value
expect.extend({ value })

const Inputs = [
  ['site.map.scale', [24000]],
  ['site.map.interval', [20]],
  ['site.map.contours', [5]],
  ['site.map.distance', [1 / 12]]
]

const Results = [
  ['site.map.factor', 1 / 24000, 12],
  ['site.map.reach', 2000, 12],
  ['site.map.rise', 100, 12],
  ['site.map.slope.ratio', 0.05, 12]
]

test('1: Map test', () => {
  const dag = new Bpx()
  dag.runConfigs(configMinimalInput)

  dag.runSelected(Results.map(node => [node[0], true]))
  const requiredInputs = dag.requiredInputNodes()
  expect(requiredInputs.length).toEqual(Inputs.length)
  Inputs.forEach(input => { expect(requiredInputs).toContain(dag.get(input[0])) })

  dag.runInputs(Inputs)
  Results.forEach(result => {
    const [key, value, prec] = result
    expect(dag.get(key)).value(value, prec)
  })
})
