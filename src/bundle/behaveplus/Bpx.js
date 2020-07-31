import { Dag } from '../pando/index.js'
import * as Dna from './BpxDna.js'

export class Bpx extends Dag {
  constructor () {
    super(Dna)
  }
}
