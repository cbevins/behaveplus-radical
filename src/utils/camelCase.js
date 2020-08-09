import { nodeLabel } from '../../dist/bundle.esm.js'

const examples = [
  'MyCamelCaseString',
  'myCamelCaseString',
  'surface.primary.fuel.model.behave.dead.tl1h.load',
  'classID',
  'classId',
  'moisture100H'
]

examples.forEach(str => console.log(`'${str}' => '${nodeLabel(str)}'`))
