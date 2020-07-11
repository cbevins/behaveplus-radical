// factor is for converting a value in the base amount to the named units
// Fur example, to convert 6 ft = 6*12 in, 6/3 yd, and 6/66 ch
export const UnitsArray = [
  // unity
  ['1', 1],

  // distance
  ['ft', 1], // based on [ft_us}, NOT [ft_i]]
  ['ch', 1 / 66],
  ['in', 12],
  ['mi', 1 / 5280],
  ['yd', 1 / 3],
  ['m', 0.3048],
  ['cm', 30.48],
  ['mm', 304.8],
  ['km', 0.0003048],

  ['ac', 1 / 43560],
  ['ha', 1 / 107639],

  // energy
  ['btu', 1], // [Btu_IT]
  ['J', 1055.05585262], // btu_IT:

  // mass
  ['lb', 1],
  ['oz', 16],
  ['ton', 1 / 2000],
  ['kg', 0.45359237],
  ['g', 453.59237],
  ['T', 0.00045359237], // 1 / 2204.622621848776

  // ratio
  ['ratio', 1],
  ['percent', 100],
  ['%', 100],

  // temp
  ['F', 1],
  ['C', 5 / 9],
  ['K', 5 / 9],

  // time
  ['min', 1],
  ['s', 60],
  ['h', 1 / 60],
  ['d', 1 / (60 * 24)],
  ['y', 1 / (60 * 24 * 365)]
]

const UnitsMap = new Map(UnitsArray)

/**
 * Returns the 'asUnits' amount that is equivalent to base units `baseAmount`
 */
export function asAmount (baseAmount, asUnits) {
  // Special case:: temperature scale
  if (asUnits === 'F') {
    return baseAmount
  } else if (asUnits === 'C') {
    return ((baseAmount - 32) * 5) / 9
  } else if (asUnits === 'K') {
    return 459.67 + ((baseAmount - 32) * 5) / 9
  }
  const f = factor(asUnits)
  return f * baseAmount
}

/**
 * Returns the base amount that is equivalent to `fromAmount` `fromUnits`
 */
export function baseAmount (fromAmount, fromUnits) {
  // Special case:: temperature scale
  if (fromUnits === 'F') {
    return fromAmount
  } else if (fromUnits === 'C') {
    return 32 + (9 * fromAmount / 5)
  } else if (fromUnits === 'K') {
    return 32 + (9 * fromAmount / 5) + 459.67
  }
  const f = factor(fromUnits)
  return fromAmount / f
}

/**
 *
 * @param {numeric} fromAmount
 * @param {string} fromUnits
 * @param {string} intoUnits
 *
 * NOTE: This does not test if `fromUnits` and `intoUnits` are compatible!
 */
export function convert (fromAmount, fromUnits, intoUnits) {
  return asAmount(baseAmount(fromAmount, fromUnits), intoUnits)
}

/**
 * Returns the conversion factor to convert an amount from `units`
 * into its (anonymous) base units.
 *
 * @param {string} units Units-of-measure string.  The following syntax is accepted:
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

// Example of a Dag Variant class instance
export class VariantFuelLoad {
  constructor () {
    this.units = ['lb/ft2', 't/ac', 'kg/m2', 'T/ha']
    this.display = {
      units: 'lb/ft2',
      mode: 'decimals', // decimals, exponential, precision
      digits: 2
    }
  }
}
