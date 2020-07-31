/**
 * @file Slope Variant class
 * @copyright 2020 Systems for Environmental Management
 * @author Collin D. Bevins, <cbevins@montana.com>
 * @license MIT
 * @version 0.1.0
 * #coverage-20200506
 */
import { Quantity } from './Quantity.js'

/**
 * Slope is a special case of Quantity, as it can be expressed
 * in 2 distinct systems of measurement:
 * - as a ratio of delta vertical / delta horizontal (range 0..inf),
 * - or as degrees above the horizontal (range 0..90)
 */
export class Slope extends Quantity {
  // 'ratio' is the base, and we handle 'deg' as special case
  constructor (defaultValue = 0) {
    super(['ratio', 'percent', '%'], defaultValue)
  }

  baseAsUom (baseAmount, asUnits) {
    return asUnits === 'deg'
      ? Slope.slopeDegrees(baseAmount)
      : Quantity.prototype.baseAsUom(baseAmount, asUnits)
  }

  baseFromUom (fromAmount, fromUnits) {
    return fromUnits === 'deg'
      ? Quantity.prototype.baseFromUom(
        Slope.slopeRatio(fromAmount), 'ratio')
      : Quantity.prototype.baseFromUom(fromAmount, fromUnits)
  }

  convert (fromAmount, fromUnits, intoUnits) {
    return this.baseAsUom(this.baseFromUom(fromAmount, fromUnits), intoUnits)
  }

  /**
   * @return Array of units-of-measure property key strings available for this Quantity
   */
  uomKeys () {
    return ['ratio', 'percent', '%', 'deg']
  }

  static constrain (degrees) {
    while (degrees >= 90) {
      degrees -= 90
    }
    while (degrees < 0) {
      degrees += 90
    }
    return degrees
  }

  static degrees (radians) {
    return (radians * 180) / Math.PI
  }

  static radians (degrees) {
    return (degrees * Math.PI) / 180
  }

  static slopeDegrees (ratio) {
    const radians = Math.atan(ratio)
    return Slope.degrees(radians)
  }

  static slopeRatio (degrees) {
    const rad = Slope.radians(Slope.constrain(degrees))
    return Math.tan(rad)
  }
}
