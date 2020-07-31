import * as fs from 'fs'
import { Genome } from '../models/genome.js'
import * as Lib from '../equations/index.js'
import * as Variant from '../variants/index.js'
import { dict } from './dictionary.js'

/**
 * Generates a file that exports 6 array and 1 map:
 * - export literal = [<literalStringOrNumber>...] accessable by literal index
 * - export method = [<function>...] accessable by method index
 * - export variantClasses = [<Variant>...] accessable by variant index
 *
 * The following are all accessable by the Node index:
 * - export key = [<nodeKey>...]
 * - export updater = [[[<condition>,<methodArray>]...]
 * - export variant = [<variantClassesIndex>...]
 *
 * Node indices can be determine from a Node key via the map:
 * - export map = new Map([[nodeKey, nodeIndex],...])
 */
export class DnaCompiler {
  constructor (methodImport, variantImport, dictionary, annotate = true) {
    this.methodImport = methodImport
    this.variantImport = variantImport
    this.annotate = annotate
    this.reset()
    this.tokens = Object.entries(dictionary).sort((a, b) => {
      if (a[1].length < b[1].length) return 1
      if (a[1].length > b[1].length) return -1
      return 0
    })
  }

  compile (genomeArray) {
    this.reset()
    // Pass 1: Create this.nodeMap
    genomeArray.forEach((info, idx) => { this.nodeMap.set(info[0], idx) })

    // Pass 2: Validate genomeArray and create this.variantMap, this.methodMap, and this.literalMap
    genomeArray.forEach((nodeInfo, nodeIdx) => {
      const [nodeKey, otherInfo] = nodeInfo // Each Gene has a nodeKey and an info array
      const [variantInfo, updaterInfo] = otherInfo
      const vkey = variantInfo[0]
      this.ensureVariantExists(nodeKey, vkey)
      this.variantMap.set(vkey, 0)
      let finals = 0
      updaterInfo.forEach(updater => {
        const [condition, ...conditionArgs] = updater
        if (condition === 'when') {
          if (finals) { throw new Error(`Node ${nodeKey} has 'when' condition after 'finally'`) }
          const [configKey, op, value, methodKey, ...methodParms] = conditionArgs
          if (op !== 'equals') throw new Error(`'${nodeKey}' has config '${configKey}' with invalid op '${op}'`)
          // this.literalMap.set(op, 0)
          this.literalMap.set(value, 0)
          this.ensureMethodExists(nodeKey, methodKey)
          this.methodMap.set(methodKey, 0)
          methodParms.forEach(parm => { if (!this.nodeMap.has(parm)) { this.literalMap.set(parm, 0) } })
        } else if (condition === 'finally') {
          if (finals) { throw new Error(`Node ${nodeKey} has more than 1 'finally' condition`) }
          finals += 1
          const [methodKey, ...methodParms] = conditionArgs
          this.ensureMethodExists(nodeKey, methodKey)
          this.methodMap.set(methodKey, 0)
          methodParms.forEach(parm => { if (!this.nodeMap.has(parm)) { this.literalMap.set(parm, 0) } })
        } else {
          throw new Error(`Node '${nodeKey}' updater ${nodeIdx} has invalid condition '${condition}'`)
        }
      })
      if (!finals) { throw new Error(`Node ${nodeKey} has no 'finally' condition`) }
    })

    // Create this.literalArray and with this.literalMap its keyed index
    this.literalMap.forEach((value, key) => {
      this.literalMap.set(key, this.literalArray.length)
      this.literalArray.push(key)
    })
    // Create this.methodArray and with this.methodMap its keyed index
    this.methodMap.forEach((value, key) => {
      this.methodMap.set(key, this.methodArray.length)
      this.methodArray.push(key)
    })
    // Create this.variantArray and with this.variantMap its keyed index
    this.variantMap.forEach((value, key) => {
      this.variantMap.set(key, this.variantArray.length)
      this.variantArray.push(key)
    })

    // Pass 3: create this.nodeArray with all Genome node, variant, method, and literal keys
    // replaced with their respective array indices
    genomeArray.forEach(nodeInfo => {
      const [nodeKey, otherInfo] = nodeInfo // Each Gene has a nodeKey and an info array
      const [variantInfo, updaterInfo] = otherInfo
      const variantKey = variantInfo[0]
      const variantIdx = this.variantMap.get(variantKey)

      const updaters = []
      updaterInfo.forEach(option => {
        const [condition, ...conditionArgs] = option
        if (condition === 'when') {
          const [configKey, , value, methodKey, ...methodParms] = conditionArgs
          const config = [this.nodeMap.get(configKey), this.literalMap.get(value)]
          const method = [this.methodMap.get(methodKey)]
          methodParms.forEach(parm => {
            method.push(this.nodeMap.has(parm)
              ? [0, this.nodeMap.get(parm)] // Element 0 === 0 indicates a Node index
              : [1, this.literalMap.get(parm)]) // Element 0 === 1 indicates a literal index
          })
          updaters.push([config, method])
        } else if (condition === 'finally') {
          const [methodKey, ...methodParms] = conditionArgs
          const method = [this.methodMap.get(methodKey)]
          methodParms.forEach(parm => {
            method.push(this.nodeMap.has(parm)
              ? [0, this.nodeMap.get(parm)] // Element 0 === 0 indicates a Node index
              : [1, this.literalMap.get(parm)]) // Element 0 === 1 indicates a literal index
          })
          updaters.push([[], method])
        }
      })
      this.nodeArray.push([nodeKey, variantIdx, updaters])
    })
  }

