/* eslint-disable no-undef, no-unused-vars, no-prototype-builtins */
/**
 * @file Test of the largest number of required Nodes
 * with the fewest number of input Nodes.
 * @copyright 2020 Systems for Environmental Management
 * @author Collin D. Bevins, <cbevins@montana.com>
 * @license MIT Open Software License v. 3.0
 * @version 0.1.0
 */
import { Dag } from '../Dag.js'
import * as Dna from '../../../behaveplus/BpxDna.js'
import * as DagJest from '../../../../utils/matchers.js'

const value = DagJest.value
expect.extend({ value })

const dag = new Dag(Dna)
dag.runConfigs([
  ['link.crownFire', 'linkedToSurfaceFire'],
  ['link.crownSpot', 'linkedToCrownFire'],
  ['link.fireContain', 'linkedToFireEllipse'],
  ['link.fireEllipse', 'linkedToSurfaceFire'],
  ['link.scorchHeight', 'linkedToSurfaceFire'],
  ['link.surfaceSpot', 'linkedToSurfaceFire'],
  ['link.treeMortality', 'linkedToScorchHeight'],
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

// Required inputs in topological order
// select 'surface.fire.ellipse.beta.treeMortality'
const primaryKey = dag.get('surface.primary.fuel.model.catalogKey')
const liveMoisture = dag.get('site.moisture.live.category')
const secondaryKey = dag.get('surface.secondary.fuel.model.catalogKey')
const deadMoisture = dag.get('site.moisture.dead.category')
const crownBaseHt = dag.get('site.canopy.crown.baseHeight')
const crownTotalHt = dag.get('site.canopy.crown.totalHeight')
const canopyCover = dag.get('site.canopy.cover')
const mapScale = dag.get('site.map.scale')
const mapContours = dag.get('site.map.contours')
const mapDistance = dag.get('site.map.distance')
const mapInterval = dag.get('site.map.interval')
const windAt10m = dag.get('site.wind.speed.at10m')
const aspect = dag.get('site.slope.direction.aspect')
const windSource = dag.get('site.wind.direction.source.fromNorth')
const primaryCover = dag.get('surface.weighted.fire.primaryCover')
const canopyBulkDensity = dag.get('site.canopy.fuel.bulkDensity')
const vectorFromNorth = dag.get('site.fire.vector.fromNorth')
const canopyFoliar = dag.get('site.canopy.fuel.foliar.moistureContent')
const torchingSpecies = dag.get('spotting.torchingTrees.species')
const torchingDbh = dag.get('spotting.torchingTrees.dbh')
const torchingCount = dag.get('spotting.torchingTrees.count')
const canopyDownwindHt = dag.get('site.canopy.downwind.height')
const canopyDownwindOpen = dag.get('site.canopy.downwind.isOpen')
const pileFlameHt = dag.get('spotting.burningPile.flameHeight')
const torchingHt = dag.get('spotting.torchingTrees.height')
const elapsedTime = dag.get('site.fire.time.sinceIgnition')
const airTemp = dag.get('site.temperature.air')
const mortDbh = dag.get('site.canopy.tree.dbh')
const mortSpecies = dag.get('site.canopy.tree.species.fofem6.code')
const spotLocation = dag.get('site.terrain.spotSourceLocation')
const terrainDist = dag.get('site.terrain.ridgeValleyDistance')
const terrainElev = dag.get('site.terrain.ridgeValleyElevation')

test('1 Psi mortality requires 680 Nodes with 19 inputs', () => {
  dag.clearSelected()
  dag.runSelected([['surface.fire.ellipse.psi.treeMortality', true]])
  const inputNodes = dag.requiredInputNodes()
  // console.log(DagJest.arrayList(inputNodes, 'Psi mortality Inputs'))
  expect(inputNodes.length).toEqual(19)
  expect(inputNodes).toContain(primaryKey)
  expect(inputNodes).toContain(secondaryKey)
  expect(inputNodes).toContain(deadMoisture)
  expect(inputNodes).toContain(liveMoisture)
  expect(inputNodes).toContain(windAt10m)
  expect(inputNodes).toContain(windSource)
  expect(inputNodes).toContain(aspect)
  expect(inputNodes).toContain(mapScale)
  expect(inputNodes).toContain(mapInterval)
  expect(inputNodes).toContain(mapContours)
  expect(inputNodes).toContain(mapDistance)
  expect(inputNodes).toContain(crownBaseHt)
  expect(inputNodes).toContain(crownTotalHt)
  expect(inputNodes).toContain(canopyCover)
  expect(inputNodes).toContain(primaryCover)
  expect(inputNodes).toContain(vectorFromNorth)
  expect(inputNodes).toContain(airTemp)
  expect(inputNodes).toContain(mortDbh)
  expect(inputNodes).toContain(mortSpecies)

  const requiredNodes = dag.requiredNodes()
  expect(requiredNodes.length).toEqual(684)
})

test('2 Crown fraction burned requires 818 Nodes with 16 inputs', () => {
  dag.clearSelected()
  dag.runSelected([['crown.fire.final.crownFractionBurned', true]])
  const inputNodes = dag.requiredInputNodes()
  // console.log(DagJest.arrayList(inputNodes, 'Crown fraction burned Inputs'))
  expect(inputNodes.length).toEqual(16)
  expect(inputNodes).toContain(primaryKey)
  expect(inputNodes).toContain(secondaryKey)
  expect(inputNodes).toContain(deadMoisture)
  expect(inputNodes).toContain(liveMoisture)
  expect(inputNodes).toContain(windAt10m)
  expect(inputNodes).toContain(windSource)
  expect(inputNodes).toContain(aspect)
  expect(inputNodes).toContain(mapScale)
  expect(inputNodes).toContain(mapInterval)
  expect(inputNodes).toContain(mapContours)
  expect(inputNodes).toContain(mapDistance)
  expect(inputNodes).toContain(crownBaseHt)
  expect(inputNodes).toContain(crownTotalHt)
  expect(inputNodes).toContain(canopyCover)
  expect(inputNodes).toContain(canopyBulkDensity)
  expect(inputNodes).toContain(canopyFoliar)

  const requiredNodes = dag.requiredNodes()
  expect(requiredNodes.length).toEqual(818)
})

test('3 Combined requires 1047 of 1216 Nodes with 22 selected and 32 input Nodes', () => {
  dag.clearSelected()
  dag.runSelected([
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
  let inputNodes = dag.requiredInputNodes()
  // displayUnrequiredNodes(dag)
  // console.log(DagJest.arrayList(inputNodes, 'Combined Inputs'))
  expect(inputNodes.length).toEqual(35)
  expect(inputNodes).toContain(primaryKey)
  expect(inputNodes).toContain(liveMoisture)
  expect(inputNodes).toContain(secondaryKey)
  expect(inputNodes).toContain(deadMoisture)
  expect(inputNodes).toContain(crownBaseHt)
  expect(inputNodes).toContain(crownTotalHt)
  expect(inputNodes).toContain(canopyCover)
  expect(inputNodes).toContain(mapScale)
  expect(inputNodes).toContain(mapInterval)
  expect(inputNodes).toContain(mapContours)
  expect(inputNodes).toContain(mapDistance)
  expect(inputNodes).toContain(windAt10m)
  expect(inputNodes).toContain(aspect)
  expect(inputNodes).toContain(windSource)
  expect(inputNodes).toContain(primaryCover)
  expect(inputNodes).toContain(canopyBulkDensity)
  expect(inputNodes).toContain(vectorFromNorth)
  expect(inputNodes).toContain(canopyFoliar)
  expect(inputNodes).toContain(torchingSpecies)
  expect(inputNodes).toContain(torchingDbh)
  expect(inputNodes).toContain(torchingCount)
  expect(inputNodes).toContain(canopyDownwindHt)
  expect(inputNodes).toContain(canopyDownwindOpen)
  expect(inputNodes).toContain(pileFlameHt)
  expect(inputNodes).toContain(torchingHt)
  expect(inputNodes).toContain(elapsedTime)
  expect(inputNodes).toContain(airTemp)
  expect(inputNodes).toContain(mortDbh)
  expect(inputNodes).toContain(mortSpecies)
  expect(inputNodes).toContain(spotLocation)
  expect(inputNodes).toContain(terrainDist)
  expect(inputNodes).toContain(terrainElev)
  expect(inputNodes).toContain(dag.get('ignition.lightningStrike.charge'))
  expect(inputNodes).toContain(dag.get('ignition.lightningStrike.fuel.type'))
  expect(inputNodes).toContain(dag.get('ignition.lightningStrike.fuel.depth'))

  let requiredNodes = dag.requiredNodes()
  expect(requiredNodes.length).toEqual(1056)

  // THESE WILL FAIL SINCE WE NO LONGER USE MODULE LEVEL CONFIGURATION
  const doConfigModule = false
  if (doConfigModule) {
  // Try module-level configuration (uses enable/disable)
    configModule(dag, 'surfaceFire')
    requiredNodes = dag.requiredNodes()
    expect(requiredNodes.length).toEqual(1047)
    let danglerNodes = dag.danglerNodes()
    expect(danglerNodes.length).toEqual(0)

    configModule(dag, 'fireEllipse')
    requiredNodes = dag.requiredNodes()
    expect(requiredNodes.length).toEqual(82)
    danglerNodes = dag.danglerNodes()
    expect(danglerNodes.length).toEqual(0)

    configModule(dag, 'scorchHeight')
    requiredNodes = dag.requiredNodes()
    expect(requiredNodes.length).toEqual(16)
    danglerNodes = dag.danglerNodes()
    expect(danglerNodes.length).toEqual(0)

    configModule(dag, 'treeMortality')
    requiredNodes = dag.requiredNodes()
    expect(requiredNodes.length).toEqual(8)
    danglerNodes = dag.danglerNodes()
    expect(danglerNodes.length).toEqual(0)

    configModule(dag, 'surfaceSpotting')
    requiredNodes = dag.requiredNodes()
    expect(requiredNodes.length).toEqual(20)
    danglerNodes = dag.danglerNodes()
    expect(danglerNodes.length).toEqual(0)

    configModule(dag, 'crownSpotting')
    danglerNodes = dag.danglerNodes()
    expect(danglerNodes.length).toEqual(0)
    requiredNodes = dag.requiredNodes()
    expect(requiredNodes.length).toEqual(13)

    configModule(dag, 'spottingDistance')
    requiredNodes = dag.requiredNodes()
    expect(requiredNodes.length).toEqual(45)

    configModule(dag, 'ignitionProbability')
    danglerNodes = dag.danglerNodes()
    expect(danglerNodes.length).toEqual(0)
    requiredNodes = dag.requiredNodes()
    expect(requiredNodes.length).toEqual(7)

    configModule(dag, 'crownFire')
    danglerNodes = dag.danglerNodes()
    // console.log(DagJest.arrayList(danglerNodes, 'Crown Fire standalone danglers'))
    expect(danglerNodes.length).toEqual(3)
    expect(danglerNodes).toContain(dag.get('crown.fire.final.rSa'))
    // because rSa required disabled primary fuel Nodes ros0, waf, windB, windK, slopePhi

    expect(danglerNodes).toContain(
      dag.get('crown.fire.final.crownFractionBurned')
    )
    // because CFB requires disabled Node 'surface.primary.fuel.fire.spreadRate',

    expect(danglerNodes).toContain(dag.get('crown.fire.final.spreadRate'))
    // because final ros requires disabled Node 'surface.primary.fuel.fire.spreadRate',

    inputNodes = dag.requiredInputNodes()
    expect(inputNodes.length).toEqual(17)
    // console.log(
    //   DagJest.arrayList(inputNodes, 'Crown Fire standalone dangler inputs')
    // )
    // The dangler Nodes are inputs...
    expect(inputNodes).toContain(dag.get('crown.fire.final.rSa'))
    expect(inputNodes).toContain(dag.get('crown.fire.final.crownFractionBurned'))
    expect(inputNodes).toContain(dag.get('crown.fire.final.spreadRate'))

    requiredNodes = dag.requiredNodes()
    expect(requiredNodes.length).toEqual(307) // was 308
  }
})
