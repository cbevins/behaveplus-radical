/**
 * Generates a set of result values for all combinations of the dag.input values.
 *
 * For example, if fuel model has 2 input values, 1-h dead moisture has 3 input values,
 * and wind speed has 4 input values, then 2 x 3 x 4 = 24 results are generated.
 *
 * Results are stored the dag.results map of nodeIdx => [<run0>, <run1>...]
 */
export function updateOrthogonalStack (dag) {
  const stack = dag.requiredUpdateNodes()
  const ptr = new Map()
  dag.requiredInputNodes().forEach(node => ptr.set(node, 0))
  if (stack.length > 0) {
    let delta = 1
    let node
    let stackIdx = 0
    while (stackIdx >= 0) {
      node = stack[stackIdx]
      // If progressing down the stack in topological order (towards stackIdx===stack.length)
      if (delta > 0) {
        // If INPUT, reset the Variant's current value to the first input value
        if (dag.nodeIsInput(node)) {
          ptr.set(node, 0)
          node.value = dag.input.get(node)[0]
        } else {
          node.refresh()
        }
      } else if (delta < 0) { // progressing UP the stack in toplogical order (towards stackIdx===0)
        if (dag.nodeIsInput(node)) { // This IS an input Node, so...
          const iptr = ptr.get(node) + 1 // point to its next input value
          const inputs = dag.input.get(node) // get all the input values
          ptr.set(node, iptr) // set the input value pointer
          if (iptr < inputs.length) { // there is another input value tp process...
            node.value = inputs[iptr] // set its next input value
            delta = 1 // and go back down the stack
          } else { // there are no more input values to process, so ...
            delta = -1 // continue up the stack
          }
        } else { // this is NOT an input Node, so...
          delta = -1 // continue up the stack
        }
      } // delta < 0
      stackIdx += delta // set the next stack node to process (+1 === next, -1 === previous)
      if (stackIdx === stack.length) { // at the end of the stack (must be going down)
        storeValues(dag)
        dag.results.runs += 1
        if (dag.results.runs >= dag.results.runLimit) {
          dag.results.message = `Run limit of ${dag.results.runLimit} exceeded.`
          dag.results.ok = false
          break
        }
        delta = -1 // nust now go back up the stack
        stackIdx += delta // set the next stack node to process (+1 === next, -1 === previous)
      }
    } // while
  } // if ( stack.length > 0 )
  dag.results.elapsed = Date.now() - dag.results.elapsed
}
