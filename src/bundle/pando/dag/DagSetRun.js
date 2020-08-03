import * as Store from './DagStore.js'
import * as Topology from './DagTopology.js'
import { update } from './DagUpdate.js'

// Repackages an array of [<keyOrIdx>, <value>] pairs as an array of [<node>, <value>] pairs
function _refVals (dag, pairs, name) {
  const refVals = []
  if (!Array.isArray(pairs)) {
    throw new Error(`${name}(keyValuePairs) arg must be an Array of 2-element arrays`)
  }
  pairs.forEach((pair, idx) => {
    if (!Array.isArray(pair) || pair.length !== 2) {
      throw new Error(`${name}(keyValuesPair[${idx}]) [<node|key|index>, <value>] must be a 2-element Array`)
    }
    refVals.push([dag.get(pair[0]), pair[1]])
  })
  return refVals
}

function _valid (node, value, message) {
  if (!(node.variant.isValid(value)).pass) throw new Error(message)
  return value
}

// Sets the value of zero or more Config Nodes, resets the Dag topology,
// AND resets the Required and Input Stes and updates the Dag Node values
export function runConfigs (dag, keyValuePairs) {
  setConfigs(dag, keyValuePairs)
  runSelected(dag, [])
}

// Returns an array of result run indices that satisfy the input node-value pair specs
export function runIndices (dag, inputNodeValuePairs) {
  return Store.runIndices(dag, _refVals(dag, inputNodeValuePairs, 'runIndices'))
}

// Adds the values of zero or more Nodes to the Input Set
// AND then updates the Dag Node values
export function runInputs (dag, keyValuePairs) {
  setInputs(dag, keyValuePairs)
  update(dag)
}

// Adds or deletes zero or more Nodes from the Selected Set, resets the Required and Input Set,
// NAD then updates the Dag Node values
export function runSelected (dag, keyValuePairs) {
  setSelected(dag, keyValuePairs)
  update(dag)
}

// Sets the value of zero or more Config Nodes and resets the Dag topology
export function setConfigs (dag, keyValuePairs) {
  _refVals(dag, keyValuePairs, 'setConfigs').forEach(([node, value]) => {
    node.value = _valid(node, value, `Config Node '${node.key}' value '${value}' is invalid`)
  })
  Topology.reset(dag)
}

// Adds the values of zero or more Nodes to the Input Set WITHOUT updating node values.
export function setInputs (dag, keyValuePairs) {
  _refVals(dag, keyValuePairs, 'setInputs').forEach(([node, value]) => {
    const values = Array.isArray(value) ? value : [value] // ensure values are in an array
    values.forEach(value => { _valid(node, value, `Input Node '${node.key}' value '${value}' is invalid`) })
    dag.input.set(node, values)
  })
}

// Determines the Set of required Nodes
// Should be called after setSelected()
export function setRequiredNodes (dag) {
  dag.required.clear()
  Array.from(dag.selected).forEach(node => {
    if (node.isEnabled) { setRequiredRecursive(dag, node) }
  })
}

// Recursively determines the Set of required Nodes
function setRequiredRecursive (dag, node) {
  if (!dag.required.has(node)) { // Nothing more to do if node is already required
    dag.required.add(node) // Add node to the required set
    // Add all Config nodes referenced by node to the Required Set
    dag.nodeConfigs(node).forEach(config => { dag.required.add(config) })
    // Add all this Node's producer Nodes to the Required Set
    node.producers.forEach(producer => {
      if (!producer.isEnabled) throw new Error(`Node '${node.key}' has disabled producer '${producer.key}'`)
      setRequiredRecursive(dag, producer)
    })
  }
}

// Adds or deletes zero or more Nodes from the Selected Set
export function setSelected (dag, keyValuePairs) {
  _refVals(dag, keyValuePairs, 'setSelected').forEach(([node, select]) => {
    return select ? dag.selected.add(node) : dag.selected.delete(node)
  })
  setRequiredNodes(dag)
}
