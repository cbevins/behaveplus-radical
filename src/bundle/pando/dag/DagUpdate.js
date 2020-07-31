// Stores current value of all selected Nodes
function storeValues (dag) {
  dag.results.map.forEach((runs, node) => runs.push(node.value))
}
/**
 * Generates a set of result values for all combinations of the dag.input values.
 *
 * For example, if fuel model has 2 input values, 1-h dead moisture has 3 input values,
 * and wind speed has 4 input values, then 2 x 3 x 4 = 24 results are generated.
 *
 * Results are stored the dag.results map of nodeIdx => [<run0>, <run1>...]
 */
export function updateOrthogonalRecursive (dag) {
  dag.stack = dag.requiredUpdateNodes()
  updateRecursive(dag, 0)
}

function updateRecursive (dag, stackIdx) {
  if (!dag.results.ok) return
  // If at the end of the stack...
  if (stackIdx === dag.stack.length) {
    storeValues(dag)
    dag.results.runs += 1
    if (dag.results.runs >= dag.results.runLimit) {
      dag.results.message = `Run limit of ${dag.results.runLimit} exceeded.`
      dag.results.ok = false
    }
    return
  }
  const node = dag.stack[stackIdx]
  if (node.isInput()) {
    dag.input.get(node).forEach(value => {
      node.value = value
      updateRecursive(dag, stackIdx + 1)
    })
  } else {
    const args = node.update.args.map(arg => (arg instanceof Node) ? arg.value : arg)
    node.value = node.update.method.apply(this, args) // or node.update.method(args) ???
    updateRecursive(dag, stackIdx + 1)
  }
}
