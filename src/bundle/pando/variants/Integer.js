/**
 * @file Integer Variant class
 * @copyright 2020 Systems for Environmental Management
 * @author Collin D. Bevins, <cbevins@montana.com>
 * @license MIT
 * @version 0.1.0
 * #coverage-20200506
 */
import { Numeric } from './Numeric.js'

/**
 * Integer is a Numeric Variant whose value is an integer.
 */
export class Integer extends Numeric {
  constructor (
    defaultValue = 0,
    minValue = 1 - Number.MAX_VALUE,
    maxValue = Number.MAX_VALUE
  ) {
    if (
      typeof defaultValue !== 'number' ||
      Number.isInteger(defaultValue) === false
    ) {
      throw new Error(
        `new Variant.Integer(${defaultValue}) requires the 'defaultValue' argument to be an integer 'number'`
      )
    } else if (
      typeof minValue !== 'number' ||
      Number.isInteger(minValue) === false
    ) {
      throw new Error(
        `new Variant.Integer(${defaultValue}, ${minValue}) requires the 'minValue' argument to be an integer 'number'`
      )
    } else if (
      typeof maxValue !== 'number' ||
      Number.isInteger(maxValue) === false
    ) {
      throw new Error(
        `new Variant.Integer(${defaultValue}, ${minValue}, ${maxValue}) requires an 'maxValue' argument to be an integer 'number'`
      )
    }
    super(defaultValue, minValue, maxValue)
    this._validator.isInteger = value => Number.isInteger(value)
  }
}
