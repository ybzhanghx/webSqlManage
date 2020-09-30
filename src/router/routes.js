export default async function setroute () {
  const routes = [
    {
      path: '/login',
      component: () => import('pages/Login'),
      // component: () => import('layouts/MainLayout.vue'),
      meta: { title: '登录' }
    },
    {
      path: '/connect',
      component: () => import('pages/connect'),
      // component: () => import('layouts/MainLayout.vue'),
      meta: { title: '连接' }
    },
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
          path: '/table/:name',
          component: () => import('pages/tableManage'),
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
      path: '*',
      component: () => import('pages/Error404.vue')
    }]
  return routes
}
