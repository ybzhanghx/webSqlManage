import Vue from 'vue'
import VueRouter from 'vue-router'

import routes from './routes'

import ElementUI from 'element-ui'
// import VueI18n from 'vue-i18n'
// import { messages } from '../components/common/i18n'
import 'element-ui/lib/theme-chalk/index.css' // 默认主题
// import './assets/css/theme-green/index.css'; // 浅绿色主题

import 'assets/css/icon.css'
// import 'components/common/directives'
import 'babel-polyfill'

Vue.config.productionTip = false
Vue.use(ElementUI, {
  size: 'small'
})

// Vue.use(VueI18n)
// const i18n = new VueI18n({
//   locale: 'zh',
//   messages
// })
// console.log(i18n)
// console.log('233')

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

// export default function (/* { store, ssrContext } */) {
const Router = new VueRouter({
  scrollBehavior: () => ({
    x: 0,
    y: 0
  }),
  routes,

  // Leave these as they are and change in quasar.conf.js instead!
  // quasar.conf.js -> build -> vueRouterMode
  // quasar.conf.js -> build -> publicPath
  mode: process.env.VUE_ROUTER_MODE,
  base: process.env.VUE_ROUTER_BASE
})

Router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} | vue-manage-system`
  const role = localStorage.getItem('ms_username')
  if (!role && to.path !== '/login') {
    next('/login')
  } else if (to.meta.permission) {
    // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
    role === 'admin' ? next() : next('/403')
  } else {
    // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
    if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
      Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
        confirmButtonText: '确定'
      })
    } else {
      next()
    }
  }
})
Vue.use(VueRouter)
// export default Router
// }
export default function (/* { store, ssrContext } */) {
  return Router
}
