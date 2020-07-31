/**
 * Contains all Dna data structure accessors
 */
import * as Client from './DagSetRun.js'
import * as Topology from './DagTopology.js'

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
      idx: 0,
      type: 'ignore', // 'bind', 'fixed', 'ignore', 'input', 'update'
      method: null,
      args: [] // array of method args (mix of references to Nodes or literals)
    }
    this.value = variantRef.defaultValue()
    this.variant = variantRef
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
      const node = new Node(nodeIdx, key, this.dna.variant[variantIdx])
      this.node.push(node)
      if (key.startsWith('configure.')) this.configs.add(node)
      else if (key.startsWith('link.')) this.links.add(node)
      else if (key.startsWith('module.')) this.modules.add(node)
    })
    Topology.reset(this)
  }

  // Simple function arguments guard
  _args (args, n) {
    if (args.length !== n) {
      throw new Error(`Expected ${n} arguments, but received ${args.length}`)
    }
  }

  // Returns the index of the Node with the nodeKey, or throws Error
  ensureNodeKey (nodeKey) {
    if (this.dna.map.has(nodeKey)) { return this.dna.map.get(nodeKey) }
    throw new Error(`Dag has no Node with key of '${nodeKey}'`)
  }

  hasNodeKey (nodeKey) { return this.dna.map.has(nodeKey) }

  literal (literalIdx) {
    // this._args(arguments, 1)
    return this.dna.literal[literalIdx]
  }

  // Returns an array ofreferences to ALL Config Nodes that may be used by node
  nodeConfigs (node) {
    const configs = new Set()
    this.dna.updater[node.odx].forEach(updater => {
      if (updater[0].length) {
        configs.add(this.node[updater[0][0]])
      }
    })
    return Array.from(configs)
  }

  // Returns an array of current input values for node
  nodeInputs (node) {
    // this._args(arguments, 1)
    return this.input.has(node) ? this.input.get(node) : []
  }

  nodeIsBound (node) {
    // this._args(arguments, 1)
    return node.update.type === 'bind'
  }

  nodeIsConfig (node) {
    // this._args(arguments, 1)
    return this.configs.has(node) || this.links.has(node)
  }

  nodeIsFixed (node) {
    this._args(arguments, 1)
    return node.update.type === 'fixed'
  }

  nodeIsInput (node) {
    this._args(arguments, 1)
    return node.update.type === 'input'
  }

  nodeIsLink (node) {
    // this._args(arguments, 1)
    return this.links.has(node)
  }

  nodeIsModule (node) {
    // this._args(arguments, 1)
    return this.modules.has(node)
  }

  nodeIsRequired (node) {
    // this._args(arguments, 1)
    return this.required.has(node)
  }

  nodeIsRequiredConfig (node) {
    // this._args(arguments, 1)
    return this.nodeIsRequired(node) && this.nodeIsConfig(node)
  }

  nodeIsRequiredInput (node) {
    // this._args(arguments, 1)
    return this.nodeIsRequired(node) && this.nodeIsInput(node)
  }

  nodeIsSelected (node) {
    // this._args(arguments, 1)
    return this.selected.has(node)
  }

  nodeIsUpdate (node) {
    // this._args(arguments, 1)
    return this.nodeIsRequired(node) && node.update.type !== 'ignore'
  }

  // Returns a Node reference given a Node reference, a Node key string, or a Node indice.
  nodeRef (something) {
    // this._args(arguments, 1)
    if (something instanceof Node) {
      return something
    } else if (typeof something === 'number' && something >= 0 && something < this.node.length) {
      return this.node[something]
    } else if (this.dna.map.has(something)) {
      return this.node[this.dna.map.get(something)]
    }
    throw new Error(`Unable to resolve a Node reference from ${something}`)
  }

  // Returns a reference to the Variant instance for nodeIdx
  nodeVariantClass (node) {
    // this._args(arguments, 1)
    return this.dna.variantClass[this.dna.variant[node.idx]]
  }

  selectNodeUpdaterIdx (node) {
    // this._args(arguments, 1)
    return Topology.selectNodeUpdaterIdx(this, node.idx)
  }

  // -------------------------------------------------------------------------
  // Client API
  // -------------------------------------------------------------------------

  clearInputs () { this.input.clear() }

  clearSelected () { this.selected.clear() }

  // Returns an array of required Node references in topological order
  requiredNodes () { return this.sorted.filter(node => this.required.has(node)) }

  // Returns an array of required input Node references in topological order
  requiredConfigNodes () { return this.sorted.filter(node => this.required.has(node) && this.nodeIsConfig(node)) }

  // Returns an array of required input Node indices in topological order
  requiredInputNodes () { return this.sorted.filter(node => this.required.has(node) && this.nodeIsInput(node)) }

  // Returns an array of all required, updatable (non-Config-ish) Node references in topological order.
  requiredUpdateNodes () { return this.sorted.filter(node => this.nodeIsUpdate(node)) }

  // Sets the value of zero or more Config Nodes, then resets the DAG topology and required set
  runConfigs (keyValuePairs) { return Client.runConfigs(this, keyValuePairs) }

  // Sets the inputs values of zero or more input Nodes WITHOUT updating the node values.
  runInputs (keyValuePairs) { return Client.runInputs(this, keyValuePairs) }

  // Sets the value of zero or more Config Nodes, then resets the required set and node values
  runSelected (keyValuePairs) { return Client.runSelected(this, keyValuePairs) }

  // Returns an array of references to all selected Nodes
  selectedNodes () { return Array.from(this.selected) }

  // Sets the value of zero or more Config Nodes WITHOUT updating the Dag topology.
  setConfigs (keyValuePairs) { return Client.setConfigs(this, keyValuePairs) }

  // Sets the inputs values of zero or more input Nodes WITHOUT updating the node values.
  setInputs (keyValuePairs) { return Client.setInputs(this, keyValuePairs) }

  // Adds or deletes zero or more Nodes from the selection set WITHOUT updating the required set or node values.
  setSelected (keyValuePairs) { return Client.setSelected(this, keyValuePairs) }

  _idxKey (nodeIdx) { return nodeIdx + ': ' + this.nodeKey(nodeIdx) }
  _idxKeys (idxArray) { return idxArray.map(idx => this._idxKey(idx)) }
  _parms (idxArray) {
    return idxArray.map(parm => { return parm[0] ? "'" + parm[1] + "'" : this._idxKey(parm[1]) })
  }

  nodeObject (nodeIdx) {
    return {
      idx: nodeIdx,
      key: this.nodeKey(nodeIdx),
      configKeys: this._idxKeys(this.nodeConfigs(nodeIdx)),
      consumers: this._idxKeys(this.nodeConsumers(nodeIdx)),
      enabled: this.nodeEnabled(nodeIdx),
      inputs: this.nodeInputs(nodeIdx),
      isBound: this.nodeIsBound(nodeIdx),
      isConfig: this.nodeIsConfig(nodeIdx),
      isDangler: this.nodeIsDangler(nodeIdx),
      isEnabled: this.nodeIsEnabled(nodeIdx),
      isFixed: this.nodeIsFixed(nodeIdx),
      isInput: this.nodeIsInput(nodeIdx),
      isRequired: this.nodeIsRequired(nodeIdx),
      isRequiredConfig: this.nodeIsRequiredConfig(nodeIdx),
      isRequiredInput: this.nodeIsRequiredInput(nodeIdx),
      isSelected: this.nodeIsSelected(nodeIdx),
      order: this.nodeOrder(nodeIdx),
      methodParms: this._parms(this.nodeMethodParms(nodeIdx)),
      methodRef: this.nodeMethodRef(nodeIdx),
      producers: this._idxKeys(this.nodeProducers(nodeIdx)),
      updaterIdx: this.nodeUpdaterIdx(nodeIdx),
      value: this.nodeValue(nodeIdx),
      variantClass: this.nodeVariantClass(nodeIdx)
    }
  }
}