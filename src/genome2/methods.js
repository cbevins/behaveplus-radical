import { n } from './names.js'

export const lib = {
  fuel: {
    behave: {
      cured: {
        herb: {
          fraction: () => 0
        }
      },
      dead: {
        herb: {
          load: (f, load) => f * load
        }
      },
      live: {
        herb: {
          load: (f, load) => (1 - f) * load
        }
      }
    },
    catalog: {
      selectByDomain: (domain, bvNode, chNode, pgNode, waNode) => {
        if (domain === n.bvDomain) return bvNode.value.current
        if (domain === n.chDomain) return chNode.value.current
        if (domain === n.pgDomain) return pgNode.value.current
        if (domain === n.waDomain) return waNode.value.current
      },
      behave: {
        depth: (key) => 1,
        dead: {
          heat: (key) => 8000,
          mext: (key) => 0.2,
          tl1h: {
            load: (key) => 1,
            savr: (key) => 1200
          },
          tl10h: {
            load: (key) => 1
          },
          tl100h: {
            load: (key) => 1
          }
        },
        live: {
          heat: (key) => 8000,
          herb: {
            savr: (key) => 1600
          },
          stem: {
            load: (key) => 1,
            savr: (key) => 1600
          }
        },
        total: {
          herb: {
            load: (key) => 1
          }
        }
      }
    }
  }
}
