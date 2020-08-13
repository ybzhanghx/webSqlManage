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
import GridManager from 'gridmanager-vue'
import 'gridmanager-vue/css/gm-vue.css'
import { getTradeAccountData } from '../api/api'

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
      gridManagerName: 'client-Table',
      height: '100%',
      firstLoading: true,
      pageSize: 10,
      columnData: this.ParseColData(),
      supportAjaxPage: true,
      ajaxData: function (settings, params) {
        return tmpp.newData(params.cPage, params.pSize)
      }

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

    async newData (page_, size_) {
      const paramData = {
        page: page_,
        size: size_
      }
      var tmp = {}
      await getTradeAccountData(paramData).then(
        (response) => {
          const getData = response.data
          if (getData.Code !== 0) {
            return
          }
          const userList = getData.User
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
    },
    updateRow (row) {
      console.log('555')
    },

    addDialog () {
      this.addVisible = true
    },
    addFun () {
      this.tableData.data.push({
        funcName: this.selectValue.label,
        parentName: this.selectParentValue.label
      })
      this.tableData.totals++
      this.addVisible = false
      GridManager.refreshGrid(this.gridOption.gridManagerName)
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
