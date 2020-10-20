import { nodeLabel } from '../../utils/utils.js'

export class Node {
  constructor (nodeIdx, nodeKey, variantRef) {
    this.consumers = [] // aray of references to consumer Nodes
    this.depth = 0
    this.idx = nodeIdx // index into the Dna.updater[] array, used only by DagDna.nodeConfigs()
    this.isEnabled = true
    this.label = null
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

  displayLabel () {
    return this.label || nodeLabel(this.key)
  }

  displayLine () {
    return this.displayLabel() + ' ' + this.displayString()
  }

  /**
   * Return Node's value as a (possibly decorated) string
   * For Quantity, the string is the current value after:
   * - conversion into the current display units-of-measure,
   * - truncation of digits to current display precision, decimals, or exponentiation, and
   * - the current units-of-measure string appended.
   */
  displayString () { return this.variant.displayString(this.value) }

  /**
   * Return Node's value as a (possibly decorated) string
   * For Quantity, the string is the current value after:
   * - conversion into the current display units-of-measure, and
   * - truncation of digits to current display precision, decimals, or exponentiation.
   */
  displayValue () { return this.variant.displayValue(this.value) }

  // Throws an Error() if `value` is a NOT valid for this Node's Variant class.
  // variant.isValid() returns object { pass: <bool>, value: <testValue>, fails: <failedTestName> }
  ensureValidValue (value) {
    const result = this.variant.isValid(value)
    if (!result.pass) {
      throw new Error(`Node ${this.key} value ${value} fails test ${result.fails}`)
    }
    return value
  }

  // Returns TRUE if `value` is a valid value for this Node's Variant class.
  isValidValue (value) { return (this.variant.isValid(value)).pass }

  // Set's this Node's value AFTER ensuring it is valid.
  setValue (value) {
    this.value = this.ensureValidValue(value)
    return this.value
  }

  /**
   * Updates the Node's value by calling its updater method and storing the result.
   *
   * NOTE: This is the most heavily used function in the entire system.
   * DO NOT use this.update.args.map() to iterate over method args,
   * as it increases execution time time by 50% !!!
   */
  updateValue () {
    const args = []
    for (let i = 0; i < this.update.args.length; i++) {
      const parm = this.update.args[i]
      args.push((parm instanceof Node) ? parm.value : parm)
    }
    this.value = this.update.method.apply(this, args)
  }
}
