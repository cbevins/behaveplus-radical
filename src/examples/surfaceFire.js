// Surface fire spread rate, flame length, and scorch height
// under 240,000 various fuel model, moisture, wind, slope,
// and temperature vales
import * as Dag from '../../dist/bundle.esm.js'

const dag = new Dag.Bpx()
dag.setConfigs([
  ['configure.fire.effectiveWindSpeedLimit', ['applied', 'ignored'][0]],
  ['configure.fire.firelineIntensity', ['firelineIntensity', 'flameLength'][1]],
  ['configure.fire.lengthToWidthRatio', ['lengthToWidthRatio', 'effectiveWindSpeed'][0]],
  ['configure.fire.weightingMethod', ['arithmetic', 'expected', 'harmonic'][0]],
  ['configure.fire.vector', ['fromHead', 'fromUpslope', 'fromNorth'][0]],
  ['configure.fuel.chaparralTotalLoad', ['input', 'estimated'][0]],
  ['configure.fuel.curedHerbFraction', ['input', 'estimated'][1]],
  ['configure.fuel.moisture', ['individual', 'liveCategory', 'category', 'catalog'][0]],
  ['configure.fuel.primary', ['catalog', 'behave', 'chaparral', 'palmettoGallberry', 'westernAspen'][0]],
  ['configure.fuel.secondary', ['none', 'catalog', 'behave', 'chaparral', 'palmettoGallberry', 'westernAspen'][0]],
  ['configure.fuel.windSpeedAdjustmentFactor', ['input', 'estimated'][0]],
  ['configure.slope.steepness', ['ratio', 'degrees', 'map'][0]],
  ['configure.wind.direction', ['sourceFromNorth', 'headingFromUpslope', 'upslope'][2]],
  ['configure.wind.speed', ['at10m', 'at20ft', 'atMidflame'][2]]
])

dag.setSelected([
  ['surface.weighted.fire.spreadRate', true],
  ['surface.weighted.fire.flameLength', true],
  ['surface.weighted.fire.scorchHeight', true]
])

// Get the required inputs
const inputs = dag.requiredInputNodes()
console.log(inputs.map(node => node.key))

// Bump up the run limit so we can stress test with a lot of inputs
dag.setRunLimit(10000000)
const wind = []; for (let i = 0; i < 25; i++) { wind.push(i * 88) }
const tl1h = []; for (let i = 1; i <= 20; i++) { tl1h.push(i * 0.01) }
const temp = []; for (let i = 70; i <= 101; i += 10) { temp.push(i) }
const slope = []; for (let i = 0; i <= 101; i += 20) { slope.push(i) }

// Here we go!
dag.runInputs([
  ['surface.primary.fuel.model.catalogKey', ['1', '6', '10', 'gs1', '124']],
  ['site.moisture.live.herb', [0.5, 1, 1.5, 2]],
  ['site.moisture.dead.tl1h', tl1h],
  ['site.moisture.dead.tl10h', [0.07]],
  ['site.moisture.dead.tl100h', [0.09]],
  ['site.moisture.live.stem', [1.5]],
  ['site.slope.steepness.ratio', slope],
  ['site.wind.speed.atMidflame', wind],
  ['site.temperature.air', temp]
])

const results = dag.results()
console.log(`${results.runs} runs required ${results.elapsed} ms: ${results.message}`)
