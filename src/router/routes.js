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
        meta: { title: '功能管理' }
      },
      {
        path: '/clientManage',
        component: () => import('pages/funManage'),
        meta: { title: '功能管理' }
      }
      // {
      //   path: '/funManage2',
      //   component: () => import('/pages/funManage'),
      //   meta: { title: '功能管理' }
      // },

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
  }
]

export default routes
