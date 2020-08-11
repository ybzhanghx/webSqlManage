// import something here
import ElementUI from 'element-ui'
// import VueI18n from 'vue-i18n'
// import { messages } from '../components/common/i18n'
import 'element-ui/lib/theme-chalk/index.css' // 默认主题
// import './assets/css/theme-green/index.css'; // 浅绿色主题

import 'assets/css/icon.css'
// import 'components/common/directives'
import 'babel-polyfill'

// "async" is optional;
// more info on params: https://quasar.dev/quasar-cli/cli-documentation/boot-files#Anatomy-of-a-boot-file
export default async ({ app, router, Vue }) => {
  Vue.config.productionTip = false
  Vue.use(ElementUI, {
    size: 'small'
  })
}
