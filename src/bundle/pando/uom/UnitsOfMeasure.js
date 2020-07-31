/**
 * @file Data and methods to support Quantity units-of-measure and conversions.
 * @copyright 2020 Systems for Environmental Management
 * @author Collin D. Bevins, <cbevins@montana.com>
 * @license MIT
 * @version 0.1.0
 * #coverage-20200506
 */

/**
  * UnitsOfMeasure defines all base units which are subsequently
  * which are subsequently exponentiated and/or combined into
  * derived units-of-measure.
  *
  * Some examples:
  * - the distance UoM 'ft' and the time UoM 'min' are combined
  *   to form the derived UoM velocity of 'ft/min'
  * - the distance UoM 'ft' is eponentiated to form area 'ft2' and volume 'ft3'
  * - and so forth, such as 'btu/ft2-s'
  *
  * The array also includes UoMs with special names that cannot be parsed
  * into their base units; 'ac', 'ha', and 'W' for example.  Otherwise, only the
  * fundamental units are defined here.
  *
  * Each entry is a 2-element array:
  * - Element 0 is the unit-of-measure key,
  * - Element 1 is a multiplication factor for converting a value
  *   from its (arbitrary) *base* amount into the units-of-measure key amount.
  *
  * For example, to convert from 'x' ft into
  * - inches, multiply by 12,
  * - yards, multiply by 1/3, and
  * - chains, multiply by 1/11
  *
  * The *base* unit-of-measure is arbitrarily chosen for each fundamental
  * quantity (arc, distance, energy, mass, ratio, temperature, time).
  * While it is never necessary for the client to know what base unit was chosen,
  * it can be ascertained by its multiplication factor === 1.
  */
export const UnitsOfMeasure = [
  // unity
  ['1', 1],

  // arc ('deg' is the base)
  ['deg', 1],
  ['\u00B0', 1],
  ['\u2109', 1], // oF
  ['\u2103', 1], // oC

  // distance ('ft' is base)
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
  ['W', 1 / 0.057],

  // energy ('btu' is base)
  ['btu', 1], // [Btu_IT]
  ['J', 1055.05585262], // btu_IT:

  // mass ('lb' is base)
  ['lb', 1],
  ['oz', 16],
  ['ton', 1 / 2000],
  ['kg', 0.45359237],
  ['g', 453.59237],
  ['T', 0.00045359237], // 1 / 2204.622621848776

  // ratio ('ratio' is base)
  ['ratio', 1],
  ['percent', 100],
  ['%', 100],

  // temp ('F' is base)
  ['F', 1],
  ['C', 5 / 9],
  ['K', 5 / 9],

  // time ('min' is base)
  ['min', 1],
  ['s', 60],
  ['h', 1 / 60],
  ['d', 1 / (60 * 24)],
  ['y', 1 / (60 * 24 * 365)]
]

export const UnitsMap = new Map(UnitsOfMeasure)
