import { findNode } from 'src/store/funcManageBar/common'
export const getState = state => {
  return state.funcTree
}

function findLeaf (node) {
  if (node.isLeaf) { return [node] }
  if (node.children.length === 0) { return [] }
  const tmp = []
  node.children.forEach((item, index, arr) => {
    tmp.push(...findLeaf(item))
  }
  )
  return tmp
}
export const getAllLeaf = state => {
  return findLeaf(state.funcTree)
}

export const getNameByValue = (state) => (value) => {
  return findNode(state.funcTree, value)
}

export const getAllLeafName = (state) => () => {
  return findLeaf(state.funcTree).map(item => { return item.name })
}

export const getEmpty = (state) => () => {
  return state.funcTree.children.length === 0
}
