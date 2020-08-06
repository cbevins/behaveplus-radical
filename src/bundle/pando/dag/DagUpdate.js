import { updateCasewise } from './DagUpdateCasewise.js'
import { updateOrthogonalRecursive } from './DagUpdateRecursive.js'
import { updateOrthogonalStack } from './DagUpdateStack.js'

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
  dag.results.runs = 0 // number of results stored
  dag.stack = dag.requiredUpdateNodes()

  // Call the appropriate update processor
  dag.results.elapsed = Date.now() // start the elapsed timer
  if (dag.mode === 'orthogonal') {
    updateOrthogonalRecursive(dag)
  } else if (dag.mode === 'casewise') {
    updateCasewise(dag)
  } else {
    updateOrthogonalStack(dag)
  }
  dag.results.elapsed = Date.now() - dag.results.elapsed
}