  ensureMethodExists (nodeKey, methodKey) {
    const [file, func] = methodKey.split('.')
    if (file === 'Math') return
    if (typeof Lib[file] === 'undefined') {
      throw new Error(`Node '${nodeKey}' has unknown method library '${file}'`)
    }
    if (typeof Lib[file][func] === 'undefined') {
      console.log(Lib[file])
      throw new Error(`Node '${nodeKey}' has unknown method function '${file}.${func}'`)
    }
  }

  ensureVariantExists (nodeKey, vkey) {
    if (typeof Variant[vkey] === 'undefined') {
      throw new Error(`Node '${nodeKey}' has unknown Variant '${vkey}'`)
    }
  }

  reset () {
    this.literalArray = []
    this.literalMap = new Map()
    this.nodeArray = []
    this.nodeMap = new Map()
    this.methodArray = []
    this.methodMap = new Map()
    this.variantArray = []
    this.variantMap = new Map()
  }

  assemble () {
    return this.imports() +
      this.abbreviations() +
      this.literals() +
      this.methods() +
      this.variantClasses() +
      this.keys() + // map and key
      this.updaters() +
      this.variants()
  }

  note (str) {
    return this.annotate ? str : ''
  }

  abbreviations () {
    let str = this.note('// Node key segments\n')
    Object.keys(dict).forEach(key => {
      str += `const ${key} = '${dict[key]}'\n`
    })
    return str + '\n'
  }

  imports () {
    return '/* eslint-disable comma-spacing, indent, comma-dangle, quotes, no-unused-vars */\n' +
      'import * as Lib from \'./equations/index.js\'\n' +
      'import * as Variant from \'./variants/index.js\'\n\n'
  }

  literals () {
    let str = this.note('// Array of literals used by Node updater config conditions and method parameters\n')
    str += 'export const literal = [\n'
    this.literalArray.forEach((literal, idx) => {
      const sep = (typeof literal === 'string') ? "'" : ''
      str += `${sep}${literal}${sep},` + this.note(` // ${idx}`) + '\n'
    })
    return str + ']\n'
  }

  methods () {
    let str = this.note('// Map of Dag method references\n')
    str += 'export const dagMethod = new Map([\n' +
      "['bind', Lib.Dag.bind],\n" +
      "['config', Lib.Dag.config],\n" +
      "['dangler', Lib.Dag.dangler],\n" +
      "['fixed', Lib.Dag.fixed],\n" +
      "['input', Lib.Dag.input],\n" +
      "['link', Lib.Dag.link],\n" +
      "['module', Lib.Dag.module]\n" +
    '])\n'
    str += this.note('// Array of non-Dag Node updater method references\n')
    str += 'export const method = [\n'
    this.methodArray.forEach((method, idx) => {
      const [file, func] = method.split('.')
      const m = (file === 'Math') ? `Math.${func}` : `Lib.${file}.${func}`
      str += `${m},` + this.note(` // ${idx}`) + '\n'
    })
    return str + ']\n'
  }

  variantClasses () {
    let str = this.note('// Array of Node Variant class (constructor) references\n')
    str += 'export const variantClass = [\n'
    this.variantArray.forEach((vkey, idx) => {
      str += `Variant.${vkey},` + this.note(` // ${idx}`) + '\n'
    })
    return str + ']\n'
  }

  keys () {
    let str = this.note('// Map of Node keys => indices\n')
    str += 'export const map = new Map([\n'
    this.nodeArray.forEach((item, idx) => {
      let nodeKey = item[0]
      this.tokens.forEach(pair => {
        nodeKey = nodeKey.replace(pair[1], '${' + pair[0] + '}')
      })
      str += `[\`${nodeKey}\`, ${idx}],\n`
    })
    str += '])\n'
    str += this.note('// Array of Node keys\n')
    str += 'export const key = Array.from(map.keys())\n'
    return str
  }

  updaters () {
    let str = this.note('// Array of Node updater [[<condition>], [<method>, ...parms]]\n')
    str += 'export const updater = [\n'
    this.nodeArray.forEach((item, idx) => {
      str += JSON.stringify(item[2]) + ',' + this.note(` // ${idx}`) + '\n'
    })
    return str + ']\n'
  }

  variants () {
    let str = this.note('// Array of Node Variant class indices\n')
    str += 'export const variant = [\n'
    this.nodeArray.forEach((item, idx) => {
      str += `${item[1]},` + this.note(` // ${idx}`) + '\n'
    })
    str += ']\n'
    return str
  }

  writeFile (fileName, str) {
    fs.writeFile(fileName, str, function (err) {
      if (err) throw err
      console.log(`'Wrote Dna file '${fileName}'`)
    })
  }

  run (genomeArray, fileName) {
    this.compile(genomeArray)
    this.writeFile(fileName, this.assemble())
  }
}

const compiler = new DnaCompiler(Lib, Variant, dict, true)
compiler.run(Genome, './src/behaveplus/BpxDna.js')
