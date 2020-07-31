import { Dag } from '../Dag.js'
import * as Dna from '../../../behaveplus/BpxDna.js'
import * as Lib from '../../../behaveplus/equations/index.js'
import * as Variant from '../../../behaveplus/variants/index.js'
import * as DagLib from '../../../behaveplus/equations/Dag.js'

const catalogKey = 'surface.primary.fuel.model.catalogKey'
const deadLoadKey = 'surface.primary.fuel.bed.dead.particle.class1.ovendryLoad'
const domainKey = 'surface.primary.fuel.model.domain'
const cfgFuelKey = 'configure.fuel.primary'
const tl1hLoadKey = 'surface.primary.fuel.model.behave.parms.dead.tl1h.ovendryLoad'

test('1: new Dag()', () => {
  const dag = new Dag(Dna)
  expect(dag instanceof Dag).toEqual(true)
})

test('2: Dag.get(), Node.idx, Node.key', () => {
  const dag = new Dag(Dna)
  const node = dag.get(tl1hLoadKey)
  expect(node.key).toEqual(tl1hLoadKey) // get by key
  expect(dag.get(node.idx)).toEqual(node) // get by index
  expect(dag.get(node)).toEqual(node) // get by ref
  expect(() => dag.get()).toThrow()
  expect(() => dag.get('no.such.key')).toThrow()
  expect(() => dag.get(-1)).toThrow()
  expect(() => dag.get(999999)).toThrow()
  expect(() => dag.get(dag)).toThrow()
})

test('3: Node.variant', () => {
  const dag = new Dag(Dna)
  expect(dag.dna.variant.length).toEqual(94)
  expect(dag.get(tl1hLoadKey).variant instanceof Variant.FuelOvendryLoad).toEqual(true)
})

test('4: Dag.setConfigs(), selectNodeUpdaterIdx()', () => {
  const dag = new Dag(Dna)
  dag.setConfigs([[cfgFuelKey, 'catalog']])
  expect(dag.get(cfgFuelKey).value).toEqual('catalog')
  expect(dag.get(domainKey).update.idx).toEqual(0)
  expect(dag.get(domainKey).producers.length).toEqual(1)
  expect(dag.get(domainKey).update.method).toEqual(Lib.FuelCatalog.domain)
  expect(dag.get(domainKey).update.args.length).toEqual(1)
  expect(dag.get(domainKey).update.args).toEqual([dag.get(catalogKey)])
  expect(dag.get(catalogKey).update.method).toEqual(DagLib.input)

  dag.setConfigs([[cfgFuelKey, 'behave']])
  expect(dag.get(cfgFuelKey).value).toEqual('behave')
  expect(dag.get(domainKey).update.idx).toEqual(1)
  expect(dag.get(domainKey).update.method).toEqual(DagLib.fixed)

  dag.setConfigs([[cfgFuelKey, 'chaparral']])
  expect(dag.get(cfgFuelKey).value).toEqual('chaparral')
  expect(dag.get(domainKey).update.idx).toEqual(2)

  dag.setConfigs([[cfgFuelKey, 'palmettoGallberry']])
  expect(dag.get(cfgFuelKey).value).toEqual('palmettoGallberry')
  expect(dag.get(domainKey).update.idx).toEqual(3)

  dag.setConfigs([[cfgFuelKey, 'westernAspen']])
  expect(dag.get(cfgFuelKey).value).toEqual('westernAspen')
  expect(dag.get(domainKey).update.idx).toEqual(4)

  expect(() => dag.setConfigs([[cfgFuelKey, 'noSuchOption']])).toThrow()
})

test('5: Dag.setSelected()', () => {
  const dag = new Dag(Dna)
  dag.setConfigs([[cfgFuelKey, 'catalog']])
  expect(dag.selectedNodes()).toEqual([])

  dag.setSelected([[deadLoadKey, true]])
  expect(dag.selectedNodes()).toEqual([dag.get(deadLoadKey)])

  dag.setSelected([[tl1hLoadKey, true]])
  expect(dag.selectedNodes()).toEqual([dag.get(deadLoadKey), dag.get(tl1hLoadKey)])

  dag.setSelected([[deadLoadKey, false]])
  expect(dag.selectedNodes()).toEqual([dag.get(tl1hLoadKey)])

  dag.clearSelected()
  expect(dag.selectedNodes()).toEqual([])

  dag.setSelected([[deadLoadKey, true]])
  expect(dag.selectedNodes()).toEqual([dag.get(deadLoadKey)])

  const requiredNodes = dag.requiredNodes()
  // console.log('Required:\n', requiredNodes.map(node => node.key))

  expect(dag.get(catalogKey).update.method).toEqual(DagLib.input)
  expect(dag.nodeIsInput(dag.get(catalogKey))).toEqual(true)
  const inputNodes = dag.requiredInputNodes()
  expect(inputNodes.length).toEqual(1)
})
