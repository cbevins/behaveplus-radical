import { storeValues } from './DagStore.js'

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
    node.updateValue()
    updateRecursive(dag, stackIdx + 1)
  }
}
