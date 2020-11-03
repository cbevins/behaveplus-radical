import { Bpx } from '../Bpx.js'
import { configMinimalInput } from './testData.js'

import * as DagJest from '../../../utils/matchers.js'
const sig = DagJest.sig
const value = DagJest.value
expect.extend({ value, sig })

const whdgKey = 'site.wind.direction.heading.fromUpslope'
const cdepthKey = 'crown.canopy.fuel.bed.depth'
const northKey = 'site.wind.direction.heading.fromNorth'
const upslopeKey = 'site.slope.direction.upslope'

test('1: Simple', () => {
  const dag = new Bpx()
  dag.runConfigs(configMinimalInput)
  expect(dag.get(cdepthKey).update.args).toEqual([1])
  expect(dag.get(whdgKey).update.args).toEqual([0])
  dag.runConfigs([['configure.wind.direction', 'headingFromUpslope']])
  expect(dag.get(whdgKey).update.args).toEqual([])
  dag.runConfigs([['configure.wind.direction', 'sourceFromNorth']])
  expect(dag.get(whdgKey).update.args.length).toEqual(2)
  dag.runConfigs([['configure.wind.direction', 'upslope']])
  expect(dag.get(whdgKey).update.args).toEqual([0])
})

test('2: Dag call order', () => {
  const dag = new Bpx()
  const node = dag.get('surface.fire.ellipse.head.spreadRate')
  dag.setSelected([[node, true]])
  dag.setConfigs([])
  dag.runInputs([])
  expect(dag.selectedNodes()).toEqual([node])
})

test('3: site.doc.*', () => {
  const dag = new Bpx()

  let key = 'site.doc.date'
  let value = 'Sep 4, 2020'
  let node = dag.get(key)
  node.setValue(value)
  expect(node.displayValue()).toEqual(value)

  key ='site.doc.id'
  value = 'Site 1234'
  node.setValue(value)
  expect(node.displayValue()).toEqual(value)

  key ='site.doc.location'
  value = 'Missoula, MT'
  node.setValue(value)
  expect(node.displayValue()).toEqual(value)

  key ='site.doc.station'
  value = 'MSO'
  node.setValue(value)
  expect(node.displayValue()).toEqual(value)

  key ='site.doc.time'
  value = '16:20'
  node.setValue(value)
  expect(node.displayValue()).toEqual(value)

})
