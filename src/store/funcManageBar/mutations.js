import { addThisNode, findNode, removeNode } from 'src/store/funcManageBar/common'

export const addNode = (state, newStateParam) => {
  const node = newStateParam.nodeData.node
  const parent = newStateParam.nodeData.parent
  return addThisNode(state.funcTree, parent, node)
}

export const updateNode = (state, param) => {
  // value, name, isLeaf, parentValue, newParentValue = param.value, param.name,
  const nodeRes = findNode(state.funcTree, param.value)
  if (!nodeRes.ok) {
    return
  }
  const node = nodeRes.getNode
  node.update(param.name, param.isLeaf, node.children)
  if (param.parentValue !== param.newParentValue) {
    removeNode(state.funcTree, param.parentValue, node)
    addThisNode(state.funcTree, param.newParentValue, node)
  }
  // const parentNode = findNode(state.funcTree, parentValue)
}

export const delNode = (state, param) => {
  // value, name, isLeaf, parentValue, newParentValue = param.value, param.name,
  const nodeRes = findNode(state.funcTree, param.value)
  if (!nodeRes.ok) {
    return
  }
  const node = nodeRes.getNode
  removeNode(state.funcTree, param.parentValue, node)
}

export const InitTree = (state, param) => {
  // value, name, isLeaf, parentValue, newParentValue = param.value, param.name,
  state.funcTree = param.tree
}
