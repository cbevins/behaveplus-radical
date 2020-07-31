/**
 * @file Numeric Variant class
 * @copyright 2020 Systems for Environmental Management
 * @author Collin D. Bevins, <cbevins@montana.com>
 * @license MIT
 * @version 0.1.0
 * #coverage-20200506
 */
import { AbstractVariant } from './AbstractVariant.js'
/**
 * Numeric is a Variant whose value is a Javascript number primitive
 * and whose filters ensure a numeric value.
 */
export class Numeric extends AbstractVariant {
  constructor (
    defaultValue = 0,
    minValue = 1 - Number.MAX_VALUE,
    maxValue = Number.MAX_VALUE
  ) {
    if (typeof defaultValue !== 'number') {
      throw new Error(
        `new Variant.Numeric(${defaultValue}) requires the 'defaultValue' argument to be a 'number'`
      )
    } else if (typeof minValue !== 'number') {
      throw new Error(
        `new Variant.Numeric(${defaultValue}, ${minValue}) requires the 'minValue' argument to be a 'number'`
      )
    } else if (typeof maxValue !== 'number') {
      throw new Error(
        `new Variant.Numeric(${defaultValue}, ${minValue}, ${maxValue}) requires an 'maxValue' argument to be a 'number'`
      )
    } else if (minValue > maxValue) {
      throw new Error(
        `new Variant.Numeric(${defaultValue}, ${minValue}, ${maxValue}) minValue exceeds maxValue`
      )
    } else if (defaultValue < minValue) {
      throw new Error(
        `new Variant.Numeric(${defaultValue}, ${minValue}, ${maxValue}) defaultValue is less than minValue`
      )
    } else if (defaultValue > maxValue) {
      throw new Error(
        `new Variant.Numeric(${defaultValue}, ${minValue}, ${maxValue}) defaultValue exceeds maxValue`
      )
    }
    super(defaultValue)
    this._specs._minimumValue = minValue
    this._specs._maximumValue = maxValue
    this._validator.isNumeric = value => typeof value === 'number'
    this._validator.minimumValue = value => value >= this._specs._minimumValue
    this._validator.maximumValue = value => value <= this._specs._maximumValue
  }
}
