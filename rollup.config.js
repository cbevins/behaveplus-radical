// import analyze from 'rollup-plugin-analyzer'
import { terser } from 'rollup-plugin-terser'
import resolve from '@rollup/plugin-node-resolve'
import babel from 'rollup-plugin-babel'

const dist = 'dist'
const packageName = 'bundle'
const bundle = `${dist}/${packageName}`

// const production = !process.env.ROLLUP_WATCH

export default [
  {
    input: 'src/bundle/index.js',
    output: [
      {
        file: `${bundle}.esm.js`,
        format: 'esm',
        plugins: [analyze()]
      },
      {
        file: `${bundle}.esm.min.js`,
        format: 'esm',
        plugins: [terser()]
      },
      {
        file: `${bundle}.cjs.js`,
        format: 'cjs'
      },
      {
        file: `${bundle}.cjs.min.js`,
        format: 'cjs',
        plugins: [terser()]
      }
    ],
    plugins: [
      // analyze({ stdout: true }),
      resolve(),
      babel({
        exclude: 'node_modules/**'
      })
    ]
  }
]
