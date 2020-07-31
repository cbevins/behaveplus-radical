/**
 * @file Units-of-measure conversion methods
 * @copyright 2020 Systems for Environmental Management
 * @author Collin D. Bevins, <cbevins@montana.com>
 * @license MIT
 * @version 0.1.0
 * #coverage-20200506
 */
import { UnitsMap } from './UnitsOfMeasure.js'

/**
 * Returns the 'asUnits' amount that is equivalent to base units `baseAmount`
 *
 * This is used by the behaveplus-dag Node class to convert Node values
 * (which are stored in base units) to some other display/output units-of-measure.
 *
 * @param {number} baseAmount The amount of some Quantity expressed in its base units
 * @param {string} asUnits The amount of the Quantity expressed in the `asUnits`
 */
export function asAmount (baseAmount, asUnits) {
  // Special case:: temperature scale
  if (asUnits === 'F' || asUnits === '\u2109') {
    return baseAmount
  } else if (asUnits === 'C' || asUnits === '\u2103') {
    return ((baseAmount - 32) * 5) / 9
  } else if (asUnits === 'K') {
    return 273.15 + ((baseAmount - 32) * 5) / 9
  }
  const f = factor(asUnits)
  return f * baseAmount
}

/**
 * Returns the base amount that is equivalent to `fromAmount` `fromUnits`
 *
 * This is used by the behaveplus-dag Node class to convert display/input amounts
 * into Node values (which are stored in base units).
 *
 * @param {number} fromAmount The amount of some Quantity expressed in `asUnits`
 * @param {string} fromUnits The `fromAmount` units-of-measure
 */
export function baseAmount (fromAmount, fromUnits) {
  // Special case:: temperature scale
  if (fromUnits === 'F' || fromUnits === '\u2109') {
    return fromAmount
  } else if (fromUnits === 'C' || fromUnits === '\u2103') {
    return 32 + (9 * fromAmount / 5)
  } else if (fromUnits === 'K') {
    return 32 + (9 * (fromAmount - 273.15) / 5)
  }
  const f = factor(fromUnits)
  return fromAmount / f
}

/**
 * Converts an amount from some units-of-measure into another units-of-measure.
 *
 * @param {number} fromAmount The amount of some quantity as measured in `fromUnits`
 * @param {string} fromUnits The units-of-measure of the `fromAmount`
 * @param {string} intoUnits The units-of-measure of the converted amount.
 * @return {number} The `fromAmount` converted into `intoUnits`
 *
 * NOTE: This does not test if `fromUnits` and `intoUnits` are compatible!
 */
export function convert (fromAmount, fromUnits, intoUnits) {
  return asAmount(baseAmount(fromAmount, fromUnits), intoUnits)
}

/**
 * Returns the multiplication factor to convert an amount from `units`
 * into its (anonymous) base units.
 *
 *  This function does some basic parsing of compound units-of-measure,
 *  and can handle the following syntax:
 * - 'ft' (simple one-dim measure, simple single term)
 * - 'ft2'  (multi-dim measure, simple single term)
 * - 'ft3' (multi-dim measure, simple single term)
 * - 'ft/min' (simple one-dim numerator with simple on-dim denom)
 * - 'ft2/ft3' (simple multi-dim numerator with simple multi-dim denom)
 * - '1/ft'  (reduced simple multi-dim numerator with simple multi-dim denom)
 * - 'lb/ft2'
 * - 'T/ha', 't/ac' (multi-dim measure with an alias)
 * - 'lb/ft3'
 * - 'btu/ft/s'
 * - 'btu/ft-s'
 * - 'ft-lb/min'
 *
 * This function can also be used to ensure correct uinots-of-measure strings,
 * as it will throw an Error if it is unable to parse the units.
 *
 * @param {string} units Units-of-measure string.  The following syntax is accepted:
 * @returns {number} The multiplication factor to convert an amount from some `units`
 * into its (anonymous) base units.
 */
export function factor (units) {
  let f = 1
  // split into at least 1 numerator and 0 or more denominators
  units.split('/').forEach((part, idx) => {
    // Special case: numerator is just '1' as in '1/ft'
    if (idx === 0 && part === '1') {
      // nothing to do, just carry on
    } else {
      // split into terms
      part.split('-').forEach(term => {
        let power = 1
        let uom = term
        const lastChar = term.charAt(term.length - 1)
        if (lastChar === '2') {
          uom = term.substring(0, term.length - 1)
          power = 2
        } else if (lastChar === '3') {
          power = 3
          uom = term.substring(0, term.length - 1)
        }
        if (!UnitsMap.has(uom)) {
          throw new Error(`Units '${units} term '${term}' uom '${uom}' is invalid`)
        }
        const termFactor = UnitsMap.get(uom) ** power
        // If before the first '/', multiply; otherwise, divide
        f *= (idx === 0) ? termFactor : (1 / termFactor)
      })
    }
  })
  return f
}
