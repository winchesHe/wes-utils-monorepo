export function getWindow(node: any): typeof window {
  return node?.ownerDocument?.defaultView || window
}

export function isNode(value: unknown): value is Node {
  return value instanceof Node || value instanceof getWindow(value).Node
}

export function getDocumentElement(node: Node | Window): HTMLElement {
  return ((isNode(node) ? node.ownerDocument : node?.document) || window.document)?.documentElement
}
