<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> {{ tableName}}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container" >
      <div  v-if="isLoadGrid">
        <GridManager :option="gridOption" ref="tableGrid"></GridManager>
      </div>
    </div>
  </div>
</template>

<script>
// import {fetchData} from '../../api/index';
import GridManager from 'gridmanager-vue'
import 'gridmanager-vue/css/gm-vue.css'
import { getTableConfig, getTableDataList } from '../api/api'

export default {
  data () {
    return {
      tableName: '表管理',
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
      isLoadGrid: false,
      gridOption: {},
      parentFuncList: []
    }
  },
  components: {
    GridManager
  },
  created () {
    var tmpThis = this
    this.getColName().then(value => {
      tmpThis.gridOption = {
        gridManagerName: this.$route.path.slice(7),
        height: '100%',
        // firstLoading: true,
        pageSize: 10,
        columnData: value,
        supportAjaxPage: true,
        supportConfig: true,
        ajaxData: function (settings, params) {
          return tmpThis.newData(params.cPage, params.pSize)
          // return {
          //   totals: 0,
          //   data: []
          // }
        }
      }
      tmpThis.isLoadGrid = true
    })
  },
  methods: {
    async getColName () {
      const routePath = this.$route.path.slice(7)
      const res = await getTableConfig({ funcName: routePath })
      console.log('ok')
      console.log(res)
      if (res.Code !== 0) {
        this.$message.error('table load error !')
      }
      const tmpName = res.Data.map(item => {
        return item.field_name
      })
      // this.gridOption.columnData =
      return tmpName.map(
        element => {
          return {
            key: element,
            text: element
          }
        }
      )
    },
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
      console.log(page_)
      const paramData = {
        page: page_,
        size: size_,
        funcName: this.$route.path.slice(1)
      }
      var tmp = {}
      await getTableDataList(paramData).then(
        (responseData) => {
          const getData = responseData
          if (getData.Code !== 0) {
            return
          }
          // const userList = getData.Data
          // const funcValidStr = (obj) => { return obj.valid ? obj.String : '' }
          // const funcValidTime = (obj) => { return obj.valid ? obj.Time : '' }
          // tmp.data = userList.map(
          //   ele => {
          //     ele.ClientType = funcValidStr(ele.ClientType)
          //     ele.DateJoined = funcValidTime(ele.DateJoined)
          //     ele.Email = funcValidStr(ele.Email)
          //     ele.LastLogin = funcValidTime(ele.LastLogin)
          //     ele.Phone = funcValidStr(ele.Phone)
          //     ele.Remark = funcValidStr(ele.Remark)
          //     ele.Username = funcValidStr(ele.Username)
          //     ele.UserNick = funcValidStr(ele.UserNick)
          //     return ele
          //   }
          // )
          tmp.data = getData.Data
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
  },
  watch: {
    async $route (to, from) {
      this.isLoadGrid = false
      const value = await this.getColName()
      console.log('had been')
      this.gridOption.gridManagerName = to.path.slice(7)
      this.gridOption.columnData = value
      this.isLoadGrid = true
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
