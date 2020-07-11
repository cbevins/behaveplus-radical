import { call, config, item, method, node, set, variant } from './specs.js'
import { n } from './names.js'
import { lib } from './methods.js'

/**
 *
 * @param {NodeSpec} self [..., 'fuel', 'bed']
 * @param {NodeSpec} domainNode [...,'fuel','model', 'domain']
 * @param {NodeSpec} bvNode [...,'fuel','model', 'behave']
 * @param {NodeSpec} chNode [...,'fuel','model', 'chaparral']
 * @param {NodeSpec} pgNode [...,'fuel','model', 'palmettoGallberry']
 * @param {NodeSpec} waNode [...,'fuel','model', 'westernAspen']
 */
export function fuelBed (self, domainNode, bvNode, chNode, pgNode, waNode, moisNode) {
  const select = call(method(lib.fuel.catalog.selectByDomain))
  return [
    item(node(self, n.nofuel), variant(n.nofuel), config(set(0))),
    // Dead particle 1
    item(node(self, n.dead, n.p1, n.load), variant(n.fuel, n.load),
      config(select, domainNode,
        node(bvNode, n.dead, n.tl1h, n.load),
        node(self, n.nofuel),
        node(self, n.nofuel),
        node(self, n.nofuel)
      )),
    item(node(self, n.dead, n.p1, n.savr), variant(n.fuel, n.savr),
      config(select, domainNode,
        node(bvNode, n.dead, n.tl1h, n.savr),
        node(self, n.nofuel),
        node(self, n.nofuel),
        node(self, n.nofuel)
      )),
    item(node(self, n.dead, n.p1, n.mois), variant(n.fuel, n.mois),
      config(select, domainNode,
        node(bvNode, n.dead, n.tl1h, n.mois),
        node(self, n.nofuel),
        node(self, n.nofuel),
        node(self, n.nofuel)
      )),
    item(node(self, n.dead, n.p1, n.heat), variant(n.fuel, n.heat),
      config(select, domainNode,
        node(bvNode, n.dead, n.heat),
        node(self, n.nofuel),
        node(self, n.nofuel),
        node(self, n.nofuel)
      )),
    item(node(self, n.dead, n.p1, n.dens), variant(n.fuel, n.dens),
      config(select, domainNode,
        node(bvNode, n.dens),
        node(self, n.nofuel),
        node(self, n.nofuel),
        node(self, n.nofuel)
      )),
    item(node(self, n.dead, n.p1, n.stot), variant(n.fuel, n.stot),
      config(select, domainNode,
        node(bvNode, n.stot),
        node(self, n.nofuel),
        node(self, n.nofuel),
        node(self, n.nofuel)
      )),
    item(node(self, n.dead, n.p1, n.seff), variant(n.fuel, n.seff),
      config(select, domainNode,
        node(bvNode, n.seff),
        node(self, n.nofuel),
        node(self, n.nofuel),
        node(self, n.nofuel)
      )),
    // Dead particle 2
    item(node(self, n.dead, n.p2, n.load), variant(n.fuel, n.load),
      config(select, domainNode,
        node(bvNode, n.dead, n.tl10h, n.load),
        node(self, n.nofuel),
        node(self, n.nofuel),
        node(self, n.nofuel)
      )),
    item(node(self, n.dead, n.p2, n.savr), variant(n.fuel, n.savr),
      config(select, domainNode,
        node(bvNode, n.dead, n.tl10h, n.savr),
        node(self, n.nofuel),
        node(self, n.nofuel),
        node(self, n.nofuel)
      )),
    item(node(self, n.dead, n.p2, n.mois), variant(n.fuel, n.mois),
      config(select, domainNode,
        node(bvNode, n.dead, n.tl10h, n.mois),
        node(self, n.nofuel),
        node(self, n.nofuel),
        node(self, n.nofuel)
      )),
    item(node(self, n.dead, n.p2, n.heat), variant(n.fuel, n.heat),
      config(select, domainNode,
        node(bvNode, n.dead, n.heat),
        node(self, n.nofuel),
        node(self, n.nofuel),
        node(self, n.nofuel)
      )),
    item(node(self, n.dead, n.p2, n.dens), variant(n.fuel, n.dens),
      config(select, domainNode,
        node(bvNode, n.dens),
        node(self, n.nofuel),
        node(self, n.nofuel),
        node(self, n.nofuel)
      )),
    item(node(self, n.dead, n.p2, n.stot), variant(n.fuel, n.stot),
      config(select, domainNode,
        node(bvNode, n.stot),
        node(self, n.nofuel),
        node(self, n.nofuel),
        node(self, n.nofuel)
      )),
    item(node(self, n.dead, n.p2, n.seff), variant(n.fuel, n.seff),
      config(select, domainNode,
        node(bvNode, n.seff),
        node(self, n.nofuel),
        node(self, n.nofuel),
        node(self, n.nofuel)
      )),
    // Dead particle 2
    item(node(self, n.dead, n.p2, n.load), variant(n.fuel, n.load),
      config(select, domainNode,
        node(bvNode, n.dead, n.tl10h, n.load),
        node(self, n.nofuel),
        node(self, n.nofuel),
        node(self, n.nofuel)
      )),
    item(node(self, n.dead, n.p2, n.savr), variant(n.fuel, n.savr),
      config(select, domainNode,
        node(bvNode, n.dead, n.tl10h, n.savr),
        node(self, n.nofuel),
        node(self, n.nofuel),
        node(self, n.nofuel)
      )),
    item(node(self, n.dead, n.p2, n.mois), variant(n.fuel, n.mois),
      config(select, domainNode,
        node(bvNode, n.dead, n.tl10h, n.mois),
        node(self, n.nofuel),
        node(self, n.nofuel),
        node(self, n.nofuel)
      )),
    item(node(self, n.dead, n.p2, n.heat), variant(n.fuel, n.heat),
      config(select, domainNode,
        node(bvNode, n.dead, n.heat),
        node(self, n.nofuel),
        node(self, n.nofuel),
        node(self, n.nofuel)
      )),
    item(node(self, n.dead, n.p2, n.dens), variant(n.fuel, n.dens),
      config(select, domainNode,
        node(bvNode, n.dens),
        node(self, n.nofuel),
        node(self, n.nofuel),
        node(self, n.nofuel)
      )),
    item(node(self, n.dead, n.p2, n.stot), variant(n.fuel, n.stot),
      config(select, domainNode,
        node(bvNode, n.stot),
        node(self, n.nofuel),
        node(self, n.nofuel),
        node(self, n.nofuel)
      )),
    item(node(self, n.dead, n.p2, n.seff), variant(n.fuel, n.seff),
      config(select, domainNode,
        node(bvNode, n.seff),
        node(self, n.nofuel),
        node(self, n.nofuel),
        node(self, n.nofuel)
      )),
    // Dead particle 3
    item(node(self, n.dead, n.p3, n.load), variant(n.fuel, n.load),
      config(select, domainNode,
        node(bvNode, n.dead, n.tl100h, n.load),
        node(self, n.nofuel),
        node(self, n.nofuel),
        node(self, n.nofuel)
      )),
    item(node(self, n.dead, n.p3, n.savr), variant(n.fuel, n.savr),
      config(select, domainNode,
        node(bvNode, n.dead, n.tl100h, n.savr),
        node(self, n.nofuel),
        node(self, n.nofuel),
        node(self, n.nofuel)
      )),
    item(node(self, n.dead, n.p3, n.mois), variant(n.fuel, n.mois),
      config(select, domainNode,
        node(bvNode, n.dead, n.tl100h, n.mois),
        node(self, n.nofuel),
        node(self, n.nofuel),
        node(self, n.nofuel)
      )),
    item(node(self, n.dead, n.p3, n.heat), variant(n.fuel, n.heat),
      config(select, domainNode,
        node(bvNode, n.dead, n.heat),
        node(self, n.nofuel),
        node(self, n.nofuel),
        node(self, n.nofuel)
      )),
    item(node(self, n.dead, n.p3, n.dens), variant(n.fuel, n.dens),
      config(select, domainNode,
        node(bvNode, n.dens),
        node(self, n.nofuel),
        node(self, n.nofuel),
        node(self, n.nofuel)
      )),
    item(node(self, n.dead, n.p3, n.stot), variant(n.fuel, n.stot),
      config(select, domainNode,
        node(bvNode, n.stot),
        node(self, n.nofuel),
        node(self, n.nofuel),
        node(self, n.nofuel)
      )),
    item(node(self, n.dead, n.p3, n.seff), variant(n.fuel, n.seff),
      config(select, domainNode,
        node(bvNode, n.seff),
        node(self, n.nofuel),
        node(self, n.nofuel),
        node(self, n.nofuel)
      )),
    // Dead particle 4
    item(node(self, n.dead, n.p4, n.load), variant(n.fuel, n.load),
      config(select, domainNode,
        node(bvNode, n.dead, n.herb, n.load),
        node(self, n.nofuel),
        node(self, n.nofuel),
        node(self, n.nofuel)
      )),
    item(node(self, n.dead, n.p4, n.savr), variant(n.fuel, n.savr),
      config(select, domainNode,
        node(bvNode, n.live, n.herb, n.savr),
        node(self, n.nofuel),
        node(self, n.nofuel),
        node(self, n.nofuel)
      )),
    item(node(self, n.dead, n.p4, n.mois), variant(n.fuel, n.mois),
      config(select, domainNode,
        node(bvNode, n.dead, n.herb, n.mois),
        node(self, n.nofuel),
        node(self, n.nofuel),
        node(self, n.nofuel)
      )),
    item(node(self, n.dead, n.p4, n.heat), variant(n.fuel, n.heat),
      config(select, domainNode,
        node(bvNode, n.dead, n.heat),
        node(self, n.nofuel),
        node(self, n.nofuel),
        node(self, n.nofuel)
      )),
    item(node(self, n.dead, n.p4, n.dens), variant(n.fuel, n.dens),
      config(select, domainNode,
        node(bvNode, n.dens),
        node(self, n.nofuel),
        node(self, n.nofuel),
        node(self, n.nofuel)
      )),
    item(node(self, n.dead, n.p4, n.stot), variant(n.fuel, n.stot),
      config(select, domainNode,
        node(bvNode, n.stot),
        node(self, n.nofuel),
        node(self, n.nofuel),
        node(self, n.nofuel)
      )),
    item(node(self, n.dead, n.p4, n.seff), variant(n.fuel, n.seff),
      config(select, domainNode,
        node(bvNode, n.seff),
        node(self, n.nofuel),
        node(self, n.nofuel),
        node(self, n.nofuel)
      )),
    // Dead particle 5
    item(node(self, n.dead, n.p5, n.load), variant(n.fuel, n.load),
      config(select, domainNode,
        node(self, n.nofuel),
        node(self, n.nofuel),
        node(self, n.nofuel),
        node(self, n.nofuel)
      )),
    item(node(self, n.dead, n.p5, n.savr), variant(n.fuel, n.savr),
      config(select, domainNode,
        node(self, n.nofuel),
        node(self, n.nofuel),
        node(self, n.nofuel),
        node(self, n.nofuel)
      )),
    item(node(self, n.dead, n.p5, n.mois), variant(n.fuel, n.mois),
      config(select, domainNode,
        node(self, n.nofuel),
        node(self, n.nofuel),
        node(self, n.nofuel),
        node(self, n.nofuel)
      )),
    item(node(self, n.dead, n.p5, n.heat), variant(n.fuel, n.heat),
      config(select, domainNode,
        node(self, n.nofuel),
        node(self, n.nofuel),
        node(self, n.nofuel),
        node(self, n.nofuel)
      )),
    item(node(self, n.dead, n.p5, n.dens), variant(n.fuel, n.dens),
      config(select, domainNode,
        node(self, n.nofuel),
        node(self, n.nofuel),
        node(self, n.nofuel),
        node(self, n.nofuel)
      )),
    item(node(self, n.dead, n.p5, n.stot), variant(n.fuel, n.stot),
      config(select, domainNode,
        node(self, n.nofuel),
        node(self, n.nofuel),
        node(self, n.nofuel),
        node(self, n.nofuel)
      )),
    item(node(self, n.dead, n.p5, n.seff), variant(n.fuel, n.seff),
      config(select, domainNode,
        node(self, n.nofuel),
        node(self, n.nofuel),
        node(self, n.nofuel),
        node(self, n.nofuel)
      )),

    // Live particle 1
    item(node(self, n.live, n.p1, n.load), variant(n.fuel, n.load),
      config(select, domainNode,
        node(bvNode, n.live, n.herb, n.load),
        node(self, n.nofuel),
        node(self, n.nofuel),
        node(self, n.nofuel)
      )),
    item(node(self, n.live, n.p1, n.savr), variant(n.fuel, n.savr),
      config(select, domainNode,
        node(bvNode, n.live, n.herb, n.savr),
        node(self, n.nofuel),
        node(self, n.nofuel),
        node(self, n.nofuel)
      )),
    item(node(self, n.live, n.p1, n.mois), variant(n.fuel, n.mois),
      config(select, domainNode,
        node(bvNode, n.live, n.herb, n.mois),
        node(self, n.nofuel),
        node(self, n.nofuel),
        node(self, n.nofuel)
      )),
    item(node(self, n.live, n.p1, n.heat), variant(n.fuel, n.heat),
      config(select, domainNode,
        node(bvNode, n.live, n.heat),
        node(self, n.nofuel),
        node(self, n.nofuel),
        node(self, n.nofuel)
      )),
    item(node(self, n.live, n.p1, n.dens), variant(n.fuel, n.dens),
      config(select, domainNode,
        node(bvNode, n.dens),
        node(self, n.nofuel),
        node(self, n.nofuel),
        node(self, n.nofuel)
      )),
    item(node(self, n.live, n.p1, n.stot), variant(n.fuel, n.stot),
      config(select, domainNode,
        node(bvNode, n.stot),
        node(self, n.nofuel),
        node(self, n.nofuel),
        node(self, n.nofuel)
      )),
    item(node(self, n.live, n.p1, n.seff), variant(n.fuel, n.seff),
      config(select, domainNode,
        node(bvNode, n.seff),
        node(self, n.nofuel),
        node(self, n.nofuel),
        node(self, n.nofuel)
      )),

    // Live particle 2
    item(node(self, n.live, n.p2, n.load), variant(n.fuel, n.load),
      config(select, domainNode,
        node(bvNode, n.live, n.stem, n.load),
        node(self, n.nofuel),
        node(self, n.nofuel),
        node(self, n.nofuel)
      )),
    item(node(self, n.live, n.p2, n.savr), variant(n.fuel, n.savr),
      config(select, domainNode,
        node(bvNode, n.live, n.stem, n.savr),
        node(self, n.nofuel),
        node(self, n.nofuel),
        node(self, n.nofuel)
      )),
    item(node(self, n.live, n.p2, n.mois), variant(n.fuel, n.mois),
      config(select, domainNode,
        node(bvNode, n.live, n.stem, n.mois),
        node(self, n.nofuel),
        node(self, n.nofuel),
        node(self, n.nofuel)
      )),
    item(node(self, n.live, n.p2, n.heat), variant(n.fuel, n.heat),
      config(select, domainNode,
        node(bvNode, n.live, n.heat),
        node(self, n.nofuel),
        node(self, n.nofuel),
        node(self, n.nofuel)
      )),
    item(node(self, n.live, n.p2, n.dens), variant(n.fuel, n.dens),
      config(select, domainNode,
        node(bvNode, n.dens),
        node(self, n.nofuel),
        node(self, n.nofuel),
        node(self, n.nofuel)
      )),
    item(node(self, n.live, n.p2, n.stot), variant(n.fuel, n.stot),
      config(select, domainNode,
        node(bvNode, n.stot),
        node(self, n.nofuel),
        node(self, n.nofuel),
        node(self, n.nofuel)
      )),
    item(node(self, n.live, n.p2, n.seff), variant(n.fuel, n.seff),
      config(select, domainNode,
        node(bvNode, n.seff),
        node(self, n.nofuel),
        node(self, n.nofuel),
        node(self, n.nofuel)
      )),

    // Live particle 3
    item(node(self, n.live, n.p3, n.load), variant(n.fuel, n.load),
      config(select, domainNode,
        node(self, n.nofuel),
        node(self, n.nofuel),
        node(self, n.nofuel),
        node(self, n.nofuel)
      )),
    item(node(self, n.live, n.p3, n.savr), variant(n.fuel, n.savr),
      config(select, domainNode,
        node(self, n.nofuel),
        node(self, n.nofuel),
        node(self, n.nofuel),
        node(self, n.nofuel)
      )),
    item(node(self, n.live, n.p3, n.mois), variant(n.fuel, n.mois),
      config(select, domainNode,
        node(self, n.nofuel),
        node(self, n.nofuel),
        node(self, n.nofuel),
        node(self, n.nofuel)
      )),
    item(node(self, n.live, n.p3, n.heat), variant(n.fuel, n.heat),
      config(select, domainNode,
        node(self, n.nofuel),
        node(self, n.nofuel),
        node(self, n.nofuel),
        node(self, n.nofuel)
      )),
    item(node(self, n.live, n.p3, n.dens), variant(n.fuel, n.dens),
      config(select, domainNode,
        node(self, n.nofuel),
        node(self, n.nofuel),
        node(self, n.nofuel),
        node(self, n.nofuel)
      )),
    item(node(self, n.live, n.p3, n.stot), variant(n.fuel, n.stot),
      config(select, domainNode,
        node(self, n.nofuel),
        node(self, n.nofuel),
        node(self, n.nofuel),
        node(self, n.nofuel)
      )),
    item(node(self, n.live, n.p3, n.seff), variant(n.fuel, n.seff),
      config(select, domainNode,
        node(self, n.nofuel),
        node(self, n.nofuel),
        node(self, n.nofuel),
        node(self, n.nofuel)
      ))
  ]
  // Then add derived properties
}
