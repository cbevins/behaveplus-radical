/**
   * Returns an array of result run indices that satisfy the input node-value pair specs
   * @param {*} inputValues An array of input node => value specifications
   */
export function resultIndices (dag, inputNodeValuePairs) {
  // Get all the run indices where the first Node has the spec value
  const [node, specVal] = inputNodeValuePairs.shift()
  const nodeRuns = dag.results.map.get(node)
  // Which of the all the runs have this Node's spec value?
  const remaining = []
  nodeRuns.forEach((runVal, runIdx) => { if (specVal === runVal) remaining.push(runIdx) })
  return (inputNodeValuePairs.length && remaining.length)
    ? resultIndicesRecursive(dag, inputNodeValuePairs, remaining) : remaining
}

function resultIndicesRecursive (dag, inputNodeValuePairs, possible) {
  const [node, specVal] = inputNodeValuePairs.shift()
  const nodeRuns = dag.results.map.get(node)
  // Which of the remaining runs also have this Node's spec value?
  const remaining = []
  possible.forEach(runIdx => { if (specVal === nodeRuns[runIdx]) remaining.push(runIdx) })
  return (inputNodeValuePairs.length && remaining.length)
    ? resultIndicesRecursive(dag, inputNodeValuePairs, remaining) : remaining
}

// Returns the value of referenced Node
export function resultValue (dag, node, runIdx) {
  if (!dag.results.map.has(node)) throw new Error(`Node ${node.key} is not in the run results`)
  return dag.results.map.get(node)[runIdx]
}

// Stores current value of all input and selected Nodes in the Results Map
// This is the default Dag.storeFunction
export function storeValues (dag) {
  dag.results.map.forEach((runs, node) => runs.push(node.value))
}
