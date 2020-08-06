/**
 * Generates a set of result values for all combinations of the dag.input values.
 *
 * For example, if fuel model has 2 input values, 1-h dead moisture has 3 input values,
 * and wind speed has 4 input values, then 2 x 3 x 4 = 24 results are generated.
 *
 * Results are stored the dag.results map of nodeIdx => [<run0>, <run1>...]
 */
export function updateOrthogonalStack (dag) {
  const ptr = new Map()
  dag.requiredInputNodes().forEach(node => ptr.set(node, 0))
  if (dag.stack.length > 0) {
    let delta = 1
    let node
    let stackIdx = 0
    while (stackIdx >= 0) {
      node = dag.stack[stackIdx]
      if (ptr.has(node)) {
        if (delta > 0) { // moving down the stack, so start with the first input value
          ptr.set(node, 0)
          node.value = dag.input.get(node)[0]
        } else { // moving up the stack, so check for another input value
          const iptr = ptr.get(node) + 1 // point to its next input value
          const inputs = dag.input.get(node) // get all the Node's input values
          ptr.set(node, iptr) // set the input value pointer
          if (iptr < inputs.length) { // there is another input value tp process...
            node.value = inputs[iptr] // set its next input value
            delta = 1 // and go back down the stack
          }
        }
      } else { // not an input Node
        if (delta > 0) {
          node.updateValue()
        }
      }
      stackIdx += delta // set the next stack node to process (+1 === next, -1 === previous)
      if (stackIdx === dag.stack.length) { // at the end of the stack (must be going down)
        dag.storeFunction(dag)
        dag.results.runs += 1
        if (dag.results.runs >= dag.results.runLimit) {
          dag.results.message = `Run limit of ${dag.results.runLimit} exceeded.`
          dag.results.ok = false
          stackIdx = 0
        }
        delta = -1 // must now go back up the stack
        stackIdx += delta // set the next stack node to process (+1 === next, -1 === previous)
      }
    } // while
  } // if ( dag.stack.length > 0 )
}
