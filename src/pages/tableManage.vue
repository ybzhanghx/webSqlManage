<template>
  <div>

    <div class="container" >
      <div  >
        <vxe-grid ref="xGrid" v-bind = "gridOptions" @toolbar-button-click="toolbarButtonClickEvent" >
        </vxe-grid>
      </div>
    </div>
  </div>
</template>

<script>
import 'gridmanager-vue/css/gm-vue.css'
import { getTableConfig, getTableDataList, UpdateTableData } from '../api/api'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)
export default {
  data () {
    return {
      gridOptions: {
        border: true, // 有边框
        resizable: true, // 可拖动列宽大小
        showHeaderOverflow: true,
        showOverflow: true, // 当内容过长时显示为省略号
        highlightHoverRow: true,
        keepSource: true,
        id: 'full_edit_1',
        rowId: 'id',
        // rowClassName: 'row-class-name',
        customConfig: {
          storage: true
        },

        sortConfig: {
          trigger: 'cell'
        },
        filterConfig: {
          remote: true
        },
        pagerConfig: {
          pageSize: 10,
          pageSizes: [5, 10, 15, 20, 50, 100, 200, 500, 1000]
        },

        toolbar: {
          buttons: [
            { code: 'insert_actived', name: '新增', icon: 'fa fa-plus' },
            // { code: 'delete', name: '直接删除', icon: 'fa fa-trash-o' },
            { code: 'mark_cancel', name: '删除/取消', icon: 'fas fa-trash-alt' },
            { code: 'restore', name: this.$t('restore'), icon: 'fa fa-undo' },
            { code: 'save', name: this.$t('save'), icon: 'far fa-save', status: 'success' }
          ],

          refresh: true,
          // import: true,
          // export: true,
          // print: true,
          zoom: true,
          custom: true
        },
        proxyConfig: {
          // seq: true, // 启用动态序号代理
          sort: true, // 启用排序代理
          filter: true, // 启用筛选代理
          // form: true, // 启用表单代理
          ajax: {
            // 任何支持 Promise API 的库都可以对接（fetch、jquery、axios、xe-ajax）
            query: ({ page, sort, filters, form }) => {
              // 处理排序条件
              return this.newData(page.currentPage, page.pageSize)
              // return XEAjax.get(`https://api.xuliangzhan.com:10443/api/pub/page/list/${page.pageSize}/${page.currentPage}`, queryParams)
            },
            delete: ({ body }) => {
              console.log(body)
            },
            save: ({ body }) => {
              return this.saveData(body)
            }
          }
        },
        checkboxConfig: {
          labelField: 'id',
          reserve: true,
          highlight: true,
          range: true
        },
        editRules: {
        },
        editConfig: {
          trigger: 'click',
          mode: 'row',
          showStatus: true
        }
      }
    }
  },
  created () {
    // this.$refs.xGrid.
    this.initInfo()
  },
  methods: {
    initInfo () {
      this.setColumns()
    },
    async setColumns () {
      const tmpArr = this.$route.path.slice(7).split('|')
      const res = await getTableConfig({ DB: tmpArr[0], TB: tmpArr[1] })
      if (res.Code !== 0) {
        this.$message.error('table load error !')
      }
      this.columnData = res.Data
      const colCfg = [
        {
          type: 'checkbox',
          field: 'id',
          title: 'id',
          width: 120
        }
      ]
      const ruleCfg = {}
      if (res.Data === null) {
        return
      }
      for (const node of res.Data) {
        if (node.field_name.toLowerCase() === 'id') { continue }
        const tmp = {
          editRender: { name: 'input' },
          field: node.field_name,
          title: node.field_name
        }
        if (node.data_type === 'datetime') {
          tmp.editRender.name = '$input'
          tmp.editRender.props = {
            type: 'datetime'
          }
        } else if (node.data_type.indexOf('int') > 0) {
          tmp.editRender.name = '$input'
          tmp.editRender.props = {
            type: 'number'
          }
        }

        colCfg.push(tmp)
        if (node.is_able_null === false && node.data_type !== 'datetime') {
          ruleCfg[node.field_name] = [{ required: true, message: this.$t("can't is null") }]
        }
      }
      this.gridOptions.columns = colCfg
      this.gridOptions.editRules = ruleCfg
    },
    async newData (page_, size_) {
      const tmpArr = this.$route.path.slice(7).split('|')
      const paramData = {
        page: page_,
        size: size_,
        DB: tmpArr[0],
        TB: tmpArr[1]
      }
      const tmp = {}
      const responseData = await getTableDataList(paramData)
      if (responseData.Code !== 0) {
        return
      }
      const getData = responseData.Data
      const parseTimeFunc = (obj) => {
        const tmpDate = dayjs.unix(obj)
        return tmpDate.tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss')
      }
      const funcValidStr = (obj) => { return obj.Valid ? obj.String : '' }
      const funcValidTime = (obj) => {
        return obj.Valid ? parseTimeFunc(obj.TimeStamp) : ''
      }
      const funcValidInt64 = (obj) => {
        return obj.Valid ? obj.Int64 : ''
      }
      tmp.result = getData.map(item => {
        for (const fieldItem of responseData.Fields) {
          if (fieldItem.AbleNull) {
            let parseFunc = (obj) => {}
            switch (fieldItem.TypeName) {
              case 'time': parseFunc = funcValidTime; break
              case 'string':parseFunc = funcValidStr; break
              case 'int':parseFunc = funcValidInt64; break
            }
            const tmpV = parseFunc(item[fieldItem.FieldName])
            item[fieldItem.FieldName] = tmpV
          } else {
            if (fieldItem.TypeName === 'time') {
              item[fieldItem.FieldName] = funcValidTime(item[fieldItem.FieldName])
            }
          }
        }
        return item
      }
      )
      tmp.page = {
        total: responseData.Totals,
        currentPage: page_,
        pageSize: size_
      }
      return tmp
    },
    async saveData (body) {
      const result = {
        insertRows: body.insertRecords.length
      }
      const tmpArr = this.$route.path.slice(7).split('|')
      const postData = {
        Add: this.saveAdd(body.insertRecords),
        Del: this.saveDel(body.pendingRecords),
        Upd: this.saveUpd(body.updateRecords),
        DB: tmpArr[0],
        TB: tmpArr[1]
      }
      var res = {}
      try {
        res = await UpdateTableData(postData)
      } catch (e) {
        console.log(e)
        return e
      }

      result.code = res.Code
      result.message = res.Msg
      if (res.Code !== 0) {
        throw result
      }
      // result.status = 200
      return result
    },
    saveAdd (data) {
      if (data.length === 0) {
        return ''
      }
      const resData = data.map(item => {
        item.id = 0
        for (const fieldItem of this.columnData) {
          if (fieldItem.data_type.indexOf('int') >= 0) {
            item[fieldItem.field_name] = parseInt(item[fieldItem.field_name])
          }
        }
        return item
      })
      return JSON.stringify(resData)
    },
    saveUpd (data) {
      if (data.length === 0) {
        return ''
      }

      const resData = data.map(item => {
        for (const fieldItem of this.columnData) {
          if (fieldItem.field_name === 'account_id') {

          }
          if (fieldItem.data_type.indexOf('int') >= 0 && fieldItem.data_type !== 'id') {
            item[fieldItem.field_name] = parseInt(item[fieldItem.field_name])
          }
        }
        return item
      })
      return JSON.stringify(resData)
    },
    saveDel (data) {
      if (data.length === 0) {
        return []
      }
      return data.map(v => {
        return v.id
      })
    },
    toolbarButtonClickEvent ({ code }) {
      if (code === 'restore') {
        this.$refs.xGrid.revertData()
      }
    }
  },
  beforeRouteUpdate (to, from, next) {
    const arrSta = this.$refs.xGrid.getRecordset()
    const funcIsEmpty = (v) => { if (v.length === 0) return true }
    if (funcIsEmpty(arrSta.insertRecords) && funcIsEmpty(arrSta.updateRecords) && funcIsEmpty(arrSta.removeRecords)) {
      next()
      return
    }

    this.$confirm('放弃当前未保存内容而关闭页面？', '未保存', {
      confirmButtonText: '离开',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      next()
    }).catch((v) => {
      next(false)
    })
  },
  watch: {
    $route (to, from) {
      this.initInfo()
      this.$refs.xGrid.commitProxy('query')
      // this.$refs.xGrid.refreshColumn()
    }
  }
}

</script>
<style scoped>

  .handle-box {
    margin-bottom: 20px;
  }
  .handle-select {
    width: 120px;
  }

  .handle-input {
    width: 300px;
    display: inline-block;
  }

  .table {
    width: 100%;
    /*height: 100%;*/
    /*font-size: 14px;*/
  }

  .red {
    color: #ff0000;
  }

  .mr10 {
    margin-right: 10px;
  }

  .table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
  }
</style>
