import { DagDna } from './DagDna.js'

export class Dag {
  constructor (dna) {
    this.dna = new DagDna(dna)
  }

  clearInputs () { return this.dna.clearInputs() }
  clearSelected () { return this.dna.clearSelected() }
  get (node) { return this.dna.nodeIdx(node) } // Legacy
  hasNodeKey (nodeKey) { return this.dna.hasNodeKey(nodeKey) }
  nodeIdx (node) { return this.dna.nodeIdx(node) }
  nodeIsRequired (node) { return this.dna.nodeIsRequired(node) }
  nodeIsSelected (node) { return this.dna.nodeIsSelected(node) }
  nodeKey (node) { return this.dna.nodeKey(node) }
  nodeValue (node) { return this.dna.nodeValue(node) }
  nodeVariant (node) { return this.dna.nodeVariant(node) }
  requiredNodes () { return this.dna.requiredNodes() }
  requiredConfigNodes () { return this.dna.requiredConfigNodes() }
  requiredInputNodes () { return this.dna.requiredInputNodes() }
  requiredUpdateNodes () { return this.dna.requiredUpdateNodes() }
  runConfigs (keyValuePairs) { return this.dna.runConfigs(keyValuePairs) }
  runInputs (keyValuePairs) { return this.dna.runInputs(keyValuePairs) }
  runSelected (keyTogglePairs) { return this.dna.runSelected(keyTogglePairs) }
  selectedNodes () { return this.dna.selectedNodes() }
  setConfigs (keyValuePairs) { return this.dna.setConfigs(keyValuePairs) }
  setInputs (keyValuePairs) { return this.dna.setInputs(keyValuePairs) }
  setSelected (keyTogglePairs) { return this.dna.setSelected(keyTogglePairs) }
}
