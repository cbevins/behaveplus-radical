import { n } from './names.js'

export function ucFirst (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
export function camelCase (str) {
  let cc = ''
  str.split('.').forEach((segment, idx) => {
    cc += idx ? ucFirst(segment) : segment
  })
  return cc
}

function modelParm (parent, self, cfgFuel, unused = 0) {
  const segment = self.split('.')
  const domain = segment[0]
  const prop = segment[segment.length - 1]
  const catalogKeyNode = `${parent}.catalogKey`
  return [`${parent}.${self}`, `fuel.${prop}`,
    [cfgFuel, domain, n.input],
    [cfgFuel, n.catalogKey, `FuelCatalog.${camelCase(self)}`, catalogKeyNode],
    [n.set, unused]]
}

const pre = 'surface.primary.fuel.model'
const cfg = 'configure.fuel.primary'

export const behave = [
  modelParm(pre, `behave.${n.depth}`, cfg),
  modelParm(pre, `behave.dead.${n.mext}`, cfg),
  modelParm(pre, `behave.dead.${n.heat}`, cfg),
  modelParm(pre, `behave.dead.tl1h.${n.load}`, cfg),
  modelParm(pre, `behave.dead.tl1h.${n.savr}`, cfg),
  modelParm(pre, `behave.dead.tl10h.${n.load}`, cfg),
  modelParm(pre, `behave.dead.tl100h.${n.load}`, cfg),
  modelParm(pre, `behave.live.${n.heat}`, cfg),
  modelParm(pre, `behave.live.herb.${n.savr}`, cfg),
  modelParm(pre, `behave.live.stem.${n.load}`, cfg),
  modelParm(pre, `behave.live.stem.${n.savr}`, cfg),
  modelParm(pre, `behave.total.herb.${n.load}`, cfg)
]
