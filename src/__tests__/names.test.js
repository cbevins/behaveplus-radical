import {
  item, method, name, node, variant,
  ItemSpec, MethodSpec, NodeSpec, VariantSpec
}
  from '../genome2/specs.js'

test('1: name()', () => {
  expect(name(['a', 'b'], 'c', 'd')).toEqual(['a', 'b', 'c', 'd'])
})

test('2: node() and NodeSpec()', () => {
  const x = node(['surface', 'primary'], 'fuel', 'model')
  expect(x).toEqual(['surface', 'primary', 'fuel', 'model'])
  expect(x instanceof ItemSpec).toEqual(false)
  expect(x instanceof MethodSpec).toEqual(false)
  expect(x instanceof NodeSpec).toEqual(true)
  expect(x instanceof VariantSpec).toEqual(false)
})

test('3: variant() and VariantSpec()', () => {
  const x = variant('fuel', 'load')
  expect(x).toEqual(['fuel', 'load'])
  expect(x instanceof ItemSpec).toEqual(false)
  expect(x instanceof MethodSpec).toEqual(false)
  expect(x instanceof NodeSpec).toEqual(false)
  expect(x instanceof VariantSpec).toEqual(true)
})

test('4: method() and MethodSpec()', () => {
  const x = method('FuelCatalog', 'behave', 'dead', '1', 'load')
  expect(x).toEqual(['FuelCatalog', 'behave', 'dead', '1', 'load'])
  expect(x instanceof ItemSpec).toEqual(false)
  expect(x instanceof MethodSpec).toEqual(true)
  expect(x instanceof NodeSpec).toEqual(false)
  expect(x instanceof VariantSpec).toEqual(false)
})

test('5: item() and ItemSpec()', () => {
  const x = item(
    node(['surface', 'primary'], 'fuel', 'model'),
    variant('fuel', 'load'))
  expect(x).toEqual([['surface', 'primary', 'fuel', 'model'], ['fuel', 'load']])
  expect(x instanceof ItemSpec).toEqual(true)
  expect(x instanceof NodeSpec).toEqual(false)
  expect(x instanceof MethodSpec).toEqual(false)
  expect(x instanceof VariantSpec).toEqual(false)
})
