/**
 * @file Quantity class
 * @copyright 2020 Systems for Environmental Management
 * @author Collin D. Bevins, <cbevins@montana.com>
 * @license MIT
 * @version 0.1.0
 * #coverage-20200506
 */
import { Float } from './Float.js'
import * as Uom from '../uom/index.js'

/**
 * Quantity is a Float Variant class with a minimum value of 0 and a units-of-measure.
 *
 * In addition to a 'base' units-of-measure, a Quantity has a current display
 * units-of-measure; calling displayString() transforms the base amount to the display amount.
 *
 * Quantity is able to convert between a base units-of-measure and other defined
 * units-of-measure.
 */
export class Quantity extends Float {
  /**
   *
   * @param {string[]} uom Array of allowed units-of-measure (i.e., ['lb/ft2', 't/ac', 'kg/m2', 'T/ha'] )
   * @param {number} defaultValue  If omitted, set to 0
   * @param {number} maxValue If omitted, set to Number.MAX_VALUE
   */
  constructor (uomArray, defaultValue = 0, maxValue = Number.MAX_VALUE) {
    if (!(uomArray instanceof Array)) {
      throw new Error(`Quantity() arg 1 expects an array, but got '${typeof uomArray}'`)
    }
    uomArray.forEach(uom => Uom.factor(uom))
    super(defaultValue, 0, maxValue)
    this._specs._uomArray = uomArray
    this._display._units = uomArray[0]
  }

  /**
   * Returns the `baseAmount` expressed in the current display units-of-measure.
   * @param {number} baseAmount  The base amount (usually a Quantity Node value)
   */
  baseAsDisplayUom (baseAmount) {
    return this.baseAsUom(baseAmount, this._display._units)
  }

  /**
   * Returns the `baseAmount` expressed in `asUnits`
   * @param {number} baseAmount
   * @param {string} asUnits
   */
  baseAsUom (baseAmount, asUnits) {
    // First get factor between Quantity native units and converter base units
    // This will be 1 for all Quantities whose native units are already in converter base units
    // This will be 12 for Quantities with 'in' instead of 'ft' native units
    // This will be 1/60 for Quantities with 's' instead of 'min' time units
    // This will be 0.000001902587519025875 for Quantities with 'y' instead of 'min' time units
    const factor =  Uom.asAmount(1, this._specs._uomArray[0])
    // Then convert the root amount into the requested units
    return Uom.asAmount(baseAmount, asUnits) / factor
  }

  /**
   * Returns the `fromAmount` expressed in its base units-of-measure.
   * @param {number} fromAmount The quantity amount expressed in `fromUnits`
   * @param {string} fromUnits The `fromAmount` units-of-measure
   */
  baseFromUom (fromAmount, fromUnits) {
    return Uom.baseAmount(fromAmount, fromUnits)
  }

  convert (fromAmount, fromUnits, intoUnits) {
    return Uom.convert(fromAmount, fromUnits, intoUnits)
  }

  /**
   * Usually called by Node to express its current value on some display units and format.
   * @param {number} baseAmount
   */
  displayString (baseAmount) {
    return `${this.displayValue(baseAmount)} ${this._display._units}`
  }

  displayUnits () {
    return this._display._units
  }

  /**
   * Usually called by Node to express its current value on some display units and format.
   * @param {number} baseAmount
   */
  displayValue (baseAmount) {
    const displayAmount = this.baseAsDisplayUom(baseAmount)
    return Float.prototype.displayValue.call(this, displayAmount)
  }

  setDisplayUnits (units) {
    Uom.factor(units) // throws Error if bad units
    this._display._units = units
  }

  /**
   * @return Array of units-of-measure property key strings available for this Quantity
   */
  uomKeys () {
    return this._specs._uomArray
  }
}
