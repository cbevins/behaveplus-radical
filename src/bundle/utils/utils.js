// Returns the Node key reformatted as a capitalized, space-separated label
export function nodeLabel (source) {
  const tokens = []
  let token = ''
  let type = ''
  for (let i = 0; i < source.length; i++) {
    const c = source[i]
    if (c === '.' || c === ' ' || c === '_' || c === '-') { // separator
      if (token.length) tokens.push(token)
      token = ''
      type = ''
    } else if (c >= '0' && c <= '9') {
      if (type === 'string') {
        if (token.length) tokens.push(token)
        token = ''
      }
      type = 'number'
      token += c
    } else if (c >= 'A' && c <= 'Z') {
      if (type === 'number' || token.length) { // previously in number or another string
        if (token.length) tokens.push(token) // store the previous number or string
        token = '' // start a new string
      }
      type = 'string'
      token += c
    } else if (c >= 'a' && c <= 'z') {
      if (type === 'number') {
        if (token.length) tokens.push(token)
        token = ''
      }
      type = 'string'
      token += token.length ? c : c.toUpperCase()
    }
  }
  if (token.length) tokens.push(token)
  return tokens.join(' ')
}
