export default async function setroute () {
  // const res = await getTableNames({ db: 'TradeFxDB' })
  // const tmpChildren = res.Data.map(item => {
  //   return {
  //     path: '/table/:tableName' + item,
  //     component: () => import('pages/tableManage'),
  //     meta: { title: item }
  //   }
  // })
  const routes = [
    {
      path: '/',
      redirect: '/funManage'
    },

    {
      path: '/',
      component: () => import('../components/Home'),
      children: [
        {
          path: '/funManage',
          component: () => import('pages/funManage'),
          meta: { title: '功能管理', name: 'funManage' }
        },
        {
          path: '/test',
          component: () => import('pages/tableManage'),
          meta: { title: '测试' }
        },
        {
          path: '/table/:name',
          component: () => import('pages/tableManage2'),
          meta: { title: '数据管理' },
          props: { subtitle: ' ' }
        },
        {
          path: '/empty/:name',
          component: () => import('pages/empty.vue')
        }
      ]
    },
    {
      path: '/login',
      component: () => import('pages/Login'),
      // component: () => import('layouts/MainLayout.vue'),
      meta: { title: '登录' }
    },
    // component: () => import('layouts/MainLayout.vue'),
    // children: [
    //   { path: '', component: () => import('pages/Index.vue') }

    // Always leave this as last one,
    // but you can also remove it
    {
      path: '*',
      component: () => import('pages/Error404.vue')
    }]
  console.log(routes)
  return routes
}

// getTableNames('TradeFxDB').then(res => {
//   tmpChildren = res.Data.map(item => {
//     return {
//       path: '/' + item,
//       component: () => import('pages/tableManage'),
//       meta: { title: item }
//     }
//   })
//
// })
