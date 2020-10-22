/**
 * An example of a 2-fuel model surface fire run.
 *
 * This example is organized slightly differently from simpleSurfaceFire.js, in that:
 * - configurations, selected variables, and input values are all predefined in arrays, and
 * - these arrays are then submitted for processing to by BehavePlus
 */
import * as Dag from '../../dist/bundle.esm.js'

// Store some output node keys into more convenient variables (to save typing):
const ros1Key = 'surface.primary.fuel.fire.spreadRate'
const ros2Key = 'surface.secondary.fuel.fire.spreadRate'
const rosWKey = 'surface.weighted.fire.spreadRate'
const primaryCover = 'surface.weighted.fire.primaryCover'
const selected = [ros1Key, ros2Key, primaryCover, rosWKey]

// Define an array of all the DAG configurations
const config = [
  // Most interesting options are for both primary and secondary fuel models
  ['configure.fuel.primary', ['catalog', 'behave', 'chaparral', 'palmettoGallberry', 'westernAspen'][0]],
  ['configure.fuel.secondary', ['none', 'catalog', 'behave', 'chaparral', 'palmettoGallberry', 'westernAspen'][1]],
  ['configure.fire.weightingMethod', ['arithmetic', 'expected', 'harmonic'][0]],
  // The following are less interesting for this example
  ['configure.fire.effectiveWindSpeedLimit', ['applied', 'ignored'][0]],
  ['configure.fire.firelineIntensity', ['firelineIntensity', 'flameLength'][1]],
  ['configure.fire.lengthToWidthRatio', ['lengthToWidthRatio', 'effectiveWindSpeed'][0]],
  ['configure.fire.vector', ['fromHead', 'fromUpslope', 'fromNorth'][2]],
  ['configure.fuel.chaparralTotalLoad', ['input', 'estimated'][0]],
  ['configure.fuel.curedHerbFraction', ['input', 'estimated'][1]],
  ['configure.fuel.moisture', ['individual', 'liveCategory', 'category', 'catalog'][0]],
  ['configure.fuel.windSpeedAdjustmentFactor', ['input', 'estimated'][0]],
  ['configure.slope.steepness', ['ratio', 'degrees', 'map'][0]],
  ['configure.wind.direction', ['sourceFromNorth', 'headingFromUpslope', 'upslope'][0]],
  ['configure.wind.speed', ['at10m', 'at20ft', 'atMidflame'][2]]
]

// Define an array of all the required input values
const input = [
  ['surface.primary.fuel.model.catalogKey', ['10']],
  ['surface.secondary.fuel.model.catalogKey', ['124']],
  ['surface.weighted.fire.primaryCover', [0.6]],
  ['site.moisture.dead.tl1h', [0.05]],
  ['site.moisture.dead.tl10h', [0.07]],
  ['site.moisture.dead.tl100h', [0.09]],
  ['site.moisture.live.herb', [0.5]],
  ['site.moisture.live.stem', [1.5]],
  ['site.slope.direction.aspect', [180]],
  ['site.slope.steepness.ratio', [0.25]],
  ['site.wind.direction.source.fromNorth', [270]],
  ['site.wind.speed.atMidflame', [880]]
]
// Note: according to BehavePlus, these inputs should produce spread rates of
// 18.551680325448835 ft/min for the primary fuel model '10'
// 48.47042599399056 ft/min for the secondary fuel model '124'

// Step 1 - create a BehavePlus directed acyclical graph (DAG)
const dag = new Dag.Bpx()

// Step 2 - configure input choices and computational options
dag.runConfigs(config)

// Step 3 - specify the fire behavior variables to be produced
dag.runSelected([[ros1Key, true], [ros2Key, true], [rosWKey, true]])

// Step 4 - uncomment the following line if you need to list all the required inputs:
// console.log('Required inputs are:', dag.requiredInputNodes().map(node => node.key))

// Step 5 - specify the values of the required inputs
dag.runInputs(input)

// Step 6 - one way to simply access and display results
console.log(`Primary Fuel Spread Rate   ${dag.get(ros1Key).value} ft/min`)
console.log(`Secondary Fuel Spread Rate ${dag.get(ros2Key).value} ft/min`)
console.log(`Primary Fuel Cover         ${100*dag.get(primaryCover).value} %`)
console.log(`Mean Wtd Fuel Spread Rate  ${dag.get(rosWKey).value} ft/min`)
