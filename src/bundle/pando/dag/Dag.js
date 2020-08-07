/**
 * The Dag class simply provides the API between the client and the DagDna
 * @copyright 2020 Systems for Environmental Management
 * @author Collin D. Bevins, <cbevins@montana.com>
 * @license MIT
 * @version 0.1.0
 * coverage-20200506
 */
import { DagDna } from './DagDna.js'

export class Dag {
  constructor (dna) {
    if (arguments.length !== 1) throw new Error('new Dag(dna) requires a Dna argument')
    if (dna.dagMethod === undefined) throw new Error('new Dag(dna) arg 1 is not a valid Dna argument')
    this.dna = new DagDna(dna)
  }

  clearInputs () { this.dna.clearInputs() }

  clearSelected () { this.dna.clearSelected() }

  // Returns a Node reference given a Node reference, a Node key string, or a Node indice.
  get (nodeRefKeyIdx) { return this.dna.get(nodeRefKeyIdx) }

  nodeIsInput (node) { return this.dna.nodeIsInput(node) }

  // Returns an array of required input Node references in topological order
  requiredConfigNodes () { return this.dna.requiredConfigNodes() }

  // Returns an array of required input Node references in topological order
  requiredInputNodes () { return this.dna.requiredInputNodes() }

  // Returns an array of required Node references in topological order
  requiredNodes () { return this.dna.requiredNodes() }

  // Returns an array of all required, updatable (non-Config-ish) Node references in topological order.
  requiredUpdateNodes () { return this.dna.requiredUpdateNodes() }

  // Returns the results object {elasped: <ms>, map: <nodeMap>, message: <str>, ok: <bool>, runs: <n>,runLimit: <n>}
  results () { return this.dna.results }

  // Returns an array of result run indices that satisfy the input node-value pair specs
  resultIndices (inputNodeValuePairs) { return this.dna.resultIndices(inputNodeValuePairs) }

  // Returns the Node's result value for the specified run index
  resultValue (nodeRefOrKey, runIdx) { return this.dna.resultValue(nodeRefOrKey, runIdx) }

  // Sets the value of zero or more Config Nodes, resets the Dag topology, AND updates all Node values
  runConfigs (keyValuePairs) { return this.dna.runConfigs(keyValuePairs) }

  // Sets the inputs values of zero or more input Nodes AND updates all Node values
  runInputs (keyValuePairs) { return this.dna.runInputs(keyValuePairs) }

  // Sets the value of zero or more Module (and their Link) Nodes, AND updates all Node values
  runModules (keyValuePairs) { return this.dna.runModules(keyValuePairs) }

  // Sets the value of zero or more Config Nodes, AND updates all Node values
  runSelected (keyValuePairs) { return this.dna.runSelected(keyValuePairs) }

  // Returns an array of references to all selected Nodes
  selectedNodes () { return this.dna.selectedNodes() }

  // Sets the value of zero or more Config Nodes WITHOUT updating any other Node values
  setConfigs (keyValuePairs) { return this.dna.setConfigs(keyValuePairs) }

  // Sets the inputs values of zero or more input Nodes WITHOUT updating any other Node values
  setInputs (keyValuePairs) { return this.dna.setInputs(keyValuePairs) }

  // Sets the run mode to 'orthogonal'
  setModeCasewise () { this.dna.mode = 'casewise' }
  setModeOrthogonal () { this.dna.mode = 'orthogonal' }

  // Sets the value of zero or more Module (and their Link) Nodes WITHOUT updating any other Node values
  setModules (keyValuePairs) { return this.dna.setModules(keyValuePairs) }

  setRunLimit (limit) { this.dna.setRunLimit(limit) }

  // Adds or deletes zero or more Nodes from the selection set WITHOUT updating the required set or node values.
  setSelected (keyValuePairs) { return this.dna.setSelected(keyValuePairs) }

  setStoreFunction (storeFunction) { this.dna.storeFunction = storeFunction }
}
