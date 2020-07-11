import { bind, call, config, input, item, method, node, set, variant, when } from './specs.js'
import { n } from './names.js'
import { lib } from './methods.js'

/**
 * Returns an array of definitions for a Behave fuel model.
 * @param {NodeSpec} self ['surface', 'primary', 'fuel', 'model', 'behave']
 * @param {NodeSpec} cfgFuelNode ['configure', 'fuel', 'primary']
 * @param {NodeSpec} catalogKeyNode ['surface', 'promary', 'fuel', 'model', 'catalogKey']
 * @param {NodeSpec} cfgCuredHerbNode ['configure', 'fuel', 'behave', 'curedHerbFraction']
 * @param {NodeSpec} moisNode ['site', 'moisture']
 */
export function nodes (self, cfgFuelNode, catalogKeyNode, cfgCuredHerbNode, moisNode) {
  return [
    // Cured herb fraction is either input or estimated from liv herb moisture content
    item(
      node(self, n.cured, n.herb, n.fraction),
      variant(n.fuel, n.fraction),
      when(cfgCuredHerbNode, n.cfgInput, input()),
      config(call(method(lib.fuel.behave.cured.herb.fraction)), node(moisNode, n.live, n.herb))),

    /*
      The following 12 Nodes (1 depth, 2 heat, 1 mext, 5 load, 3 savr) are either:
      - input if cfgFuelNode === 'behave',
      - fetched from the fuel catalog if cfgFuelNode === 'catalogKey', or
      - set to zero or some other no-fuel constant
    */
    item(
      node(self, n.depth),
      variant(n.fuel, n.depth),
      when(cfgFuelNode, n.behave, input()),
      when(cfgFuelNode, n.catalogKey,
        call(method(lib.fuel.catalog.behave.depth), catalogKeyNode)),
      config(set(0.01))),

    item(
      node(self, n.dead, n.mext),
      variant(n.fuel, n.mext),
      when(cfgFuelNode, n.behave, input()),
      when(cfgFuelNode, n.catalogKey, call(
        method(lib.fuel.catalog.behave.dead.mext), catalogKeyNode)),
      config(set(0.01))),

    item(
      node(self, n.dead, n.heat),
      variant(n.fuel, n.heat),
      when(cfgFuelNode, n.behave, input()),
      when(cfgFuelNode, n.catalogKey, call(
        method(lib.fuel.catalog.behave.dead.heat), catalogKeyNode)),
      config(set(8000))),

    item(node(self, n.live, n.heat), variant(n.fuel, n.heat),
      when(cfgFuelNode, n.behave, input()),
      when(cfgFuelNode, n.catalogKey, call(
        method(lib.fuel.catalog.behave.live.heat), catalogKeyNode)),
      config(set(8000))),

    item(node(self, n.dead, n.tl1h, n.load), variant(n.fuel, n.load),
      when(cfgFuelNode, n.behave, input()),
      when(cfgFuelNode, n.catalogKey, call(
        method(lib.fuel.catalog.behave.dead.tl1h.load), catalogKeyNode)),
      config(set(0))),

    item(node(self, n.dead, n.tl1h, n.savr), variant(n.fuel, n.savr),
      when(cfgFuelNode, n.behave, input()),
      when(cfgFuelNode, n.catalogKey, call(
        method(lib.fuel.catalog.behave.dead.tl1h.savr), catalogKeyNode)),
      config(set(0))),

    item(
      node(self, n.dead, n.tl10h, n.load),
      variant(n.fuel, n.load),
      when(cfgFuelNode, n.behave, input()),
      when(cfgFuelNode, n.catalogKey, call(
        method(lib.fuel.catalog.behave.dead.tl10h.load), catalogKeyNode)),
      config(set(0))),

    item(
      node(self, n.dead, n.tl100h, n.load),
      variant(n.fuel, n.load),
      when(cfgFuelNode, n.behave, input()),
      when(cfgFuelNode, n.catalogKey, call(
        method(lib.fuel.catalog.behave.dead.tl100h.load), catalogKeyNode)),
      config(set(0))),

    item(
      node(self, n.total, n.herb, n.load),
      variant(n.fuel, n.load),
      when(cfgFuelNode, n.behave, input()),
      when(cfgFuelNode, n.catalogKey, call(
        method(lib.fuel.catalog.behave.total.herb.load), catalogKeyNode)),
      config(set(0))),

    item(
      node(self, n.live, n.herb, n.savr),
      variant(n.fuel, n.savr),
      when(cfgFuelNode, n.behave, input()),
      when(cfgFuelNode, n.catalogKey, call(
        method(lib.fuel.catalog.behave.live.herb.savr), catalogKeyNode)),
      config(set(1600))),

    item(
      node(self, n.live, n.stem, n.load),
      variant(n.fuel, n.load),
      when(cfgFuelNode, n.behave, input()),
      when(cfgFuelNode, n.catalogKey, call(
        method(lib.fuel.catalog.behave.live.stem.load), catalogKeyNode)),
      config(set(1600))),

    item(
      node(self, n.live, n.stem, n.savr),
      variant(n.fuel, n.savr),
      when(cfgFuelNode, n.behave, input()),
      when(cfgFuelNode, n.catalogKey, call(
        method(lib.fuel.catalog.behave.live.stem.savr), catalogKeyNode)),
      config(set(1600))),

    // The dead and live herb load Nodes are always calculated
    item(
      node(self, n.dead, n.herb, n.load),
      variant(n.fuel, n.load),
      config(call(method(lib.fuel.behave.dead.herb.load),
        node(self, n.cured, n.herb, n.fraction),
        node(self, n.total, n.herb, n.load)))),

    item(
      node(self, n.live, n.herb, n.load),
      variant(n.fuel, n.load),
      config(call(method(lib.fuel.behave.live.herb.load),
        node(self, n.cured, n.herb, n.fraction),
        node(self, n.total, n.herb, n.load)))),

    // The following are constant for all Behave fuel model particles
    item(node(self, n.dead, n.tl10h, n.savr), variant(n.fuel, n.savr), config(set(109))),
    item(node(self, n.dead, n.tl100h, n.savr), variant(n.fuel, n.savr), config(set(30))),
    item(node(self, n.dens), variant(n.fuel, n.dens), config(set(32))),
    item(node(self, n.seff), variant(n.fuel, n.seff), config(set(0.01))),
    item(node(self, n.stot), variant(n.fuel, n.stot), config(set(0.0555))),

    // The following bind particle moisture contents to a source
    item(node(self, n.dead, n.tl1h, n.mois), variant(n.fuel, n.mois),
      config(bind(node(moisNode, n.dead, n.tl1h)))),
    item(node(self, n.dead, n.tl10h, n.mois), variant(n.fuel, n.mois),
      config(bind(node(moisNode, n.dead, n.tl10h)))),
    item(node(self, n.dead, n.tl100h, n.mois), variant(n.fuel, n.mois),
      config(bind(node(moisNode, n.dead, n.tl100h)))),
    item(node(self, n.dead, n.herb, n.mois), variant(n.fuel, n.mois),
      config(bind(node(moisNode, n.dead, n.tl1h)))),
    item(node(self, n.live, n.herb, n.mois), variant(n.fuel, n.mois),
      config(bind(node(moisNode, n.live, n.herb)))),
    item(node(self, n.live, n.stem, n.mois), variant(n.fuel, n.mois),
      config(bind(node(moisNode, n.live, n.stem))))
  ]
}
