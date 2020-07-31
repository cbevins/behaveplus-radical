import { Blob, Count, Index, Float, Quantity, Slope, Text } from '../../pando/index.js'

/**
 * Declares the specialized BehavePlus numeric (Quantity, Float, Integer) Variants.
 *
 * Note that classes derived from Crucible.Variant.Quantity()
 * require an array of valid units-of-measure as its first argument.
 */

// Part 1 - Base Variants for more specialized BehavePlus Variants

export { Bool } from '../../pando/index.js'

export class CompassAzimuth extends Quantity {
  constructor () { super(['deg'], 0, 360) }
}

export class Factor extends Float {}

export class Fraction extends Quantity {
  constructor () { super(['ratio', 'percent', '%'], 0, 1) }
}

export class NonNegativeFactor extends Float {
  constructor () { super(0, 0, 0) }
}

// Part 2 - Specialized BehavePlus Variants

export class AirTemperature extends Quantity {
  constructor () { super(['F', 'C']) }
}

export class CrownFillFraction extends Fraction {}

export class CrownFireActiveRatio extends NonNegativeFactor {}

export class CrownFireBurnedFraction extends Fraction {}

export class CrownRatioFraction extends Fraction {}

export class CrownTransitionRatio extends NonNegativeFactor {}

export class Documentation extends Text {
  constructor () { super('', 0, 80) }
}

export class FireArea extends Quantity {
  constructor () {
    super(['ft2', 'ac', 'mi2', 'm2', 'ha', 'km2'])
  }
}
export class FireDampingCoefficient extends Fraction {}

export class FireElapsedTime extends Quantity {
  constructor () { super(['min', 'h', 'd']) }
}

export class FireFirelineIntensity extends Quantity {
  constructor () { super(['btu/ft/s', 'J/m/s', 'W/m']) }
}

export class FireFlameDuration extends Quantity {
  constructor () { super(['min', 's', 'h']) }
}

export class FireFlameLength extends Quantity {
  constructor () { super(['ft', 'm']) }
}

export class FireHeatPerUnitArea extends Quantity {
  constructor () { super(['btu/ft2', 'J/m2']) }
}

export class FireLengthToWidthRatio extends Factor {
  constructor () { super(1, 1) }
}

export class FirePower extends Quantity {
  constructor () { super(['btu/min', 'btu/s', 'J/s', 'J/min', 'W']) }
}

export class FirePowerRatio extends NonNegativeFactor {}

export class FirePropagatingFluxRatio extends Fraction {}

export class FireReactionIntensity extends Quantity {
  constructor () { super(['btu/ft2/min', 'J/m2/min']) }
}

export class FireReactionVelocity extends Quantity {
  constructor () { super(['1/min', '1/s']) }
}

export class FireResidenceTime extends Quantity {
  constructor () { super(['min', 's', 'h']) }
}

export class FireScorchHeight extends Quantity {
  constructor () { super(['ft', 'm']) }
}

export class FireSpotDistance extends Quantity {
  constructor () { super(['ft', 'm', 'ch', 'mi', 'km']) }
}

export class FireSpreadDistance extends Quantity {
  constructor () { super(['ft', 'm', 'ch', 'mi', 'km']) }
}

export class FireSpreadRate extends Quantity {
  constructor () { super(['ft/min', 'm/min', 'ch/h', 'mi/h', 'km/h']) }
}

export class FuelAge extends Quantity {
  constructor () { super(['y']) }
}

export class FuelBasalArea extends Quantity {
  constructor () { super(['ft2', 'm2']) }
}

export class FuelBedBulkDensity extends Quantity {
  constructor () { super(['lb/ft3', 'kg/m3']) }
}

export class FuelBedDepth extends Quantity {
  constructor () { super(['ft', 'in', 'm', 'cm'], 0.01) }
}

export class FuelBedHeatOfPreignition extends Quantity {
  constructor () { super(['btu/lb', 'J/kg']) }
}

export class FuelBedPackingRatio extends NonNegativeFactor {}

export class FuelCoverFraction extends Fraction {}

export class FuelCylindricalDiameter extends Quantity {
  constructor () { super(['in', 'cm']) }
}

export class FuelCylindricalVolume extends Quantity {
  constructor () { super(['ft3', 'in3', 'm3', 'cm3', 'mm3']) }
}

export class FuelDeadFraction extends Fraction {}

export class FuelEffectiveHeatingNumber extends Fraction {}

export class FuelEffectiveMineralContent extends Fraction {}

export class FuelHeatOfCombustion extends Quantity {
  constructor () { super(['btu/lb', 'J/kg'], 8000, 12000) }
}

export class FuelHeatOfPreignition extends Quantity {
  constructor () { super(['btu/lb', 'J/kg']) }
}

export class FuelHeatSink extends Quantity {
  constructor () { super(['btu/ft3', 'J/m3']) }
}

export class FuelLabelText extends Text {
  constructor () { super('', 0, 80) }
}

export class FuelMoistureContent extends Float {
  constructor () { super(1, 0.01, 5) }
}

export class FuelOvendryLoad extends Quantity {
  constructor () { super(['lb/ft2', 'ton/ac', 'kg/m2', 'T/ha'], 0, 10) }
}

export class FuelParticleFiberDensity extends Quantity {
  constructor () { super(['lb/ft3', 'kg/m3']) }
}

export class FuelSizeClassIndex extends Index {
  constructor () { super(6) }
}

export class FuelSurfaceArea extends Quantity {
  constructor () { super(['ft2', 'm2']) }
}

export class FuelSurfaceAreaToVolumeRatio extends Quantity {
  constructor () {
    super(['ft2/ft3', 'm2/m3', 'cm2/cm3'], 1)
    this._specs._minimumValue = 1
  }
}

export class FuelTotalMineralContent extends Fraction {}

export class FuelVolume extends Quantity {
  constructor () { super(['ft3', 'm3']) }
}

export class IgnitionFuelDepth extends Quantity {
  constructor () { super(['in', 'cm']) }
}

export class IgnitionProbability extends Fraction {}

export class MapArea extends Quantity {
  constructor () { super(['in2', 'cm2', 'mm2']) }
}

export class MapContoursCount extends Count {
  constructor () { super(0) }
}

export class MapDistance extends Quantity {
  constructor () { super(['in', 'ft', 'cm', 'mm']) }
}

export class MapFactor extends Float {
  constructor () { super(1 / 24000, 1 / 2000000, 1) }
}

export class MapScale extends Float {
  constructor () { super(24000, 1, 2000000) }
}

export class MortalityFraction extends Fraction {}

export class SlopeSteepness extends Slope {}

export class SpottingFirebrandObject extends Blob {
  // Crown fire spotting distance
  constructor () {
    super({
      zdrop: 0,
      xdrop: 0,
      xdrift: 0,
      xspot: 0,
      layer: 0
    })
  }
}

export class TreeBarkThickness extends Quantity {
  constructor () { super(['in', 'cm', 'mm']) }
}

export class TreeCount extends Count {
  constructor () { super(0) }
}

export class TreeDbh extends Quantity {
  constructor () { super(['in', 'ft', 'cm', 'm']) }
}

export class TreeHeight extends Quantity {
  constructor () { super(['ft', 'm']) }
}

export class WeightingFactor extends Fraction {}

export class WindSpeed extends Quantity {
  constructor () { super(['ft/min', 'mi/h', 'm/s', 'm/min', 'km/h']) }
}

export class WindSpeedAdjustmentFactor extends Fraction {}
