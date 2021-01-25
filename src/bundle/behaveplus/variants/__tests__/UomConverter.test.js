import { Bpx } from '../../Bpx.js'
import * as V from '../index.js'
import * as Uom from '../../../pando/uom/index.js'

const dag = new Bpx()

dag.setConfigs([
  // We use a single primary fuel model from the Burgan & Scott catalog
  ['configure.fuel.primary', ['catalog', 'behave', 'chaparral', 'palmettoGallberry', 'westernAspen'][0]],
  // There is no secondary fuel model
  ['configure.fuel.secondary', ['none', 'catalog', 'behave', 'chaparral', 'palmettoGallberry', 'westernAspen'][0]],
  // Cured herb fraction is estimated from the live herb fuel moisture
  ['configure.fuel.curedHerbFraction', ['input', 'estimated'][1]],
  // Fuel moistures are entered by life category
  ['configure.fuel.moisture', ['individual', 'liveCategory', 'category', 'catalog'][0]],
  // Slope steepness is entered as ratio of vertical rise / horizontal reach
  ['configure.slope.steepness', ['ratio', 'degrees', 'map'][0]],
  // Wind direction is assumed to be upslope (so no need to enter wind source or aspect)
  ['configure.wind.direction', ['sourceFromNorth', 'headingFromUpslope', 'upslope'][2]],
  // CEMML preferes to enter wind speed at 20-ft
  ['configure.wind.speed', ['at10m', 'at20ft', 'atMidflame'][1]],
  // Follow Pat Andrews' (2020) recommendation to remove limit spread rate
  ['configure.fire.effectiveWindSpeedLimit', ['applied', 'ignored'][1]],
  // Prefer to estimate the wind adjustment factor (rather than enter it as input)
  ['configure.fuel.windSpeedAdjustmentFactor', ['input', 'estimated'][1]],

  // The following configuration options are not active for this example,
  // but are included here for reference/completeness.

  // If not linked to a surface fire, prefer to input fireline intensity or flame length?
  ['configure.fire.firelineIntensity', ['firelineIntensity', 'flameLength'][1]],
  // If not linked to a surface fire, prefer to input length-to-width ratio or effective wind speed?
  ['configure.fire.lengthToWidthRatio', ['lengthToWidthRatio', 'effectiveWindSpeed'][0]],
  // If both primary and secondary fuels are present, which weighting method should be applied?
  ['configure.fire.weightingMethod', ['arithmetic', 'expected', 'harmonic'][0]],
  // If requesting fire behavior in a specific direction, it is with respect to:
  ['configure.fire.vector', ['fromHead', 'fromUpslope', 'fromNorth'][0]],
  // If performing chaparral fuel modeling, prefer to enter or estimate total fuel load?
  ['configure.fuel.chaparralTotalLoad', ['input', 'estimated'][0]]
])

dag.setSelected([
  // surface fire outputs
  ['surface.fire.ellipse.head.spreadRate', true],
  ['surface.fire.ellipse.head.firelineIntensity', true],
  ['surface.fire.ellipse.head.flameLength', true],
  ['surface.fire.ellipse.size.area', true],
  ['surface.fire.ellipse.size.perimeter', true],
  // wind speed outputs
  ['surface.fire.ellipse.wind.speed.atMidflame', true],
  ['surface.primary.fuel.fire.windSpeedAdjustmentFactor', true],
  // crown fire outputs
  ['crown.fire.active.firelineIntensity', true],
  ['crown.fire.active.flameLength', true],
  ['crown.fire.active.spreadRate', true],
  ['crown.fire.initiation.type', true]
])

// If interested, uncomment the following statement to request and display the active configuration settings
// console.log('The active configuration options are:',
//   dag.requiredConfigNodes().map(node => `${node.key} = '${node.value}'`))

// Step 4 - if interested, request and display the required inputs
// console.log('Required inputs are:', dag.requiredInputNodes().map(node => node.key))

// Step 6 - simulate reading input data from a file or other stream...
dag.runInputs([
  ['surface.primary.fuel.model.catalogKey', ['tu3']],
  ['site.moisture.live.herb', [.5]],
  ['site.moisture.live.stem', [.9]],
  ['site.moisture.dead.tl1h', [.06]],
  ['site.moisture.dead.tl10h', [.08]],
  ['site.moisture.dead.tl100h', [.1]],
  ['site.canopy.crown.baseHeight', [5]],
  ['site.canopy.crown.totalHeight', [60]],
  ['site.canopy.cover', [0.75]],
  ['site.slope.steepness.ratio', [0.1]],
  ['site.wind.speed.at20ft', [15*88]],
  ['site.canopy.fuel.bulkDensity', [0.032]], // only used if selecting crown fire outputs
  ['site.canopy.fuel.foliar.moistureContent', [1]],  // only used if selecting crown fire outputs
  ['site.fire.time.sinceIgnition', [8*60]], // only used if selecting fire area or perimeter outputs
])

