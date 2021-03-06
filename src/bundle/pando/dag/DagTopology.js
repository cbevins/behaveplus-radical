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
    node.update.args = []
    parms.forEach(parm => {
      if (parm[0] === 0) { // if parm is a Node reference
        const producer = dag.node[parm[1]]
        node.update.args.push(producer)
        node.producers.push(producer)
        producer.consumers.push(node)
      } else { // else parm is a literal value
        node.update.args.push(dag.literal(parm[1]))
      }
    })
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
  dag.node.forEach((node) => {
    const visited = new Set([node.key])
    maxDepth = Math.max(maxDepth, resetNodeDepth(node, visited))
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
 * @param {Set<Node>} visited A Set of keys to Nodes that have been traversed from the start of the chain
 */
function resetNodeDepth (node, visited) {
  // If this Node doesn't yet have a depth, derive it
  if (!node.depth) {
    let maxDepth = 0
    node.consumers.forEach(consumer => {
      if (visited.has(consumer.key)) {
        visited.add(consumer.key)
        throw new Error(`Cyclical dependency detected:\n${Array.from(visited).join(' required by ->\n')}`)
      }
      visited.add(consumer.key)
      const depth = resetNodeDepth(consumer, visited)
      visited.delete(consumer.key)
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
  // The following line should never be executed, but still...
  return 0
}
