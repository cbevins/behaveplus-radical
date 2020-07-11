import { BehavePlus } from 'behaveplus-core'

const dag = new BehavePlus.BpxDag('core')
console.log(`behaveplus-core Dag has ${dag.node.map.size} Nodes`)