test('Spread rate ft/min, ch/h', () => {
  const node = dag.get('surface.fire.ellipse.head.spreadRate')
  const variant = node.variant
  const native = 6.857887700906989
  const cph = native / 1.1 // 6.234443364460899

  // Native value is the display value
  expect(variant._specs._uomArray).toEqual(['ft/min', 'm/min', 'ch/h', 'mi/h', 'km/h'])
  expect(variant.displayUnits()).toEqual('ft/min')
  expect(variant._display._units).toEqual('ft/min')

  // node holds the actual native value
  expect(node.value).toEqual(native)
  // Node.displayValue() converts and formats native value
  expect(node.displayValue()).toEqual('6.86')
  // Node.displayValue() calls Variant.displayValue(node.value); so equivalent is
  expect(variant.displayValue(node.value)).toEqual('6.86')
  // Variant.displayValue(baseAmount) calls Variant.baseAsDisplayUom(baseAMount) before string formatting
  expect(variant.baseAsDisplayUom(node.value)).toEqual(node.value)
  expect(variant.baseAsDisplayUom(node.value).toFixed(2)).toEqual('6.86')
  // Variant.baseAsDisplayUom() calls Variant.baseAsUom(baseAmount, this._display._units)
  expect(variant.baseAsUom(node.value, variant._display._units)).toEqual(node.value)
  expect(variant.baseAsUom(native, 'ft/min')).toEqual(native)
  // Variant.baseAsUom() calls Uom.asAmount(amt, uom) twice
  let factor =  Uom.asAmount(1, variant._specs._uomArray[0])
  expect(factor).toEqual(1)
  let converted = Uom.asAmount(node.value, variant._display._units) / factor
  expect(converted).toEqual(native)
  // since _display._units === ._specs._uomArray[0]...
  converted = Uom.asAmount(node.value, variant._specs._uomArray[0]) / factor
  expect(converted).toEqual(native)

  // Change the display units
  variant.setDisplayUnits('ch/h')
  expect(variant._display._units).toEqual('ch/h')
  expect(variant.displayUnits()).toEqual('ch/h')
  // node.value still  holds the actual native value
  expect(node.value).toEqual(native)
  // Node.displayValue() converts and formats native value
  expect(node.displayValue()).toEqual('6.23')
  // Node.displayValue() calls Variant.displayValue(node.value); so equivalent is
  expect(variant.displayValue(node.value)).toEqual('6.23')
  // Variant.displayValue(baseAmount) calls Variant.baseAsDisplayUom(baseAMount) before string formatting
  expect(variant.baseAsDisplayUom(node.value)).toBeCloseTo(cph, 12)
  expect(variant.baseAsDisplayUom(node.value).toFixed(2)).toEqual('6.23')
  // Variant.baseAsDisplayUom() calls Variant.baseAsUom(baseAmount, this._display._units)
  expect(variant.baseAsUom(node.value, variant._display._units)).toBeCloseTo(cph, 12)
  expect(variant.baseAsUom(native, 'ft/min')).toEqual(native)
  expect(variant.baseAsUom(native, 'ch/h')).toBeCloseTo(cph, 12)
  // Variant.baseAsUom() calls Uom.asAmount(amt, uom) twice
  factor =  Uom.asAmount(1, variant._specs._uomArray[0])
  expect(factor).toEqual(1) // ros native units are already in ft/lb/min/btu/F
  converted = Uom.asAmount(node.value, variant._display._units) / factor
  expect(converted).toBeCloseTo(cph, 12)
})

