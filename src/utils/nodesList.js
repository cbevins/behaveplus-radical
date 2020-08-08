import * as Dag from '../../dist/bundle.esm.js'
import * as fs from 'fs'

const dag = new Dag.Bpx()

function alphaOrder (fileName) {
  let str = 'export const alphabeticalOrder = [\n'
  const nodeKeys = dag.dna.node.map(node => node.key)
  nodeKeys.sort().forEach((key, idx) => {
    const node = dag.get(key)
    str += `  [${idx}, ${node.depth}, '${key}'],\n`
  })
  str += ']\n'
  write(str, fileName)
}

function topoOrder (fileName) {
  let str = 'export const topologicalOrder = [\n'
  dag.dna.sorted.forEach((node, idx) => { str += `  [${idx}, ${node.depth}, '${node.key}'],\n` })
  str += ']\n'
  write(str, fileName)
}

function write (str, fileName) {
  fs.writeFile(fileName, str, function (err) {
    if (err) throw err
    console.log(`Wrote file ${fileName}`)
  })
}

alphaOrder('BehavePlusNodesAlphabeticalOrder.js')
topoOrder('BehavePlusNodesTopologicalOrder.js')
