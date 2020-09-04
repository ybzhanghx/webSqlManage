import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css' // 默认主题
// import './assets/css/theme-green/index.css'; // 浅绿色主题
import 'assets/css/icon.css'
import 'babel-polyfill'
// import 'default-passive-events'
// "async" is optional;
// more info on params: https://quasar.dev/quasar-cli/cli-documentation/boot-files#Anatomy-of-a-boot-file
export default async ({ app, router, store, Vue }) => {
  Vue.config.productionTip = false
  Vue.use(ElementUI, {
    size: 'small'
  })
}
