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
