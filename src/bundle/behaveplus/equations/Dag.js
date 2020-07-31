/* eslint-disable no-unused-vars */
// Node updater methods that are handled internally by the Dag
export function bind (value) { return value }
export function config (value) { return value }
export function dangler (value) { return value }
export function fixed (value) { return value }
export function input (value) { return value }
export function link (value) { return value }

/*
 Callback for Dag.setModule()
  - Surface Fire
    - Crown Fire
        - Crown Fire Spotting
    - Fire Ellipse
        - Fire Containment
    - Surface Fire Spotting
    - Scorch Height
        - Tree Mortality
- Spotting from Burning Pile or Torching Trees
- Ignition Probability
*/
export function module (dag) {
  const surfaceFireActive = dag.nodeIdx('module.surfaceFire.active') // 'active', 'inactive'
  const surfaceSpotActive = dag.nodeIdx('module.surfaceSpot.active') // 'active', 'inactive'
  const fireEllipseActive = dag.nodeIdx('module.fireEllipse.active') // 'active', 'inactive'
  const crownFireActive = dag.nodeIdx('module.crownFire.active') // 'active', 'inactive'
  const crownSpotActive = dag.nodeIdx('module.crownSpot.active') // 'active', 'inactive'
  const scorchHeightActive = dag.nodeIdx('module.scorchHeight.active')
  const treeMortalityActive = dag.nodeIdx('module.treeMortality.active')
  const spotActive = dag.nodeIdx('module.spot.active')
  const ignitionProbabilityActive = dag.nodeIdx('module.ignitionProbability.active')

  const fireEllipseLink = dag.nodeIdx('module.fireEllipse.link') // 'standAlone', 'surfaceFire'
  const crownFireLink = dag.nodeIdx('module.crownFire.link') // 'standAlone', 'surfaceFire'
  const surfaceSpotLink = dag.nodeIdx('module.surfaceSpot.link') // 'standAlone', 'surfaceFire'
  const scorchHeightLink = dag.nodeIdx('module.scorchHeight.link') // 'standAlone', 'surfaceFire'
  const treeMortalityIdx = dag.nodeIdx('module.treeMortality.link') // 'standAlone', 'scorchHeight'
  const crownSpotLink = dag.nodeIdx('module.crownSpot.link') // 'standAlone', 'crownFire'
  const fireContainLink = dag.nodeIdx('module.crownSpot.link') // 'standAlone', 'fireEllipse'
}
