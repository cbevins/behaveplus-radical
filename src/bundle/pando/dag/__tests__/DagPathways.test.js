import { Dag } from '../Dag.js'
import * as Pathways from '../DagPathways.js'
import * as Dna from '../../../behaveplus/BpxDna.js'

const dag = new Dag(Dna)
dag.runConfigs([
  ['link.crownFire', 'linkedToSurfaceFire'],
  ['link.crownSpot', 'linkedToCrownFire'],
  ['link.fireContain', 'linkedToFireEllipse'],
  ['link.fireEllipse', 'linkedToSurfaceFire'],
  ['link.scorchHeight', 'linkedToSurfaceFire'],
  ['link.surfaceSpot', 'linkedToSurfaceFire'],
  ['link.treeMortality', 'linkedToScorchHeight']
])
// dag.runSelected([['surface.primary.fuel.model.behave.parms.depth', true]])
dag.runSelected([['surface.weighted.fire.spreadRate', true]])
dag.runSelected([['surface.weighted.fire.firelineIntensity', true]])
dag.runSelected([['surface.weighted.fire.reactionIntensity', true]])
dag.runSelected([['surface.fire.ellipse.head.spreadRate', true]])
dag.runSelected([['surface.fire.ellipse.head.scorchHeight', true]])
// dag.runSelected([['spotting.torchingTrees.spotDistance.mountainTerrain', true]])
dag.runSelected([['spotting.torchingTrees.firebrand.criticalCoverHeight', true]])

test('1: Pathways should detect two paths', () => {
  const keyMap = Pathways.keyMap(dag)
  expect(keyMap.size).toEqual(2)

  expect(keyMap.has('surface.weighted.fire.spreadRate')).toEqual(true)
  const path1 = keyMap.get('surface.weighted.fire.spreadRate')
  expect(path1.selected.length).toEqual(5)
  expect(path1.selected).toContain('surface.weighted.fire.spreadRate')
  expect(path1.selected).toContain('surface.weighted.fire.firelineIntensity')
  expect(path1.selected).toContain('surface.weighted.fire.reactionIntensity')
  expect(path1.selected).toContain('surface.fire.ellipse.head.spreadRate')
  expect(path1.selected).toContain('surface.fire.ellipse.head.scorchHeight')
  // expect(path1.producers.length).toEqual(325)
  expect(path1.producers.length).toEqual(247)
  expect(path1.producers).toContain('surface.primary.fuel.model.catalogKey') // 0
  expect(path1.producers).toContain('surface.primary.fuel.bed.dead.particle.class1.effectiveFuel.ovendryLoad') // 100
  expect(path1.producers).toContain('surface.primary.fuel.bed.dead.particle.class5.heatOfCombustion') // 200
  expect(path1.producers).toContain('surface.primary.fuel.fire.reactionIntensity') // 300

  expect(keyMap.has('spotting.torchingTrees.firebrand.criticalCoverHeight')).toEqual(true)
  const path2 = keyMap.get('spotting.torchingTrees.firebrand.criticalCoverHeight')
  expect(path2.selected.length).toEqual(1)
  expect(path2.selected).toContain('spotting.torchingTrees.firebrand.criticalCoverHeight')
  expect(path2.producers.length).toEqual(11)
  expect(path2.producers).toContain('spotting.torchingTrees.species')
  expect(path2.producers).toContain('spotting.torchingTrees.dbh')
  expect(path2.producers).toContain('spotting.torchingTrees.count')
  expect(path2.producers).toContain('spotting.torchingTrees.flameHeight')
  expect(path2.producers).toContain('spotting.torchingTrees.flameDuration')
  expect(path2.producers).toContain('site.canopy.downwind.height')
  expect(path2.producers).toContain('site.canopy.downwind.isOpen')
  expect(path2.producers).toContain('spotting.torchingTrees.height')
  expect(path2.producers).toContain('site.canopy.downwind.appliedHeight')
  expect(path2.producers).toContain('spotting.torchingTrees.firebrand.height')
  expect(path2.producers).toContain('spotting.torchingTrees.firebrand.criticalCoverHeight')
})
