import { Alias, Model } from '../bundle/behaveplus/equations/FuelCatalogData.js'
import * as fs from 'fs'

let str = '  let fuels = [\n'
Array.from(Alias).forEach(alias => {
  const key = alias[0]
  const f = Model.get(alias[1])
  str += `    { key: '${key}', text: '${key}: ${f.label}'},\n`
})
str += '  ]\n'
fs.writeFile('fuelsList.js', str, function (err) {
  if (err) throw err
  console.log(`Wrote file 'fuelsList.js'`)
})
