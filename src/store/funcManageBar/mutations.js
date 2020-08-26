
export const update = (state, newStateParam) => {
  state.funcTree.child = newStateParam.newState
}

function findNode (tree, nodeValue) {
  if (tree.value === nodeValue) {
    return { getNode: tree, ok: true }
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

export const addNode = (state, newStateParam) => {
  console.log(newStateParam)
  const ParentNode = findNode(state.funcTree, newStateParam.nodeData.parent)
  console.log(ParentNode)
  if (!ParentNode.ok) {
    return { ok: false, msg: 'parent not find' }
  }
  let hadExist = false
  for (const value of ParentNode.getNode.children) {
    if (value.value === newStateParam.nodeData.node.value) {
      hadExist = true
    }
  }
  if (hadExist) {
    return { ok: false, msg: 'had been add' }
  }
  console.log(newStateParam)
  ParentNode.getNode.children.push(newStateParam.nodeData.node)
  ParentNode.getNode.childs++
  console.log(state.funcTree)
  return { ok: true, msg: 'success add' }
}
