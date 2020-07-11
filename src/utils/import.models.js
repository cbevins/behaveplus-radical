import { BehavePlus } from 'behaveplus-models'

const dag = new BehavePlus.BpxDag('models')
console.log(`behaveplus-models Dag has ${dag.node.map.size} Nodes`)
