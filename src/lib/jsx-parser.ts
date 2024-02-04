import * as parser from '@babel/parser'
import traverse from '@babel/traverse'
import { File, JSXElement } from '@babel/types'

interface Style {
  [key: string]: string | number
}
interface JsonNode {
  type: string
  props: {
    style?: Style
    src?: string
    children?: Array<string | JsonNode> | JsonNode | string
  }
}
function transformNode(node: JSXElement): JsonNode | null {
  if (!('name' in node.openingElement.name)) return null

  const jsonNode: JsonNode = {
    type: node.openingElement.name.name as string,
    props: {},
  }

  node.openingElement.attributes.forEach((attr) => {
    if (
      attr.type === 'JSXAttribute' &&
      attr.value?.type === 'JSXExpressionContainer' &&
      attr.name.name === 'style'
    ) {
      const styleObject: Style = {}
      if ('properties' in attr.value.expression) {
        attr.value.expression.properties.forEach((prop) => {
          // @ts-expect-error
          const key: string = prop.key.name ?? ''
          const value: string | number =
            // @ts-expect-error
            prop.value?.expression?.value ??
            // @ts-expect-error
            prop.value?.value ??
            // @ts-expect-error
            prop.value?.quasis[0].value.raw
          styleObject[key] = value
        })
        jsonNode.props.style = styleObject
      }
    }

    if (attr.type === 'JSXAttribute' && attr.name.name === 'src') {
      // @ts-expect-error
      jsonNode.props.src = attr.value?.value
    }
  })

  if (node.children.length === 0) {
    // no-op
  } else if (node.children.length === 1) {
    if (node.children[0].type === 'JSXText') {
      jsonNode.props.children = node.children[0].value.trim()
    } else if (node.children[0].type === 'JSXElement') {
      const childNode = transformNode(node.children[0] as JSXElement)
      if (childNode) {
        jsonNode.props.children = childNode
      }
    }
  } else {
    jsonNode.props.children = []

    node.children.forEach((child) => {
      if (child.type === 'JSXText') {
        const textValue: string = child.value.trim()
        if (textValue) {
          ;(jsonNode.props.children as Array<unknown>).push(textValue)
        }
      } else if (child.type === 'JSXElement') {
        const node = transformNode(child)

        if (node) {
          ;(jsonNode.props.children as Array<unknown>).push(node)
        }
      }
    })
  }

  return jsonNode
}

function transformAstToJson(ast: parser.ParseResult<File>) {
  let json: JsonNode | null = null
  let rootNodeDone = false

  traverse(ast, {
    JSXElement(path) {
      if (!rootNodeDone) {
        // Only process the root JSX element
        json = transformNode(path.node)
        path.stop() // Stop traversal as we only care about the root node
        rootNodeDone = true
      }
    },
  })

  return json
}

export const jsxToJson = (jsx: string) => {
  // Parse the JSX into an AST
  const ast = parser.parse(jsx, {
    sourceType: 'module',
    plugins: ['jsx'],
  })

  return transformAstToJson(ast)
}

export const jsonToJsx = (json?: JsonNode) => {
  if (!json) return ''

  // Convert style object to JSX style string
  const styleToString = (style: { [key: string]: string | number }): string => {
    return Object.entries(style)
      .map(
        ([key, value]) =>
          `${key}: ${typeof value === 'string' ? `"${value}"` : value}`,
      )
      .join(',')
  }

  const processNode = (node: JsonNode | string): string => {
    if (typeof node === 'string') {
      return node
    }

    const { type, props } = node
    const { children } = props
    const propsString = props
      ? Object.entries(props)
          .map(([key, value]) => {
            if (key === 'style') {
              return `style={{${styleToString(
                value as { [key: string]: string | number },
              )}}}`
            } else if (key === 'children') {
              return '' // Children are handled separately
            } else {
              return `${key}="${value}"`
            }
          })
          .filter(Boolean)
          .join(' ')
      : ''

    const childrenString = children
      ? Array.isArray(children)
        ? children.map(processNode).join('')
        : typeof children === 'string'
          ? children
          : processNode(children)
      : ''

    return `<${type} ${propsString}>${childrenString}</${type}>`
  }

  return processNode(json)
}
