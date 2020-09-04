import { FuncTreeNode } from './common'
const funcTree = new FuncTreeNode('/', '/', false)

const node1 = new FuncTreeNode('test', '测试页', false)
node1.setChildren([
  new FuncTreeNode('zybtest|tableA', '测试zyb', true),
  new FuncTreeNode('TradeFxDB|trade_account', '用户账户', true)
])
funcTree.setChildren([
  node1,
  new FuncTreeNode('clientManage', '客户端管理', false)]
)
export default {
  funcTree: funcTree
}
