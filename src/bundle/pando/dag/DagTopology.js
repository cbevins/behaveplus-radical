/**
 * The DagTopology file provides functions to:
 * - select updater methods
 * - determine Node producers and consumers, and
 * - determine Node depth and topological order.
 * @copyright 2020 Systems for Environmental Management
 * @author Collin D. Bevins, <cbevins@montana.com>
 * @license MIT
 * @version 0.1.0
 * coverage-20200506
 */
export function reset (dag) {
  dag.node.forEach(node => {
    node.consumers = [] // array of Node references
    node.depth = 0
    node.order = 0
    node.producers = [] // array of Node references
  })

  // Determine Node updater method, args, producers, and consumers for the current configuration
  for (let nodeIdx = 0; nodeIdx < dag.node.length; nodeIdx++) {
    const node = dag.node[nodeIdx]
    const idx = selectNodeUpdaterIdx(dag, nodeIdx)
    const [methodIdx, ...parms] = dag.dna.updater[nodeIdx][idx][1]
    node.update.method = dag.dna.method[methodIdx]
    if (methodIdx === dag.dna.dagMethod.get('fixed')) {
      // apply Dag.fixed(arg0)
      const [type, literalIdx] = parms[0]
      if (type !== 1) throw new Error(`Fixed node ${dag._idxKey(nodeIdx)} parameter 0 is not a literal`)
      node.update.args = [dag.literal(literalIdx)]
    } else if (methodIdx === dag.dna.dagMethod.get('bind')) {
      // apply Dag.bind(arg0)
      const [type, bindIdx] = dag.dna.updater[nodeIdx][dag.updaterIdx[nodeIdx]][1][1]
      if (type !== 0) throw new Error(`Bound node ${dag._idxKey(nodeIdx)} parameter 0 is not a nodeIdx`)
      node.update.args = [dag.node[bindIdx]]
      node.producers = [dag.node[bindIdx]]
    } else if (methodIdx === dag.dna.dagMethod.get('input') ||
        methodIdx === dag.dna.dagMethod.get('dangler')) {
      // If the Node is an input, updateRecursive() already has handled value iteration
      // so, apply Dag.input(self)
      node.update.args = [node]
    } else if (dag.nodeIsConfig(nodeIdx) || methodIdx === dag.dna.dagMethod.get('link')) {
      // If the Node is Config, ignore it
      // so, apply Dag.config(self)
      node.update.args = [node]
    } else {
      // Otherwise, call the Node's method with the args
      const args = []
      parms.forEach(parm => {
        if (parm[0] === 0) {
          args.push(dag.node[parm[1]])
          node.producers.push(dag.node[parm[1]])
        } else {
          args.push(dag.literal(parm[1]))
        }
      })
      node.update.args = args
    }
    node.producers.forEach(producer => { producer.consumers.push(node) })
  }
  resetNodeDepths(dag)
}

/**
   * A reset() helper function that returns a topologically sorted array of the Dag Nodes, but with:
   *  - *input* Nodes deferred to the greatest depth allowed by their consumers (out edges)
   *  - *fixed* Nodes are run first and just once
   * Its OK to determine depths of disabled Nodes
   */
function resetNodeDepths (dag) {
  // Step 1 - determine depth of the consumer chain for each Node
  let maxDepth = 0
  dag.node.forEach((node, nodeIdx) => {
    maxDepth = Math.max(maxDepth, resetNodeDepth(node, [nodeIdx]))
  })

  // Step 2 - ensure input Nodes are processed after all other Nodes at the same depth
  // - non-input Nodes have an odd numbered level = 2 * depth - 1
  // - input Nodes have an even numbered level = 2 * depth
  dag.sorted = []
  dag.node.forEach(node => {
    node.depth = dag.nodeIsInput(node) ? 2 * node.depth - 1 : 2 * node.depth
    dag.sorted.push(node)
  })

  // Step 3 - topologically sort the Node array
  dag.sorted.sort((node1, node2) => node2.depth - node1.depth)
  dag.sorted.forEach((node, order) => { node.order = order })
}

/**
 * A resetNodeDepths() helper function (and therefore, also a reset() helper function)
 * that returns the Node's depth, calculating it first, if necessary
 * (Its OK to determine depths of disabled Nodes)
 * @param {Node} node
 * @param {integer[]} visited An array of indices of Nodes that have been traversed from the start of the chain
 */
function resetNodeDepth (node, visited) {
  // If this Node doesn't yet have a depth, derive it
  if (!node.depth) {
    let maxDepth = 0
    node.consumers.forEach(consumer => {
      if (visited.includes(consumer.idx)) {
        visited.push(consumer.idx)
        // \TODO Convert indices to keys for error message display
        throw new Error(`Cyclical dependency detected:\n${visited.join(' required by ->\n')}`)
      }
      visited.push(consumer.idx)
      const depth = resetNodeDepth(consumer, visited)
      visited.pop()
      maxDepth = Math.max(depth, maxDepth)
    })
    node.depth = maxDepth + 1
  }
  return node.depth
}

// Returns the current appropriate updater index for nodeIdx
export function selectNodeUpdaterIdx (dag, nodeIdx) {
  const updaters = dag.dna.updater[nodeIdx]
  for (let updaterIdx = 0; updaterIdx < updaters.length; updaterIdx++) {
    const condition = dag.dna.updater[nodeIdx][updaterIdx][0]
    if (condition.length) { // if condition has members, then this is a 'when' condition
      const [configIdx, valueIdx] = condition
      if (dag.node[configIdx].value === dag.literal(valueIdx)) { // if config Node has this value,
        return updaterIdx // this is the appropriate updater
      }
    } else { // if empty, then this is a 'finally' condition
      return updaterIdx // this is the appropriate updater
    }
  }
  return 0
}
