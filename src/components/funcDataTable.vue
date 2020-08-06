<template>
    <div>
      <grid-manager :option="gridOption" ref="grid"></grid-manager>
    </div>
</template>

<script>
import GridManager from 'gridmanager-vue'
import 'gridmanager-vue/css/gm-vue.css'
export default {

  data () {
    return {
      gridOption: {
        // 表格唯一標識
        gridManagerName: 'test-gm',

        // 高度
        height: '300px',

        // 首次是否載入
        firstLoading: false,

        // 列配置
        columnData: [
          {
            key: 'shopId',
            width: '180px',
            text: '店鋪id',
            align: 'center'
          }
        ],
        ajaxData: (settings, params) => {
        }
        // ...更多配置請參考API
      }

    }
  },
  components: {
    GridManager
  },
  name: 'funcDataTable'

}
</script>

<style scoped>

</style>
