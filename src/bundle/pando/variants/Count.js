/**
 * @file Count and Index Variant classes
 * @copyright 2020 Systems for Environmental Management
 * @author Collin D. Bevins, <cbevins@montana.com>
 * @license MIT
 * @version 0.1.0
 * #coverage-20200506
 */
import { Integer } from './Integer.js'
/**
 * Count is an Integer Variant whose minimum value is 0.
 */
export class Count extends Integer {
  constructor (defaultValue = 0, maxValue = Number.MAX_VALUE) {
    super(defaultValue, 0, maxValue)
  }
}

/**
 * Index is an Count Variant whose maximum value is size-1.
 */
export class Index extends Count {
  constructor (maxSize = 1) {
    super(0, maxSize - 1)
    this._specs._maxSize = maxSize
  }
}
