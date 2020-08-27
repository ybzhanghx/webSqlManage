
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

  update (name, isLeaf, children) {
    this.name = name
    this.isLeaf = isLeaf
    this.children = children
    this.childs = children.length
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

export function removeNode (tree, parentValue, node) {
  const parentRes = findNode(tree, parentValue)
  if (!parentRes.ok) {
    return {
      ok: false
    }
  }
  const parent = parentRes.getNode
  if (parent.childs < 0) {
    return { ok: false }
  }
  parent.children = parent.children.filter(item => { return item.value !== node.value })
  parent.childs = parent.children.length
}

export function addThisNode (root, parent, node) {
  const ParentNode = findNode(root, parent)
  if (!ParentNode.ok) {
    return {
      ok: false,
      msg: 'parent not find'
    }
  }
  let hadExist = false
  for (const value of ParentNode.getNode.children) {
    if (value.value === node.value) {
      hadExist = true
    }
  }
  if (hadExist) {
    return {
      ok: false,
      msg: 'had been add'
    }
  }
  ParentNode.getNode.children.push(node)
  ParentNode.getNode.childs++

  return {
    ok: true,
    msg: 'success add'
  }
}
