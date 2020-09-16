// import something here

// "async" is optional;
// more info on params: https://quasar.dev/quasar-cli/cli-documentation/boot-files#Anatomy-of-a-boot-file
import { getFuncList } from 'src/api/api'
import { FuncTreeNode } from 'src/store/funcManageBar/common'

async function setFuncList (vue, store) {
  try {
    const res = await getFuncList()
    if (res.Code !== 0) {
      vue.$message.error('not get')
    }
    console.log(res)
    const funcTree = new FuncTreeNode('/', '/', false)
    const FirstLevel = res.Data.Children.map(firstItem => {
      const FirstRes = new FuncTreeNode(firstItem.Value, firstItem.Name, false)

      const secondLevels = firstItem.Children.map(secondItem => {
        return new FuncTreeNode(secondItem.Value, secondItem.Name, true)
      })
      FirstRes.setChildren(secondLevels)
      return FirstRes
    })
    funcTree.setChildren(FirstLevel)
    store.commit({
      type: 'InitTree',
      tree: funcTree
    })
  } catch (e) {
    vue.$message.error('not get')
  }
}
export default ({ router, store, Vue }) => {
  router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title} | vue-manage-system`
    const role = localStorage.getItem('ms_username')
    const trees = store.getters.getEmpty()
    if (trees) {
      console.log(trees)
      setFuncList(Vue, store)
    }
    if (!role && to.path !== '/login') {
      next('/login')
    } else if (to.meta.permission) {
      // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
      role === 'admin' ? next() : next('/403')
    } else {
      // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
      next()
    }
  })
}
