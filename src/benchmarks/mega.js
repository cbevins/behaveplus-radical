/**
 * @file Test of the largest number of required Nodes
 * with the fewest number of input Nodes.
 * @copyright 2020 Systems for Environmental Management
 * @author Collin D. Bevins, <cbevins@montana.com>
 * @version 0.1.0
 */
import { Dag } from '../bundle/pando/index.js'
import * as Dna from '../bundle/behaveplus/BpxDna.js'

function megaRun () {
  const dag = new Dag(Dna)
  dag.setConfigs([
    ['configure.fire.firelineIntensity', ['firelineIntensity', 'flameLength'][1]],
    ['configure.fire.vector', ['fromHead', 'fromUpslope', 'fromNorth'][2]],
    ['configure.fire.lengthToWidthRatio', ['lengthToWidthRatio', 'effectiveWindSpeed'][0]],
    ['configure.fire.effectiveWindSpeedLimit', ['applied', 'ignored'][0]],
    ['configure.fire.weightingMethod', ['arithmetic', 'expected', 'harmonic'][2]],
    ['configure.fuel.windSpeedAdjustmentFactor', ['input', 'estimated'][1]],
    ['configure.fuel.chaparralTotalLoad', ['input', 'estimated'][1]],
    ['configure.fuel.curedHerbFraction', ['input', 'estimated'][1]],
    ['configure.fuel.moisture', ['individual', 'liveCategory', 'category', 'catalog'][2]],
    ['configure.fuel.primary', ['catalog', 'behave', 'chaparral', 'palmettoGallberry', 'westernAspen'][0]],
    ['configure.fuel.secondary', ['none', 'catalog', 'behave', 'chaparral', 'palmettoGallberry', 'westernAspen'][1]],
    ['configure.slope.steepness', ['ratio', 'degrees', 'map'][2]],
    ['configure.wind.direction', ['sourceFromNorth', 'headingFromUpslope', 'upslope'][0]],
    ['configure.wind.speed', ['at10m', 'at20ft', 'atMidflame'][0]]
  ])
  dag.setSelected([
    ['surface.fire.ellipse.head.treeMortality', true],
    ['surface.fire.ellipse.flank.treeMortality', true],
    ['surface.fire.ellipse.back.treeMortality', true],
    ['surface.fire.ellipse.beta.treeMortality', true],
    ['surface.fire.ellipse.beta5.treeMortality', true],
    ['surface.fire.ellipse.psi.treeMortality', true],
    ['surface.fire.ellipse.head.mapDistance', true],
    ['surface.fire.ellipse.flank.mapDistance', true],
    ['surface.fire.ellipse.back.mapDistance', true],
    ['surface.fire.ellipse.beta.mapDistance', true],
    ['surface.fire.ellipse.beta5.mapDistance', true],
    ['surface.fire.ellipse.psi.mapDistance', true],
    ['surface.fire.ellipse.size.perimeter', true],
    ['surface.weighted.fire.spreadRate', true],
    ['surface.weighted.fire.limit.effectiveWindSpeed.exceeded', true],
    ['spotting.burningPile.spotDistance.mountainTerrain', true],
    ['spotting.crownFire.spotDistance.mountainTerrain', true],
    ['spotting.surfaceFire.spotDistance.mountainTerrain', true],
    ['spotting.torchingTrees.spotDistance.mountainTerrain', true],
    ['crown.fire.active.map.perimeter', true],
    ['crown.fire.active.isWindDriven', true],
    ['crown.fire.final.map.area', true],
    ['crown.fire.initiation.type', true],
    ['mortality.rate', true],
    ['ignition.lightningStrike.probability', true]
  ])
  dag.runInputs([
    ['surface.primary.fuel.model.catalogKey', ['1', '10', '13', '124', 'gs1', 'gs2', 'gs3', 'sh1', 'sh2', 'sh3']],
    ['site.moisture.live.category', [0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.4]],
    ['surface.secondary.fuel.model.catalogKey', ['124']],
    ['site.moisture.dead.category', [0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09, 0.1]],
    ['site.canopy.crown.baseHeight', [10]],
    ['site.canopy.crown.totalHeight', [100]],
    ['site.canopy.cover', [0.8]],
    ['site.map.scale', [24000]], // 2000 ft per inch
    ['site.map.contours', [20]],
    ['site.map.distance', [5]], // i.e., 20x100=2000 ft rise / 5x2000 =10,000 reach = 20% slope
    ['site.map.interval', [100]],
    ['site.wind.speed.at10m', [0, 88 * 5, 88 * 10, 88 * 15, 88 * 20]],
    ['site.slope.direction.aspect', [180]],
    ['site.wind.direction.source.fromNorth', [270]],
    ['surface.weighted.fire.primaryCover', [0.6]],
    ['site.canopy.fuel.bulkDensity', [0.02]],
    ['site.fire.vector.fromNorth', [45]],
    ['site.canopy.fuel.foliar.moistureContent', [0.5]],
    ['spotting.torchingTrees.species', ['PIPO']],
    ['spotting.torchingTrees.dbh', [40]],
    ['spotting.torchingTrees.count', [5]],
    ['site.canopy.downwind.height', [100]],
    ['site.canopy.downwind.isOpen', [true]],
    ['spotting.burningPile.flameHeight', [10]],
    ['spotting.torchingTrees.height', [100]],
    ['site.fire.time.sinceIgnition', [60]],
    ['site.temperature.air', [95]],
    ['ignition.lightningStrike.charge', ['positive']],
    ['ignition.lightningStrike.fuel.depth', [1 / 12]],
    ['ignition.lightningStrike.fuel.type', ['ponderosaPineLitter']],
    ['site.canopy.tree.dbh', [30]],
    ['site.canopy.tree.species.fofem6.code', ['PIPO']],
    ['site.terrain.spotSourceLocation', ['ridgeTop']],
    ['site.terrain.ridgeValleyDistance', [5000]],
    ['site.terrain.ridgeValleyElevation', [1000]]
  ])
  return dag.dna.results.runs
}

console.log('Mega Test')
const start = Date.now()
const runs = megaRun()
const used = process.memoryUsage()
for (const key in used) {
  console.log(`${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`)
}
console.log(`elaspedTime: ${Date.now() - start} ms for ${runs} runs`)
