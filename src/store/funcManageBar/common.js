
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
