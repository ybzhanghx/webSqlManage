
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
