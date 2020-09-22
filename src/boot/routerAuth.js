
export default ({ router, store, Vue }) => {
  router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title} | vue-manage-system`
    const role = localStorage.getItem('ms_username')

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