test('Fireline Intentensity btu/ft/s, btu/ft/min', () => {
  const node = dag.get('surface.fire.ellipse.head.firelineIntensity')
  const variant = node.variant
  const native = 98.590723326207

  // Native value is the display value
  expect(variant._specs._uomArray).toEqual(['btu/ft/s', 'J/m/s', 'W/m'])
  expect(variant.displayUnits()).toEqual('btu/ft/s')
  expect(variant._display._units).toEqual('btu/ft/s')

  // node holds the actual native value
  expect(node.value).toEqual(native)
  // Node.displayValue() converts and formats native value
  expect(node.displayValue()).toEqual('98.59')
  // Node.displayValue() calls Variant.displayValue(node.value); so equivalent is
  expect(variant.displayValue(node.value)).toEqual('98.59')
  // Variant.displayValue(baseAmount) calls Variant.baseAsDisplayUom(baseAMount) before string formatting
  expect(variant.baseAsDisplayUom(node.value)).toEqual(node.value)
  expect(variant.baseAsDisplayUom(node.value).toFixed(2)).toEqual('98.59')
  // Variant.baseAsDisplayUom() calls Variant.baseAsUom(baseAmount, this._display._units)
  expect(variant.baseAsUom(node.value, variant._display._units)).toEqual(node.value)
  expect(variant.baseAsUom(native, 'btu/ft/s')).toEqual(native)
  // Variant.baseAsUom() calls Uom.asAmount(amt, uom) twice
  let factor =  Uom.asAmount(1, variant._specs._uomArray[0])
  expect(factor).toEqual(1/60) // because native units are btu/ft/s instead of btu/ft/min
  let converted = Uom.asAmount(node.value, variant._display._units) / factor
  expect(converted).toEqual(native)
  converted = Uom.asAmount(node.value, variant._specs._uomArray[0]) / factor
  expect(converted).toEqual(native)

  expect(variant.baseAsUom(1, 'btu/ft/s')).toEqual(1)
  expect(variant.baseAsDisplayUom(1)).toEqual(1)
  expect(variant.baseAsUom(1, 'btu/ft/min')).toEqual(60)

  expect(variant.baseAsUom(native, 'btu/ft/s')).toEqual(native)
  expect(variant.baseAsUom(native, 'btu/ft/min')).toEqual(60*native)
  expect(variant.baseAsDisplayUom(native)).toEqual(native)

  // change units
  variant.setDisplayUnits('btu/ft/min')
  expect(variant._display._units).toEqual('btu/ft/min')
  expect(variant.displayUnits()).toEqual('btu/ft/min')
  expect(node.value).toEqual(native) // unchanged
  expect(node.displayValue()).toEqual((60*native).toFixed(2))
  expect(variant.displayValue(native)).toEqual('5915.44')

  // node holds the actual native value
  expect(node.value).toEqual(native)
  // Node.displayValue() converts and formats native value
  expect(node.displayValue()).toEqual('5915.44')
  // Node.displayValue() calls Variant.displayValue(node.value); so equivalent is
  expect(variant.displayValue(node.value)).toEqual('5915.44')
  // Variant.displayValue(baseAmount) calls Variant.baseAsDisplayUom(baseAMount) before string formatting
  expect(variant.baseAsDisplayUom(node.value)).toEqual(60*node.value)
  expect(variant.baseAsDisplayUom(node.value).toFixed(2)).toEqual('5915.44')
  // Variant.baseAsDisplayUom() calls Variant.baseAsUom(baseAmount, this._display._units)
  expect(variant.baseAsUom(node.value, variant._display._units)).toEqual(60*node.value)
  expect(variant.baseAsUom(native, 'btu/ft/s')).toEqual(native)
  expect(variant.baseAsUom(native, 'btu/ft/min')).toEqual(60*native)
  // Variant.baseAsUom() calls Uom.asAmount(amt, uom) twice
  factor =  Uom.asAmount(1, variant._specs._uomArray[0])
  expect(factor).toEqual(1/60) // because native units are btu/ft/s instead of btu/ft/min
  converted = Uom.asAmount(node.value, variant._display._units) / factor
  expect(converted).toEqual(60*native)
})

