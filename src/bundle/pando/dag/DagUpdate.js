// Stores current value of all selected Nodes
function storeValues (dag) {
  dag.results.map.forEach((runs, node) => runs.push(node.value))
}

export function update (dag) {
  // Initialize Dag results Map with an entry for each Input and Selected Node
  dag.results.map.clear()
  const inputNodes = dag.requiredInputNodes();
  [...inputNodes, ...dag.selectedNodes()].forEach(idx => dag.results.map.set(idx, []))

  // Ensure every Node in the Input Set has at least 1 input value
  inputNodes.forEach(node => {
    if ((!dag.input.has(node)) || (dag.input.get(node) === [])) {
      dag.input.set(node, [node.value])
    }
  })

  // Initialize run stats
  dag.results.ok = true
  dag.results.message = ''
  dag.results.elapsed = Date.now() // start the elapsed timer
  dag.results.runs = 0 // number of results stored

  // Call the appropriate update processor
  if (dag.mode === 'orthogonal') {
    return updateOrthogonalRecursive(dag)
  } else if (dag.mode === 'casewise') {
    return updateCasewise(dag)
  } else {
    return updateOrthogonalStack(dag)
  }
}

/**
 * Generates a set of case-by-case results for the current dag.input values
 *
 * Results are stored the dag.results.map of nodeIdx => [<case0>, <case1>...]
 *
 * The number of case results is determined by the input Node with largest number
 * of case values.  If an input Node has fewer case values than the number of cases,
 * its last case value is applied to all remaining cases.
 *
 * For example, if fuel model has 2 input values, 1-h dead moisture has 3 input values,
 * and wind speed has 4 input values, then 4 results are generated.
 */
export function updateCasewise (dag) {
  // Save the case input values since we need to use dag.input map for case-by-case iteration
  const saved = new Map()
  const inputNodes = dag.requiredInputNodes()
  let maxCases = 0
  inputNodes.forEach(node => {
    saved.set(node, [...dag.input.get(node)])
    maxCases = Math.max(maxCases, saved.get(node).length)
  })
  // Process each case with single input values
  for (let caseIdx = 0; caseIdx < maxCases; caseIdx += 1) {
    inputNodes.forEach(node => {
      const inputs = saved.get(node)
      const useIdx = Math.min(caseIdx, inputs.length - 1)
      dag.input.set(node, inputs[useIdx])
    })
    updateRecursive(dag, 0)
  }
  // Restore the case values back to the dag.input map
  inputNodes.forEach(node => (dag.input.set(node, [...saved.get(node)])))
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
  if (dag.nodeIsInput(node)) {
    dag.input.get(node).forEach(value => {
      node.value = value
      updateRecursive(dag, stackIdx + 1)
    })
  } else {
    node.refresh()
    updateRecursive(dag, stackIdx + 1)
  }
}

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
