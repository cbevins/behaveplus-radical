export class LoopIterator {
  constructor (start, stop, step = 1) {
    this.val = start
    this.start = start
    this.stop = stop
    this.step = step
  }

  * [Symbol.iterator] () {
    if (this.start < this.stop) {
      while (this.val <= this.stop) {
        yield this.val
        this.val += this.step
      }
    } else {
      while (this.val >= this.stop) {
        yield this.val
        this.val -= this.step
      }
    }
  }
}
