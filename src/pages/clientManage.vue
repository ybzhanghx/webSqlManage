<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 客户管理
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div>
        <GridManager :option="gridOption" ref="clientGrid" ></GridManager>
      </div>
    </div>
  </div>
</template>

<script>
// import {fetchData} from '../../api/index';
import bus from '../components/common/bus'
import GridManager from 'gridmanager-vue'
import 'gridmanager-vue/css/gm-vue.css'
// eslint-disable-next-line no-unused-vars
// import ajax from '../boot/axios'
// eslint-disable-next-line no-undef
// console.log($i18n)

export default {
  data () {
    return {
      tableData: {
        data: [],
        totals: 0
      },
      defaultColName: ['Userid', 'UserNick', 'Username', 'IsActive', 'ClientType', 'CountryCode', 'DataJoined', 'Email',
        'IsDelete', 'LastLogin', 'Phone', 'Remark', 'ThirdParty', 'Authority'],
      selectValue: {},
      selectParentValue: {},
      addVisible: false,
      editVisible: false,
      funcList: [{
        value: 'clientManage',
        label: this.$t('clientManage')
      }],
      gridOption: {},
      parentFuncList: []
    }
  },
  components: {
    GridManager
  },
  created () {
    var tmpp = this
    this.gridOption = {
      // 表格唯一標識
      gridManagerName: 'client-Table',
      height: '100%',
      firstLoading: true,
      // 列配置
      pageSize: 10,
      columnData: this.ParseColData(),
      supportAjaxPage: true,
      ajaxData: function (settings, params) {
        return tmpp.newData2(params.cPage, params.pSize)
      }
      // ...更多配置請參考API
    }
  },
  methods: {
    ParseColData () {
      return this.defaultColName.map(
        element => {
          return {
            key: element,
            text: element
          }
        }
      )
    },
    newData () {
      var tmp = { data: [], totals: 0 }
      this.newData2().then(function (result) {
        console.log(result)
        tmp = result
      })
      return tmp
    },
    async newData2 (page, size) {
      var tmp = {}
      var baseUrl = 'http://localhost:8095/manage/user/list'

      baseUrl += '?page=' + page + '&size=' + size
      console.log(baseUrl)
      await this.$axios.get(baseUrl).then(
        (response) => {
          const getData = response.data
          if (getData.Code !== 0) {
            return
          }
          console.log(getData)
          const userList = getData.User
          // tmp.data = userList
          const funcValidStr = (obj) => { return obj.valid ? obj.String : '' }
          const funcValidTime = (obj) => { return obj.valid ? obj.Time : '' }
          tmp.data = userList.map(
            ele => {
              ele.ClientType = funcValidStr(ele.ClientType)
              ele.DateJoined = funcValidTime(ele.DateJoined)
              ele.Email = funcValidStr(ele.Email)
              ele.LastLogin = funcValidTime(ele.LastLogin)
              ele.Phone = funcValidStr(ele.Phone)
              ele.Remark = funcValidStr(ele.Remark)
              ele.Username = funcValidStr(ele.Username)
              ele.UserNick = funcValidStr(ele.UserNick)
              return ele
            }
          )
          tmp.totals = 100
        }
      )

      return tmp
      // ajax.get('/timeserver?timeZone=8')
      //   .then((response) => {
      //     // let data = response.data
      //     console.log(response.data)
      //   })
      //
    },
    updateRow (row) {
      console.log('555')
    },
    // 获取 easy-mock 的模拟数据
    addDialog () {
      this.addVisible = true
      // bus.$emit('funAdd', 'testFiled', 'root')
    },
    addFun () {
      this.tableData.data.push({
        funcName: this.selectValue.label,
        parentName: this.selectParentValue.label
      })
      this.tableData.totals++
      this.addVisible = false
      GridManager.refreshGrid(this.gridOption.gridManagerName)
      bus.$emit('funAdd', this.selectValue.value, this.selectParentValue.value, this.selectValue.label)
    }

    // 以下方法是必需的
    // (不要改变它的名称 --> "hide")
    // hide () {
    //   this.$refs.dialog.show()
    // },
    //
    // onDialogHide () {
    //   // QDialog发出“hide”事件时
    //   // 需要发出
    //   this.$emit('hide')
    // },
    //
    // onOKClick () {
    //   // 按OK，在隐藏QDialog之前
    //   // 发出“ok”事件（带有可选的有效负载）
    //   // 是必需的
    //   this.$emit('ok')
    //   // 或带有有效负载：this.$emit('ok', { ... })
    //
    //   // 然后隐藏对话框
    //   this.show()
    // },
    //
    // onCancelClick () {
    //   // 我们只需要隐藏对话框
    //   this.hide()
    // }
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
