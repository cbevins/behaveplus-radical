/**
 * The DagDna class implements Dag behaviors.
 * @copyright 2020 Systems for Environmental Management
 * @author Collin D. Bevins, <cbevins@montana.com>
 * @license MIT
 * @version 0.1.0
 * coverage-20200506
 */
import * as Client from './DagSetRun.js'

export class Node {
  constructor (nodeIdx, nodeKey, variantRef) {
    this.consumers = [] // aray of references to consumer Nodes
    this.depth = 0
    this.idx = nodeIdx
    this.isEnabled = true
    this.isInput = false
    this.key = nodeKey
    this.order = 0
    this.producers = [] // array of references to producer Nodes
    this.update = {
      able: false, // is updateable (i.e., is NOT Config derived)
      method: null,
      args: [] // array of method args (mix of references to Nodes or literals)
    }
    this.value = variantRef.defaultValue()
    this.variant = variantRef
  }

  updateValue () {
    // DO NOT use this.update.args.map(), as it increases time by 50%
    const args = []
    this.update.args.forEach(parm => {
      args.push((parm instanceof Node) ? parm.value : parm)
    })
    this.value = this.update.method.apply(this, args)
  }
}

export class DagDna {
  constructor (dna) {
    this.dna = dna
    this.variant = [] // each DAG gets its own Variant instances to manipulate
    this.dna.variantClass.forEach(Vclass => { this.variant.push(new Vclass()) })

    // Node property arrays
    this.configs = new Set()
    this.input = new Map()
    this.links = new Set()
    this.mode = 'orthogonal' // or 'casewise', or 'stack'
    this.modules = new Set() // references to Module Nodes
    this.required = new Set() // references to required Nodes
    this.results = {
      elapsed: 0,
      map: new Map(),
      message: '',
      ok: true,
      runs: 0,
      runLimit: 10000
    }
    this.selected = new Set() // references to selected Nodes
    this.sorted = [] // array of references to all Nodes in topological order
    this.node = [] // array of references to all Nodes
    // dna.variant has one element for each nodeIdx, whose value is a variant class idx
    this.dna.variant.forEach((variantIdx, nodeIdx) => {
      const key = this.dna.key[nodeIdx]
      const node = new Node(nodeIdx, key, this.variant[variantIdx])
      this.node.push(node)
      if (key.startsWith('configure.')) this.configs.add(node)
      else if (key.startsWith('link.')) this.links.add(node)
      else if (key.startsWith('module.')) this.modules.add(node)
      else node.update.able = true
    })
    this.setConfigs([])
  }

  clearInputs () { this.input.clear() }

  clearSelected () { this.selected.clear() }

  // Returns a Node reference given a Node reference, a Node key string, or a Node indice.
  get (something) {
    // this._args(arguments, 1)
    if (something instanceof Node) {
      return something
    } else if (this.dna.map.has(something)) {
      return this.node[this.dna.map.get(something)]
    } else if (typeof something === 'number' && something >= 0 && something < this.node.length) {
      return this.node[something]
    }
    throw new Error(`Unable to resolve a Node reference from ${something}`)
  }

  // Returns the value of the literal with literalIdx
  literal (literalIdx) { return this.dna.literal[literalIdx] }

  // Returns an array of references to ALL Config Nodes that may be used by node
  // Called only by DagSetRun.setRequiredRecursive()
  nodeConfigs (node) {
    const configs = new Set()
    this.dna.updater[node.idx].forEach(updater => {
      if (updater[0].length) { configs.add(this.node[updater[0][0]]) }
    })
    return Array.from(configs)
  }

  // Returns TRUE if Node Variant is derived from a Config class
  nodeIsConfig (node) { return this.configs.has(node) || this.links.has(node) }

  // Returns TRUE if Node currently uses the Dag.input() updater method
  nodeIsInput (node) { return node.update.method === this.dna.dagMethod.get('input') }

  // Returns an array of required Config Node references in topological order
  requiredConfigNodes () { return this.sorted.filter(node => this.required.has(node) && this.nodeIsConfig(node)) }

