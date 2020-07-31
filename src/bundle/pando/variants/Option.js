/**
 * @file Option Variant class
 * @copyright 2020 Systems for Environmental Management
 * @author Collin D. Bevins, <cbevins@montana.com>
 * @license MIT
 * @version 0.1.0
 * #coverage-20200506
 */
import { AbstractVariant } from './AbstractVariant.js'

/**
 * Option is a Variant whose value is a Javascript string primitive
 * and a member of a predefined set of strings.
 */
export class Option extends AbstractVariant {
  constructor (validOptionsArray, defaultOptionIndex = 0) {
    if (!(validOptionsArray instanceof Array)) {
      throw new Error(
        `new Variant.Option(${validOptionsArray}) options array is not an array`
      )
    } else if (
      defaultOptionIndex < 0 ||
      defaultOptionIndex >= validOptionsArray.length
    ) {
      throw new Error(
        `new Variant.Option(${validOptionsArray}, ${defaultOptionIndex}) defaultOptionIndex is invalid`
      )
    }
    super(validOptionsArray[defaultOptionIndex])
    this._specs._options = validOptionsArray
    this._validator.isString = value => typeof value === 'string'
    this._validator.isMember = value => this.has(value)
  }

  displayString (option) {
    this.ensure(option)
    // @todo Check for translation table
    return option
  }

  ensure (option) {
    if (!this.has(option)) {
      throw new Error(`Invalid Option '${option}'`)
    }
    return true
  }

  has (option) {
    return this._specs._options.includes(option)
  }

  options () {
    return this._specs._options
  }
}
