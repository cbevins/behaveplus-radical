
export function name (parent, ...self) {
  return [...parent, ...self]
}

// bind(), call(), input(), set() are all actions
export class ActionSpec extends Array {}

export class BindSpec extends ActionSpec {}

export function bind (...args) { return new BindSpec(args) }

export class CallSpec extends ActionSpec {}

export function call (...args) { return new CallSpec(args) }

export class ConfigSpec extends Array {}

export function config (...args) { return new ConfigSpec(args) }

export class InputSpec extends ActionSpec {}

export function input (...args) { return new InputSpec(args) }

export class ItemSpec extends Array {}

export function item (node, variant, ...configs) {
  return new ItemSpec(node, variant, ...configs)
}

export class MethodSpec extends Array {}

export function method (...parts) { return new MethodSpec(...parts) }

export class NodeSpec extends Array {
  constructor (parent, ...self) {
    super(...parent, ...self)
  }
}

export function node (parent, ...self) { return new NodeSpec(parent, ...self) }

export class SetSpec extends ActionSpec {}

export function set (...args) { return new SetSpec(args) }

export class VariantSpec extends Array {}

export function variant (...parts) { return new VariantSpec(...parts) }

export class WhenSpec extends Array {}

export function when (...args) { return new WhenSpec(args) }
