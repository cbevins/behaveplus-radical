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

Notes:
  - module() is called via Dag.setModules() -> DagDna.setModules() -> DagSetRun.setModules()
  - The Module values have already been set before module() is called
  - module() should enabled/disable Nodes and set Link Nodes as appropriate
  - After returning from module(), DagSetRun.setModules() calls config()
*/
export function module (dag) {
  const modules = [
    ['surfaceFire', ['surface.primary', 'surface.secondary', 'surface.weighted'], null],
    ['surfaceSpot', ['spotting.surfaceFire'], 'surfaceFire'],
    ['crownFire', ['crown.'], 'surfaceFire'],
    ['crownSpot', ['spotting.crownFire.'], 'crownFire'],
    ['fireEllipse', ['surface.fire.ellipse.'], 'surfaceFire'],
    ['fireContain', ['contain'], 'fireEllipse'],
    ['scorchHeight', ['scorch.'], 'surfaceFire'],
    ['treeMortality', ['mortality.'], 'scorchHeight'],
    ['spotting', ['spotting.burningPile', 'spotting.torchingTrees'], null],
    ['ignitionProbability', ['ignition.'], null]
  ]

  modules.forEach(([name, prefixes, linkName]) => {
    const modNode = dag.get('module.' + name) // *this* module Node
    const active = modNode.value === 'active'

    // Set up possible linkage
    if (linkName) {
      const linkNode = dag.get('link.' + name)
      linkNode.value = 'standAlone'
      if (active) {
        const linkMod = dag.get('module.' + linkName)
        if (linkMod.value === 'active') { // if there is a link module and its active
          linkNode.value = 'linkedTo' + linkName.charAt(0).toUpperCase() + linkName.slice(1) // link to it
        }
      }
    }

    // Enable/disable this module's Nodes
    prefixes.forEach(prefix => {
      dag.node.forEach(node => { if (node.key.startsWith(prefix)) node.isEnabled = active })
    })
  })
}
