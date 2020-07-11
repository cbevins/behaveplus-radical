module.exports = {
  env: {
    browser: true,
    es2020: true,
    es6: true,
    node: true
  },
  extends: [
    'plugin:jest/recommended',
    'standard'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module'
  },
  plugins: ['jest'],
  rules: {
  }
}
