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
import { updateOrthogonalStack } from './DagUpdateStack.js'

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
      dag.input.set(node, [inputs[useIdx]])
    })
    updateOrthogonalStack(dag, 0)
  }
  // Restore the case values back to the dag.input map
  inputNodes.forEach(node => (dag.input.set(node, [...saved.get(node)])))
}