test('Slope steepness', () => {
  const node = dag.get('site.slope.steepness.ratio')
  const variant = node.variant
  const native = 0.1
  const deg = 5.710593137499643

  // Native value is the display value
  expect(variant._specs._uomArray).toEqual(['ratio', 'percent', '%'])
  expect(variant.displayUnits()).toEqual('ratio')
  expect(variant._display._units).toEqual('ratio')

  // node holds the actual native value
  expect(node.value).toEqual(native)
  // Node.displayValue() converts and formats native value
  expect(node.displayValue()).toEqual('0.10')
  // Node.displayValue() calls Variant.displayValue(node.value); so equivalent is
  expect(variant.displayValue(node.value)).toEqual('0.10')
  // Variant.displayValue(baseAmount) calls Variant.baseAsDisplayUom(baseAMount) before string formatting
  expect(variant.baseAsDisplayUom(node.value)).toEqual(node.value)
  expect(variant.baseAsDisplayUom(node.value).toFixed(2)).toEqual('0.10')
  // Variant.baseAsDisplayUom() calls Variant.baseAsUom(baseAmount, this._display._units)
  expect(variant.baseAsUom(node.value, variant._display._units)).toEqual(node.value)
  expect(variant.baseAsUom(native, 'ratio')).toEqual(native)
  // Variant.baseAsUom() calls Uom.asAmount(amt, uom) twice
  let factor =  Uom.asAmount(1, variant._specs._uomArray[0])
  expect(factor).toEqual(1) // because native units are ratio
  let converted = Uom.asAmount(node.value, variant._display._units) / factor
  expect(converted).toEqual(native)
  converted = Uom.asAmount(node.value, variant._specs._uomArray[0]) / factor
  expect(converted).toEqual(native)

  expect(variant.baseAsUom(1, 'ratio')).toEqual(1)
  expect(variant.baseAsDisplayUom(1)).toEqual(1)
  expect(variant.baseAsUom(1, '%')).toEqual(100)

  expect(variant.baseAsUom(native, 'ratio')).toEqual(native)
  expect(variant.baseAsUom(native, 'percent')).toEqual(10)
  expect(variant.baseAsUom(native, 'deg')).toEqual(deg)
  expect(variant.baseAsUom(1, 'deg')).toEqual(45)
  expect(variant.baseAsDisplayUom(native)).toEqual(native)

  // change units to percent
  variant.setDisplayUnits('percent')
  expect(variant._display._units).toEqual('percent')
  expect(variant.displayUnits()).toEqual('percent')
  expect(node.value).toEqual(native) // unchanged
  expect(node.displayValue()).toEqual('10.00')
  expect(variant.displayValue(native)).toEqual('10.00')

  // node holds the actual native value
  expect(node.value).toEqual(native)
  // Node.displayValue() converts and formats native value
  expect(node.displayValue()).toEqual('10.00')
  // Node.displayValue() calls Variant.displayValue(node.value); so equivalent is
  expect(variant.displayValue(node.value)).toEqual('10.00')
  // Variant.displayValue(baseAmount) calls Variant.baseAsDisplayUom(baseAMount) before string formatting
  expect(variant.baseAsDisplayUom(node.value)).toEqual(10)
  expect(variant.baseAsDisplayUom(node.value).toFixed(2)).toEqual('10.00')
  // Variant.baseAsDisplayUom() calls Variant.baseAsUom(baseAmount, this._display._units)
  expect(variant.baseAsUom(node.value, variant._display._units)).toEqual(10)
  expect(variant.baseAsUom(native, 'ratio')).toEqual(native)
  expect(variant.baseAsUom(native, '%')).toEqual(10)
  expect(variant.baseAsUom(native, 'percent')).toEqual(10)
  expect(variant.baseAsUom(native, 'deg')).toEqual(deg)
  // Variant.baseAsUom() calls Uom.asAmount(amt, uom) twice
  factor =  Uom.asAmount(1, variant._specs._uomArray[0])
  expect(factor).toEqual(1)
  converted = Uom.asAmount(node.value, variant._display._units) / factor
  expect(converted).toEqual(10)

  // change units to degrees
  variant.setDisplayUnits('deg')
  expect(variant._display._units).toEqual('deg')
  expect(variant.displayUnits()).toEqual('deg')
  expect(node.value).toEqual(native) // unchanged
  expect(node.displayValue()).toEqual('5.71')
  expect(variant.displayValue(native)).toEqual('5.71')

  // node holds the actual native value
  expect(node.value).toEqual(native)
  // Node.displayValue() converts and formats native value
  expect(node.displayValue()).toEqual('5.71')
  // Node.displayValue() calls Variant.displayValue(node.value); so equivalent is
  expect(variant.displayValue(node.value)).toEqual('5.71')
  // Variant.displayValue(baseAmount) calls Variant.baseAsDisplayUom(baseAMount) before string formatting
  expect(variant.baseAsDisplayUom(node.value)).toEqual(deg)
  expect(variant.baseAsDisplayUom(node.value).toFixed(2)).toEqual('5.71')
  // Variant.baseAsDisplayUom() calls Slope.baseAsUom(baseAmount, this._display._units)
  expect(variant.baseAsUom(node.value, variant._display._units)).toEqual(deg)
  expect(variant.baseAsUom(native, 'ratio')).toEqual(native)
  expect(variant.baseAsUom(native, '%')).toEqual(10)
  expect(variant.baseAsUom(native, 'percent')).toEqual(10)
  // BECAUSE UNITS ARE 'deg', Slope.baseAsUom() does the conversion
  // instead of calling Uom.asAmount(amt, uom) twice
  expect(variant.baseAsUom(native, 'deg')).toEqual(deg)
})
