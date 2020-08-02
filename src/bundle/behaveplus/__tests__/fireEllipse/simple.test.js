/* eslint-disable no-unused-vars */
import { Bpx } from '../../Bpx.js'
import * as DagJest from '../../../../utils/matchers.js'
import * as Test from './testData.js'
import * as Ellipse from '../../equations/FireEllipse.js'
import { configMinimalInput } from '../testData.js'

const value = DagJest.value
expect.extend({ value })

test('1: Bpx FireEllipse', () => {
  const dag = new Bpx()

  // Step 1 - configuration
  dag.runConfigs(Test.Configs) // Standard configuration

  // Step 2 - selection
  dag.runSelected(Test.fireEllipseSelections())

  // Get required inputs and ensure they are included in the provided input array
  const requiredInputs = dag.requiredInputNodes()
  // console.log(DagJest.arrayList(requiredInputs, 'Required Inputs:'))
  const testInputs = Test.Inputs // Array of [<nodeKey>-<true>] pairs
  const testList = testInputs.map(input => dag.get(input[0])) // Simple array of input Node references
  requiredInputs.forEach(requiredInput => {
    // console.log(requiredInput.node.key)
    expect(testList.includes(requiredInput)).toEqual(true)
  })

  // Ensure the required configuration nodes are as expected
  const configNodes = dag.requiredConfigNodes()
  // console.log(DagJest.arrayList(configNodes, 'Config Nodes'))
  expect(configNodes.length).toEqual(12)

  // Set required input values and ensure results are as expected
  dag.runInputs(testInputs)
  Test.fireEllipseResults('fm010').forEach(result => {
    const [nodeKey, value, prec] = result
    expect(dag.get(nodeKey)).value(value, prec)
  })

  dag.runInputs([['surface.primary.fuel.model.catalogKey', ['124']]])
  Test.fireEllipseResults('fm124').forEach(result => {
    const [nodeKey, value, prec] = result
    expect(dag.get(nodeKey)).value(value, prec)
  })
})

test('2: FireEllipse equations coverage', () => {
  const rosF = 1
  const rosG = 1
  const rosH = 1
  for (let thetaFromHead = 0; thetaFromHead < 360; thetaFromHead += 1) {
    expect(Ellipse.psiFromTheta(thetaFromHead, rosF, rosH))
      .toBeCloseTo(thetaFromHead, 2)
  }
})
