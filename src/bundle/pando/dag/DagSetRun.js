import * as Topology from './DagTopology.js'

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

// Sets the value of zero or more Config Nodes and resets the Dag topology
export function setConfigs (dag, keyValuePairs) {
  _refVals(dag, keyValuePairs, 'setConfigs').forEach(pair => { setValue(pair[0], pair[1]) })
  Topology.reset(dag)
}

// Sets the inputs values of zero or more input Nodes WITHOUT updating node values.
export function setInputs (dag, keyValuePairs) {
  _refVals(dag, keyValuePairs, 'setInputs').forEach(pair => {
    dag.input.set(pair[0], Array.isArray(pair[1]) ? pair[1] : [pair[1]])
  })
}

// Determines the set of required Nodes
// Should be called after setSelected()
export function setRequiredNodes (dag) {
  dag.required.clear()
  Array.from(dag.selected).forEach(node => {
    if (node.isEnabled) { setRequiredRecursive(dag, node) }
  })
}

// Recursively determines the set of required Nodes
function setRequiredRecursive (dag, node) {
  if (!dag.required.has(node)) { // Nothing more to do if node is already required
    dag.required.add(node) // Add node to the required set
    // Add all Config nodes referenced by node to the required set
    dag.nodeConfigs(node).forEach(config => { dag.required.add(config) })
    // Add all this Nodes producer Nodes to the required set
    node.producers.forEach(producer => setRequiredRecursive(dag, producer))
  }
}

// Adds or deletes zero or more Nodes from the selection set
export function setSelected (dag, keyValuePairs) {
  _refVals(dag, keyValuePairs, 'setSelected').forEach(pair => {
    if (pair[1]) {
      dag.selected.add(pair[0])
    } else {
      dag.selected.delete(pair[0])
    }
  })
  setRequiredNodes(dag)
}

// Validates and sets a value for node
function setValue (node, value) {
  const valid = node.variant.isValid(value)
  if (!valid.pass) {
    throw new Error(`Node '${node.key}' value '${value}' is invalid`)
  }
  node.value = value
}
