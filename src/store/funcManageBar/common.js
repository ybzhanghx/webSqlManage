
class FuncTreeNode {
  constructor (value = '', name = '', isLeaf = false) {
    this.value = value
    this.name = name
    this.isLeaf = isLeaf
    this.children = []
    this.childs = 0
  }

  setChildren (child) {
    this.children = child
    this.childs = child.length
  }
}
export { FuncTreeNode }

export function findNode (tree, nodeValue) {
  if (tree.value === nodeValue) {
    return {
      getNode: tree,
      ok: true
    }
  } else {
    if (tree.childs === 0) {
      return { ok: false }
    }
    for (const child of tree.children) {
      const tmp = findNode(child, nodeValue)
      if (tmp.ok) {
        return tmp
      }
    }
    return { ok: false }
  }
}
