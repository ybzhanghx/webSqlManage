import { FuncTreeNode } from './common'
const funcTree = new FuncTreeNode('/', '/', false)
funcTree.setChildren([
  new FuncTreeNode('test', '测试页', false),
  new FuncTreeNode('clientManage', '客户端管理', false)]
)
export default {
  funcTree: funcTree
}
