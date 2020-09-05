// import something here
import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/index.css'

// "async" is optional;
// more info on params: https://quasar.dev/quasar-cli/cli-documentation/boot-files#Anatomy-of-a-boot-file
export default async ({ app, router, Vue }) => {
  Vue.use(VXETable)
}
