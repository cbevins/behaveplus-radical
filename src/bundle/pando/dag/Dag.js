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

  // Returns the elapsed time of the previous update
  elapsed () { return this.dna.results.elapsed }

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

  // Sets the value of zero or more Config Nodes, then resets the DAG topology and Required Set
  runConfigs (keyValuePairs) { return this.dna.runConfigs(keyValuePairs) }

  // Returns an array of result run indices that satisfy the input node-value pair specs
  runIndices (inputNodeValuePairs) { return this.dna.runIndices(inputNodeValuePairs) }

  // Sets the inputs values of zero or more input Nodes AND updates all Dag Node values
  runInputs (keyValuePairs) { return this.dna.runInputs(keyValuePairs) }

  // Returns the number of runs from the last update
  runs () { return this.dna.results.runs }

  // Sets the value of zero or more Config Nodes, then resets the Required Set AND updates all Dag Node values
  runSelected (keyValuePairs) { return this.dna.runSelected(keyValuePairs) }

  // Returns the Node's result value for the specified run index
  runValue (nodeRefOrKey, runIdx) { return this.dna.runValue(nodeRefOrKey, runIdx) }

  // Returns an array of references to all selected Nodes
  selectedNodes () { return this.dna.selectedNodes() }

  // Sets the value of zero or more Config Nodes, then resets the DAG topology and required set
  setConfigs (keyValuePairs) { return this.dna.setConfigs(keyValuePairs) }

  // Sets the inputs values of zero or more input Nodes WITHOUT updating the node values.
  setInputs (keyValuePairs) { return this.dna.setInputs(keyValuePairs) }

  // Sets the run mode to 'orthogonal'
  setModeCasewise () { this.dna.mode = 'casewise' }
  setModeOrthogonal () { this.dna.mode = 'orthogonal' }

  // Adds or deletes zero or more Nodes from the selection set WITHOUT updating the required set or node values.
  setSelected (keyValuePairs) { return this.dna.setSelected(keyValuePairs) }
}