  // Returns an array of required input Node references in topological order
  requiredInputNodes () { return this.sorted.filter(node => this.required.has(node) && this.nodeIsInput(node)) }

  // Returns an array of required Node references in topological order
  requiredNodes () { return this.sorted.filter(node => this.required.has(node)) }

  // Returns an array of all required, updatable (non-Config-ish) Node references in topological order.
  requiredUpdateNodes () { return this.sorted.filter(node => this.required.has(node) && node.update.able) }

  // Sets the value of zero or more Config Nodes, then resets the DAG topology and Required Set
  runConfigs (keyValuePairs) { return Client.runConfigs(this, keyValuePairs) }

  // Sets the value of zero or more Config Nodes, then resets the Required Set and node values
  runSelected (keyValuePairs) { return Client.runSelected(this, keyValuePairs) }

  // Sets the inputs values of zero or more input Nodes AND updates all Dag Node values
  runInputs (keyValuePairs) { return Client.runInputs(this, keyValuePairs) }

  // Returns an array of references to all selected Nodes
  selectedNodes () { return Array.from(this.selected) }

  // Sets the value of zero or more Config Nodes WITHOUT updating the Dag topology
  setConfigs (keyValuePairs) { return Client.setConfigs(this, keyValuePairs) }

  // Sets the inputs values of zero or more input Nodes WITHOUT updating the node values
  setInputs (keyValuePairs) { return Client.setInputs(this, keyValuePairs) }

  // Adds or deletes zero or more Nodes from the selection set WITHOUT updating the required set or node values.
  setSelected (keyValuePairs) { return Client.setSelected(this, keyValuePairs) }

  // -------------------------------------------------------------------------------
  // UNTESTED or UNUSED
  // -------------------------------------------------------------------------------

  //   // Simple function arguments guard
  //   _args (args, n) {
  //     if (args.length !== n) {
  //       throw new Error(`Expected ${n} arguments, but received ${args.length}`)
  //     }
  //   }

  //   // Returns the index of the Node with the nodeKey, or throws Error
  //   ensureNodeKey (nodeKey) {
  //     if (this.dna.map.has(nodeKey)) { return this.dna.map.get(nodeKey) }
  //     throw new Error(`Dag has no Node with key of '${nodeKey}'`)
  //   }

  //   hasNodeKey (nodeKey) { return this.dna.map.has(nodeKey) }

  //   // Returns an array of current input values for node
  //   nodeInputs (node) {
  //     // this._args(arguments, 1)
  //     return this.input.has(node) ? this.input.get(node) : []
  //   }

  //   nodeIsBound (node) {
  //     // this._args(arguments, 1)
  //     return node.update.method === this.dna.dagMethod.get('input')
  //   }

  //   nodeIsFixed (node) {
  //     this._args(arguments, 1)
  //     return node.update.method === this.dna.dagMethod.get('fixed')
  //   }

  //   nodeIsLink (node) {
  //     // this._args(arguments, 1)
  //     return this.links.has(node)
  //   }

  //   nodeIsModule (node) {
  //     // this._args(arguments, 1)
  //     return this.modules.has(node)
  //   }

  //   nodeIsRequired (node) {
  //     // this._args(arguments, 1)
  //     return this.required.has(node)
  //   }

  //   nodeIsRequiredConfig (node) {
  //     // this._args(arguments, 1)
  //     return this.required.has(node) && this.nodeIsConfig(node)
  //   }

  //   nodeIsRequiredInput (node) {
  //     // this._args(arguments, 1)
  //     return this.required.has(node) && this.nodeIsInput(node)
  //   }

  //   nodeIsSelected (node) {
  //     // this._args(arguments, 1)
  //     return this.selected.has(node)
  //   }

//   // Returns a reference to the Variant instance for nodeIdx
//   nodeVariantClass (node) {
//     // this._args(arguments, 1)
//     return this.dna.variantClass[this.dna.variant[node.idx]]
//   }
}
