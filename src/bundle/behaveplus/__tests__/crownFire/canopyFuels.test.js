import { Bpx } from '../../Bpx.js'
import * as DagJest from '../../../../utils/matchers.js'

const value = DagJest.value
expect.extend({ value })

const prefix = 'surface.primary.fuel.'

const Configs = [
  ['configure.fuel.primary', ['catalog', 'behave', 'chaparral', 'palmettoGallberry', 'westernAspen'][0]],
  ['configure.wind.speed', ['at10m', 'at20ft', 'atMidflame'][1]],
  ['configure.wind.direction', ['sourceFromNorth', 'headingFromUpslope', 'upslope'][2]],
  ['configure.fuel.windSpeedAdjustmentFactor', ['input', 'estimated'][0]]
]

const Inputs = [
  [prefix + 'model.catalogKey', ['10']],
  [prefix + 'model.behave.parms.cured.herb.fraction', [0]],
  ['site.moisture.dead.tl1h', [0.05]],
  ['site.moisture.dead.tl10h', [0.07]],
  ['site.moisture.dead.tl100h', [0.09]],
  ['site.moisture.live.herb', [0.5]],
  ['site.moisture.live.stem', [1.5]],
  ['site.slope.steepness.ratio', [0]],
  ['site.wind.speed.at20ft', [25 * 88]],
  ['site.windSpeedAdjustmentFactor', [0.4]],
  // if configure.wind.direction==='headingFromUpslope', the following becomes input
  ['site.wind.direction.heading.fromUpslope', [0]],
  // if configure.wind.direction==='sourceFromNorth', the following become inputs
  ['site.wind.direction.source.fromNorth', [180]],
  ['site.slope.direction.aspect', [180]]
]

const Results = [
  [prefix + 'fire.noWindNoSlope.spreadRate', 0.67900860922904482, 12],
  [prefix + 'fire.slope.phi', 0, 12],
  [prefix + 'fire.wind.phi', 26.298112107312534, 12],
  [prefix + 'fire.phiEffectiveWind', 26.298112107312534, 12],
  // ros = 0.67900860922904482 * (1 + 0 + 26.298112107312534)
  [prefix + 'fire.spreadRate', 18.535653136564, 12],
  [prefix + 'fire.reactionIntensity', 5794.6954002291168, 12]
]

test('1: Crown Fire Canopy Fuels (FM 10) benchmarks', () => {
  const dag = new Bpx()
  dag.runConfigs(Configs)
  dag.runSelected(Results.map(node => [node[0], true]))

  const requiredInputs = dag.requiredInputNodes()
  for (let i = 0; i < 10; i++) {
    expect(requiredInputs).toContain(dag.get(Inputs[i][0]))
  }
  if (dag.get('configure.wind.direction').value === 'upslope') {
    expect(requiredInputs.length).toEqual(10)
  } else if (
    dag.get('configure.wind.direction').value === 'headingFromUpslope'
  ) {
    expect(requiredInputs.length).toEqual(11)
    expect(requiredInputs).toContain(
      dag.get('site.wind.direction.heading.fromUpslope')
    )
  } else if (
    dag.get('configure.wind.direction').value === 'sourceFromNorth'
  ) {
    expect(requiredInputs.length).toEqual(12)
    expect(requiredInputs).toContain(
      dag.get('site.wind.direction.source.fromNorth')
    )
    expect(requiredInputs).toContain(dag.get('site.slope.direction.aspect'))
  }

  dag.runInputs(Inputs)
  Results.forEach(result => {
    const [key, value, prec] = result
    expect(dag.get(key)).value(value, prec)
  })
})
