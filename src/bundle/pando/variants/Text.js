/**
 * @file Text Variant class
 * @copyright 2020 Systems for Environmental Management
 * @author Collin D. Bevins, <cbevins@montana.com>
 * @license MIT
 * @version 0.1.0
 * #coverage-20200506
 */
import { AbstractVariant } from './AbstractVariant.js'
/**
 * Text is a Variant whose value is a Javascript string primitive.
 */
export class Text extends AbstractVariant {
  constructor (defaultValue = '', minLength = 0, maxLength = 999999) {
    if (typeof defaultValue !== 'string') {
      throw new Error(
        `new Variant.Text(${defaultValue}) requires the 'defaultValue' argument to be a 'string'`
      )
    } else if (typeof minLength !== 'number') {
      throw new Error(
        `new Variant.Text(${defaultValue}, ${minLength}) requires the 'minLength' argument to be a 'number', but received a ${typeof minLength}`
      )
    } else if (typeof maxLength !== 'number') {
      throw new Error(
        `new Variant.Text(${defaultValue}, ${minLength}, ${maxLength}) requires an 'maxLength' argument to be a 'number'`
      )
    } else if (minLength > maxLength) {
      throw new Error(
        `new Variant.Text(${defaultValue}, ${minLength}, ${maxLength}) minLength exceeds maxLength`
      )
    } else if (defaultValue.length < minLength) {
      throw new Error(
        `new Variant.Text(${defaultValue}, ${minLength}, ${maxLength}) defaultValue length is less than minLength`
      )
    } else if (defaultValue.length > maxLength) {
      throw new Error(
        `new Variant.Text(${defaultValue}, ${minLength}, ${maxLength}) defaultValue length exceeds maxLength`
      )
    }
    super(defaultValue)
    this._specs._minimumLength = minLength
    this._specs._maximumLength = maxLength
    this._validator.isString = value => typeof value === 'string'
    this._validator.minimumLength = value => value.length >= this._specs._minimumLength
    this._validator.maximumLength = value => value.length <= this._specs._maximumLength
  }
}
