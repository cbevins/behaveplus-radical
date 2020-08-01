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
  expect(dag.get(domainKey).producers.length).toEqual(1)
  expect(dag.get(domainKey).update.method).toEqual(Lib.FuelCatalog.domain)
  expect(dag.get(domainKey).update.args.length).toEqual(1)
  expect(dag.get(domainKey).update.args).toEqual([dag.get(catalogKey)])
  expect(dag.get(catalogKey).update.method).toEqual(DagLib.input)

  dag.setConfigs([[cfgFuelKey, 'behave']])
  expect(dag.get(cfgFuelKey).value).toEqual('behave')
  expect(dag.get(domainKey).update.method).toEqual(DagLib.fixed)

  dag.setConfigs([[cfgFuelKey, 'chaparral']])
  expect(dag.get(cfgFuelKey).value).toEqual('chaparral')

  dag.setConfigs([[cfgFuelKey, 'palmettoGallberry']])
  expect(dag.get(cfgFuelKey).value).toEqual('palmettoGallberry')

  dag.setConfigs([[cfgFuelKey, 'westernAspen']])
  expect(dag.get(cfgFuelKey).value).toEqual('westernAspen')

  expect(() => dag.setConfigs([[cfgFuelKey, 'noSuchOption']])).toThrow()
  expect(() => dag.setConfigs([[cfgFuelKey]])).toThrow()
  expect(() => dag.setConfigs([cfgFuelKey])).toThrow()
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

  const reqNodes = dag.requiredNodes()
  expect(reqNodes).toContain(dag.get(deadLoadKey))
  expect(reqNodes).toContain(dag.get(catalogKey))
  // log('Required', reqNodes)

  expect(dag.get(catalogKey).update.method).toEqual(DagLib.input)
  expect(dag.nodeIsInput(dag.get(catalogKey))).toEqual(true)
  const inputNodes = dag.requiredInputNodes()
  expect(inputNodes.length).toEqual(1)
  expect(inputNodes).toContain(dag.get(catalogKey))
})

test('6: Dag.setInputs()', () => {
  const dag = new Dag(Dna)
  dag.setConfigs([[cfgFuelKey, 'catalog']])
  dag.setSelected([[deadLoadKey, true]])
  const reqInputs = dag.requiredInputNodes()
  // console.log('Required Inputs', reqInputs.map(node => node.key))
  expect(reqInputs.length).toEqual(1)
  expect(reqInputs).toContain(dag.get(catalogKey))

  dag.setInputs([[catalogKey, '10']])
  expect(() => dag.setInputs([[catalogKey, 'noSuchCatalogKey']])).toThrow()
  expect(() => dag.setInputs([[catalogKey]])).toThrow()
  expect(() => dag.setInputs([catalogKey])).toThrow()
})

test('7: Dag.runInputs()', () => {
  const dag = new Dag(Dna)
  const deadLoad = dag.get(deadLoadKey)
  const tl1hLoad = dag.get(tl1hLoadKey)
  expect(deadLoad.value).toEqual(0)

  dag.setConfigs([[cfgFuelKey, 'catalog']])
  dag.setSelected([[deadLoad, true]])
  dag.runInputs([[catalogKey, '10']])
  expect(deadLoad.value).toEqual(0.138)
  expect(tl1hLoad.value).toEqual(0.138)

  dag.runInputs([[catalogKey, '124']])
  expect(deadLoad.value).toEqual(0.0872359963269054)
  expect(tl1hLoad.value).toEqual(0.0872359963269054)
})
