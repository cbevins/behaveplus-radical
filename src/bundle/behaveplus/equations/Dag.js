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
  ['module.surfaceFire', module],
  ['module.surfaceSpot', module],
  ['module.crownFire', module],
  ['module.crownSpot', module],
  ['module.fireEllipse', module],
  ['module.fireContain', module],
  ['module.scorchHeight', module],
  ['module.treeMortality', module],
  ['module.spotting', module],
  ['module.ignitionProbability', module],

  ['link.crownFire', [['ConfigLinkSurfaceFire'], config]],
  ['link.crownSpot', [['ConfigLinkCrownFire'], config]],
  ['link.fireContain', [['ConfigLinkFireEllipse'], config]],
  ['link.fireEllipse', [['ConfigLinkSurfaceFire'], config]],
  ['link.scorchHeight', [['ConfigLinkSurfaceFire'], config]],
  ['link.surfaceSpot', [['ConfigLinkSurfaceFire'], config]],
  ['link.treeMortality', [['ConfigLinkScorchHeight'], config]],
*/
export function module (dag, nodeValuePairs) {
  // Dag.modules and Dag.links are Sets Node references
  console.log('module()')
  // nodeValuePairs.forEach(([node, value]))
}
