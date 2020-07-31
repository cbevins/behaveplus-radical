import { Option } from '../../pando/index.js'
import * as Lib from '../equations/index.js'
/**
 * Declares the specialized BehavePlus Option Variants used by nodes and equations.
 *
 * Note that classes derived from Crucible.Variant.Option() require an array of options argument.
 */

export class ChaparralTypeOption extends Option {
  constructor () { super(Lib.Chaparral.Types) }
}

export class CrownFireInitiationTypeOption extends Option {
  constructor () { super(Lib.CrownFire.InitiationTypes) }
}

export class FuelModelDomainOption extends Option {
  constructor () { super(Lib.FuelCatalog.Domains) }
}

export class FuelModelKeyOption extends Option {
  constructor () {
    super(Lib.FuelCatalog.keys())
    this._specs._defaultValue = '10'
  }
}

export class IgnitionFuelTypeOption extends Option {
  constructor () { super(Lib.IgnitionProbability.LightningFuels) }
}

export class IgnitionLightningChargeOption extends Option {
  constructor () { super(Lib.IgnitionProbability.LightningCharges) }
}

export class SpottingSourceLocationOption extends Option {
  constructor () { super(Lib.Spotting.locations()) }
}

export class TorchingTreeSpeciesOption extends Option {
  constructor () { super(Lib.Spotting.TorchingTreeSpecies) }
}

export class TreeSpeciesFofem6Option extends Option {
  constructor () { super(Lib.TreeMortality.fofem6Codes()) }
}

export class WesternAspenTypeOption extends Option {
  constructor () { super(Lib.WesternAspen.Types) }
}
