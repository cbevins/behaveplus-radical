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
