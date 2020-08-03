import { Bpx } from '../../Bpx.js'
import * as DagJest from '../../../../utils/matchers.js'

const value = DagJest.value
expect.extend({ value })

const dag = new Bpx()

dag.runConfigs([
  ['configure.fuel.moisture', ['individual', 'liveCategory', 'category', 'catalog'][0]]
])

// Moisture Nodes
const moisCfg = dag.get('configure.fuel.moisture')
const d1Mois = dag.get('surface.primary.fuel.bed.dead.particle.class1.moistureContent')
const l1Mois = dag.get('surface.primary.fuel.bed.live.particle.class1.moistureContent')

const moisTl1h = dag.get('site.moisture.dead.tl1h')
const moisTl10h = dag.get('site.moisture.dead.tl10h')
const moisTl100h = dag.get('site.moisture.dead.tl100h')
const moisDead = dag.get('site.moisture.dead.category')

const moisHerb = dag.get('site.moisture.live.herb')
const moisStem = dag.get('site.moisture.live.stem')
const moisLive = dag.get('site.moisture.live.category')

const catalogKey = dag.get('surface.primary.fuel.model.catalogKey')

test('1: Fuel moisture configuration', () => {
  dag.runConfigs([
    ['configure.fuel.moisture', ['individual', 'liveCategory', 'category', 'catalog'][0]]
  ])
  expect(moisCfg.value).toEqual('individual')

  dag.runSelected([
    [moisTl1h, true],
    [moisTl10h, true],
    [moisTl100h, true],
    [moisHerb, true],
    [moisStem, true],
    [d1Mois, true],
    [l1Mois, true]
  ])

  dag.runInputs([
    [moisTl1h, 0.05],
    [moisTl10h, 0.07],
    [moisTl100h, 0.09],
    [moisHerb, 0.5],
    [moisStem, 1.5],
    [d1Mois, 0.05],
    [l1Mois, 0.5]
  ])

  expect(moisCfg.value).toEqual('individual') // '\nMoisture config is \'individual\'')
  let inputNodes = dag.requiredInputNodes()
  expect(inputNodes.length).toEqual(6)
  expect(inputNodes).toContain(catalogKey)
  expect(inputNodes).toContain(moisTl1h)
  expect(inputNodes).toContain(moisTl10h)
  expect(inputNodes).toContain(moisTl100h)
  expect(inputNodes).toContain(moisHerb)
  expect(inputNodes).toContain(moisStem)
  expect(inputNodes).not.toContain(moisDead)
  expect(inputNodes).not.toContain(moisLive)
  expect(moisTl1h.value).toEqual(0.05)
  expect(moisTl10h.value).toEqual(0.07)
  expect(moisTl100h.value).toEqual(0.09)
  expect(moisDead.value).toEqual(1) // not yet selected or required, so default value
  expect(moisHerb.value).toEqual(0.5)
  expect(moisStem.value).toEqual(1.5)
  expect(moisLive.value).toEqual(1) // not yet selected or required, so default value
  expect(d1Mois.value).toEqual(0.05)
  expect(l1Mois.value).toEqual(0.5)

  dag.runConfigs([[moisCfg, 'category']])
  expect(moisCfg.value).toEqual('category')
  inputNodes = dag.requiredInputNodes()
  expect(inputNodes.length).toEqual(3)
  expect(inputNodes).toContain(catalogKey)
  expect(inputNodes).not.toContain(moisTl1h)
  expect(inputNodes).not.toContain(moisTl10h)
  expect(inputNodes).not.toContain(moisTl100h)
  expect(inputNodes).not.toContain(moisHerb)
  expect(inputNodes).not.toContain(moisStem)
  expect(inputNodes).toContain(moisDead)
  expect(inputNodes).toContain(moisLive)
  dag.runInputs([
    [moisDead, 0.06],
    [moisLive, 2]
  ])
  expect(moisTl1h.value).toEqual(0.06)
  expect(moisTl10h.value).toEqual(0.06)
  expect(moisTl100h.value).toEqual(0.06)
  expect(moisDead.value).toEqual(0.06)
  expect(moisHerb.value).toEqual(2)
  expect(moisStem.value).toEqual(2)
  expect(moisLive.value).toEqual(2)
  expect(d1Mois.value).toEqual(0.06)
  expect(l1Mois.value).toEqual(2)

  dag.runConfigs([[moisCfg, 'liveCategory']])
  expect(moisCfg.value).toEqual('liveCategory')
  inputNodes = dag.requiredInputNodes()
  expect(inputNodes.length).toEqual(5)
  expect(inputNodes).toContain(catalogKey)
  expect(inputNodes).toContain(moisTl1h)
  expect(inputNodes).toContain(moisTl10h)
  expect(inputNodes).toContain(moisTl100h)
  expect(inputNodes).not.toContain(moisHerb)
  expect(inputNodes).not.toContain(moisStem)
  expect(inputNodes).not.toContain(moisDead)
  expect(inputNodes).toContain(moisLive)
  expect(moisTl1h.value).toEqual(0.05)
  expect(moisTl10h.value).toEqual(0.07)
  expect(moisTl100h.value).toEqual(0.09)
  expect(moisDead.value).toEqual(0.06)
  expect(moisHerb.value).toEqual(2)
  expect(moisStem.value).toEqual(2)
  expect(moisLive.value).toEqual(2)
  expect(d1Mois.value).toEqual(0.05)
  expect(l1Mois.value).toEqual(2)
})
