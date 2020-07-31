/**
 * @file Blob Variant class
 * @copyright 2020 Systems for Environmental Management
 * @author Collin D. Bevins, <cbevins@montana.com>
 * @license MIT
 * @version 0.1.0
 * #coverage-20200506
 */
import { AbstractVariant } from './AbstractVariant.js'

/**
 * Blob is an Variant whose value is a generic Javascript Object.
 *
 * Blob should be treated as an abstract class: derived classes
 * should be developed for Nodes with a specific value object structure.
 */
export class Blob extends AbstractVariant {
  constructor (defaultValue = {}) {
    if (typeof defaultValue !== 'object') {
      throw new Error(
        `new Variant.Blob(${JSON.stringify(
          defaultValue
        )}) requires an the 'defaultValue' argument to be an 'object'`
      )
    }
    super(defaultValue)
  }

  displayString (value) {
    return JSON.stringify(value)
  }
}
