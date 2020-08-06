import { Option } from '../../pando/index.js'
/**
 * Declares the specialized BehavePlus Config Variants.
 *
 * Note that classes derived from Crucible.Variant.Option() and COnfig()
 * require an array of options argument.
 */

/**
 * Config is an Option Variant whose sole purpose is to define
 * Dag configuration options with their own 'node instanceof Config' test
 */
export class Config extends Option {}

// Configuration options
export class ConfigModuleActive extends Config {
  constructor () {
    super(['active', 'inactive'])
  }
}
export class ConfigLinkCrownFire extends Config {
  constructor () {
    super(['linkedToCrownFire', 'standAlone'])
  }
}
export class ConfigLinkFireEllipse extends Config {
  constructor () {
    super(['linkedToFireEllipse', 'standAlone'])
  }
}
export class ConfigLinkScorchHeight extends Config {
  constructor () {
    super(['linkedToScorchHeight', 'standAlone'])
  }
}
export class ConfigLinkSurfaceFire extends Config {
  constructor () {
    super(['linkedToSurfaceFire', 'standAlone'])
  }
}

// bp6 #11 Surface > Input  > Chaparral > Total load is: [specified, est]
export class ConfigChaparralTotalLoad extends Config {
  constructor () {
    super([ // .header('Chaparral total fuel load is')
      'input', // 'entered as input', true)
      'estimated']) // 'estimated from Chaparral depth');
  }
}

// bp6 #2 - Surface > Input  > Moisture > Herb Curing: [est, inp]
export class ConfigCuredHerbFraction extends Config {
  constructor () {
    super([ // .header('Behave fuel model cured herb fraction is')
      'input', // 'entered as input', true)
      'estimated']) // 'estimated from live fuel moisture');
  }
}
// bp6 #1 Surface > Input  > Fuel:
// [key, std, exp, harm, arith, pg, wa, ch]
// Bpx splits bp6 config #1 into two configs; primary.fuel and secondary.fuel
export class ConfigPrimaryFuels extends Config {
  constructor () {
    super([ // .header('Primary fuels are specified by entering')
      'catalog', // 'a fuel model catalog key', true)
      'behave', // 'standard BehavePlus fuel parameters')
      'chaparral', // 'chaparral dynamic fuel parameters')
      'palmettoGallberry', // 'palmetto-gallberry dynamic fuel parameters')
      'westernAspen']) // 'western aspen dynamic fuel models');
  }
}

// bp6 #1 Surface > Input  > Fuel:
// [key, std, exp, harm, arith, pg, wa, ch]
// Bpx splits bp6 config #1 into two configs; primary.fuel and secondary.fuel
export class ConfigSecondaryFuels extends Config {
  constructor () {
    super([// .header('Secondary fuels are specified by entering')
      'none', // 'there are no secondary fuels', true);
      'catalog', // 'a fuel model catalog key')
      'behave', // 'standard BehavePlus fuel parameters')
      'chaparral', // 'chaparral dynamic fuel parameters')
      'palmettoGallberry', // 'palmetto-gallberry dynamic fuel parameters')
      'westernAspen']) // 'western aspen dynamic fuel models')
  }
}

// bp6 #3 - Surface > Input  > Moisture > Fuel Moisture:
// [ind, cat, mixed, scen]
export class ConfigMoistureContents extends Config {
  constructor () {
    super([ // .header('Fuel moistures are specified by entering')
      'individual', // 'the 3 dead and 2 live fuel moistures', true)
      'liveCategory', // 'the 3 dead moistures and a singe live category moisture')
      'category']) // 'the dead and live category moistures only')
  // 'catalog' // 'a fuel moisture catalog key');
  }
}

// bp6 #4 Surface > Input  > Wind Speed > Entered at:
// [mid, 20-wafInp, 20-wafEst, 10-wafInp, 10-wafEst]
// Bpx slipts Bp6 config #4 into 2 configs, fuel.waf and wind.speed
export class ConfigWindSpeedAdjustmentFactor extends Config {
  constructor () {
    super([ // .header('Midflame wind speed adjustment factor is')
      'input', // 'entered as input', true)
      'estimated']) // 'estimated from canopy and fuel parameters');
  }
}

