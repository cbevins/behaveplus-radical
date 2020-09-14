// Surface fire spread rate, flame length, and scorch height given:
import * as Dag from '../../dist/bundle.esm.js'

export class BehavePlus {
  constructor () {
    this.dag = new Dag.Bpx()
    this.dag.setConfigs([
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
      ['configure.wind.direction', ['sourceFromNorth', 'headingFromUpslope', 'upslope'][0]],
      ['configure.wind.speed', ['at10m', 'at20ft', 'atMidflame'][2]]
    ])

    this.dag.setSelected([
      ['surface.weighted.fire.firelineIntensity', true],
      ['surface.weighted.fire.flameLength', true],
      ['surface.weighted.fire.heading.fromNorth', true],
      ['surface.weighted.fire.heading.fromUpslope', true],
      ['surface.weighted.fire.heatPerUnitArea', true],
      ['surface.weighted.fire.lengthToWidthRatio', true],
      ['surface.weighted.fire.reactionIntensity', true],
      ['surface.weighted.fire.scorchHeight', true],
      ['surface.weighted.fire.spreadRate', true]
    ])
    // Get the required input Nodes
    this.inputs = this.dag.requiredInputNodes()
    this.fuelModel = '10'
    this.fm1 = 0.05
    this.fm10 = 0.07
    this.fm100 = 0.09
    this.fmHerb = 0.5
    this.fmStem = 1.5
    this.windSpeed = 10
    this.windSource = 270
    this.slopeRatio = 0.2
    this.aspect = 225
    this.airTemp = 95
    this.run()
  }

  run () {
    this.dag.runInputs([
      ['surface.primary.fuel.model.catalogKey', [this.fuelModel]],
      ['site.moisture.live.herb', [this.fmHerb]],
      ['site.moisture.dead.tl10h', [this.fm10]],
      ['site.moisture.dead.tl100h', [this.fm100]],
      ['site.moisture.live.stem', [this.fmStem]],
      ['site.slope.steepness.ratio', [this.slopeRatio]],
      ['site.moisture.dead.tl1h', [this.fm1]],
      ['site.slope.direction.aspect', [this.aspect]],
      ['site.wind.direction.source.fromNorth', [this.windSource]],
      ['site.wind.speed.atMidflame', [88 * this.windSpeed]],
      ['site.temperature.air', [this.airTemp]]
    ])
    this.firelineIntensity = this.dag.get('surface.weighted.fire.firelineIntensity').value
    this.flameLength = this.dag.get('surface.weighted.fire.flameLength').value
    this.fireHeadingFromNorth = this.dag.get('surface.weighted.fire.heading.fromNorth').value
    this.fireHeadingFromUpslope = this.dag.get('surface.weighted.fire.heading.fromUpslope').value
    this.heatPerUnitArea = this.dag.get('surface.weighted.fire.heatPerUnitArea').value
    this.lengthToWidthRatio = this.dag.get('surface.weighted.fire.lengthToWidthRatio').value
    this.reactionIntensity = this.dag.get('surface.weighted.fire.reactionIntensity').value
    this.scorchHeight = this.dag.get('surface.weighted.fire.scorchHeight').value
    this.spreadRate = this.dag.get('surface.weighted.fire.spreadRate').value
  }
}

const bp = new BehavePlus()
console.log(`spreadRate = ${bp.spreadRate}`)
console.log(`flameLength = ${bp.flameLength}`)
console.log(`fireHeadingFromUpslope = ${bp.fireHeadingFromUpslope}`)
console.log(`fireHeadingFromNorth = ${bp.fireHeadingFromNorth}`)
