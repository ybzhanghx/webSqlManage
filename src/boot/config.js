// import Vue from 'vue'
//
// import ElementUI from 'element-ui'
// import VueI18n from 'vue-i18n'
// import { messages } from '../components/common/i18n'
// import 'element-ui/lib/theme-chalk/index.css' // 默认主题
// // import './assets/css/theme-green/index.css'; // 浅绿色主题
//
// import '../assets/css/icon.css'
// // import './components/common/directives';
// import 'babel-polyfill'
//
// Vue.config.productionTip = false
// Vue.use(ElementUI)
//
// Vue.use(VueI18n)
// const i18n = new VueI18n({
//   locale: 'zh',
//   messages
// })
// console.log(i18n)
// 使用钩子函数对路由进行权限跳转

// 导入外部包
import VueI18n from 'vue-i18n'

// 包含语言包的/src/i18n中一个文件

import messages from 'src/i18n'

// 告诉Vue使用我们的Vue包:

export default ({ app, Vue }) => {
  // 在应用中设置i18n实例;
  // 我们通过这样做将它注入到根组件;
  // new Vue({..., i18n: ... }).$mount(...)
  Vue.use(VueI18n)
  app.i18n = new VueI18n({
    locale: 'zh-hans',
    fallbackLocale: 'zh-hans',
    messages
  })
}

// "async" is optional;
// more info on params: https://quasar.dev/quasar-cli/cli-documentation/boot-files#Anatomy-of-a-boot-file
// export default async (/* { app, router, Vue ... } */) => {
//   // something to do
//
// }
