// @ts-nocheck

// @ts-ignore
function parseNode(nodeEl) {
  let resultString = ``
  const propStringArray = []
  const props = nodeEl?.props || {}
  const propKeys = Object.keys(props)
  for (let index = 0; index < propKeys.length; index++) {
    const key = propKeys[index]
    const val = props[key]
    if (typeof val === 'object') {
      const type = val.type
      const nodeValue = val.nodeValue
      propStringArray.push(
        `${key}=${type === '#jsx' ? '{' + nodeValue + '}' : nodeValue}`,
      )
    } else if (typeof val === 'string') {
      propStringArray.push(`${key}="${val}"`)
    } else if (typeof val === 'number') {
      propStringArray.push(`${key}={${val}}`)
    } else if (typeof val === 'boolean') {
      propStringArray.push(`${key}={${val}}`)
    } else {
      propStringArray.push(`${key}=${val}`)
    }
  }

  const childrenStr = (nodeEl?.children || [])
    .map((child) => {
      return parseNode(child)
    })
    .join('\n')

  if (nodeEl?.type === '#text') {
    return `${nodeEl?.nodeValue}`
  } else {
    resultString = `<${nodeEl?.type} ${propStringArray.join(
      ' ',
    )}>${childrenStr}</${nodeEl?.type}>`

    return resultString
  }
}

export function deparse(str: string) {
  let resultString = ``
  try {
    const parsed = JSON.parse(str)
    resultString = parseNode(parsed)
  } catch (error) {
    console.error(error)
  }

  return resultString
}