// bp6 #7 Surface > Input  > Slope > Slope is [percent, degrees]
// bp6 #8 Surface > Input  > Slope > Slope is [input, map]
// BPX combined Bp6 configs #7 and #8
export class ConfigSlopeSteepness extends Config {
  constructor () {
    super([ // .header('Slope steepness is')
      'ratio', // 'entered as ratio of vertical rise to horizontal reach', true)
      'degrees', // 'entered as degrees of angle above the horizontal plane')
      'map']) // 'estimated from map measurements');
  }
}

// bp6 #5 Surface > Input  > Wind Speed > Wind is:
// [always upslope, specified]
export class ConfigWindDirection extends Config {
  constructor () {
    super([// .header('Wind direction is')
      'sourceFromNorth', // 'the direction FROM which the wind is blowing (degrees from NORTH)')
      'headingFromUpslope', // 'the direcion TOWARDS which the wind is blowing (degrees from UPSLOPE)', true)
      'upslope']) // 'assumed to be blowing upslope');
  }
}

// bp6 #4 Surface > Input  > Wind Speed > Entered at:
// [mid, 20-wafInp, 20-wafEst, 10-wafInp, 10-wafEst]
// Bpx slipts Bp6 config #4 into 2 configs, fuel.waf and wind.speed
export class ConfigWindSpeed extends Config {
  constructor () {
    super([ // .header('Wind speed is entered for')
      'at10m', // '10-m height')
      'at20ft', // '20-ft height', true)
      'atMidflame']) // 'midflame height');
  }
}

export class ConfigFirelineIntensity extends Config {
  constructor () {
    super([ // .header('The fireline intensity is')
      'firelineIntensity', // 'entered as input', true)
      'flameLength']) // 'estimated from the flame length input');
  }
}

export class ConfigFireLengthToWidthRatio extends Config {
  constructor () {
    super([ // .header('The fire ellipse length-to-width ratio is')
      'lengthToWidthRatio', // 'entered as input', true)
      'effectiveWindSpeed']) // 'estimated from the effective wind speed input');
  }
}

// bp6 #6 Surface > Input  > Wind Speed > Impose max wind speed limit?
export class ConfigEffectiveWindSpeedLimit extends Config {
  constructor () {
    super([ // .header('The effective wind speed limit is')
      'applied', // 'applied', true)
      'ignored']) // 'ignored');
  }
}

// New to BPX
export class ConfigFireWeightingMethod extends Config {
  constructor () {
    super([ // .header('Maximum fire spread rate of 2 surface fuel types is based on')
      'arithmetic', // 'arithmetic mean spread rate')
      'expected', // 'expected value spread rate')
      'harmonic']) // 'harmonic mean spread rate', true);
  }
}

// bp6 #10 Surface > Input  > Directions > Wind & Fire Dir: [wrt upslope, wrt north]
export class ConfigFireVector extends Config {
  constructor () {
    super([ // .header('Fire vector direction inputs are')
      'fromHead', // 'degrees clockwise from direction of maximum spread', true)
      'fromUpslope', // 'degrees clockwise from upslope')
      'fromNorth']) // 'degrees clockwise from north');
  }
}

// bp6 #9 Surface > Input  > Directions > Spread is [head, back, flank, psi, beta]
// BPX implements all spread direction options at any time instead of selecting just one

// bp6 #12 - Crown > Input  > Use [roth, s&r]
// BPX - May not be necessary: S&R is applied only if passive ouputs requested
// export const CrownFireMethod_UNUSED = [
//   // .header('Crown fire is estimated via')
//   'rothermel', // 'Rothermel')
//   'scottReinhardt' // 'Scott and Reinhardt (wind must blow upslope)', true);
// ]

// bp6 #13 - Crown > Input  > FLI [fl, fli]
// BPX- Required only in STANDALONE mode
// const CrownFireFli_UNUSED = [
//   // .header('The Crown Module is')
//   'surface', // 'linked to the Surface Module', true)
//   'flameLength', // 'run stand-alone using flame length input')
//   'firelineIntensity' // 'run stand-alone using fireline intensity input');
// ]

// bp6 # 14 - Contain > Input  > resources [single, multiple]
// const ContainResources_UNUSED = [
//   // .header('Contain module allows')
//   'singleResource', // 'a single firefighting resource')
//   'multipleResources' // 'multiple firefighting resources', true);
// ]
