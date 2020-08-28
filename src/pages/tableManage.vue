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
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
dayjs.extend(utc)
dayjs.extend(timezone)
// const dayjs =
// const utc = require('dayjs/plugin/utc') // dependent on utc plugin
// const timezone = require('dayjs/plugin/timezone')
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
        pageSize: 3,
        columnData: value,
        supportAjaxPage: true,
        supportConfig: true,
        ajaxData: function (settings, params) {
          return tmpThis.newData(params.cPage, params.pSize)
        }
      }
      tmpThis.isLoadGrid = true
    })
  },
  methods: {
    async getColName () {
      console.log(this.$route.path)
      const tmpArr = this.$route.path.slice(7).split('|')
      console.log(tmpArr)
      const res = await getTableConfig({ DB: tmpArr[0], TB: tmpArr[1] })
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
      const tmpArr = this.$route.path.slice(7).split('|')
      const paramData = {
        page: page_,
        size: size_,
        DB: tmpArr[0],
        TB: tmpArr[1]
      }
      var tmp = {}
      await getTableDataList(paramData).then(
        (responseData) => {
          if (responseData.Code !== 0) {
            return
          }
          const getData = responseData.Data
          const parseTimeFunc = (obj) => {
            const tmpDate = dayjs.unix(obj)
            const tmp = tmpDate.tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss')
            console.log(tmp)
            return tmp
          }
          const funcValidStr = (obj) => { return obj.Valid ? obj.String : '' }
          const funcValidTime = (obj) => {
            return obj.Valid ? parseTimeFunc(obj.TimeStamp) : ''
          }
          tmp.data = getData.map(item => {
            for (const fieldItem of responseData.Fields) {
              if (fieldItem.AbleNull) {
                let parseFunc = (obj) => {}
                switch (fieldItem.TypeName) {
                  case 'time': parseFunc = funcValidTime; break
                  case 'string':parseFunc = funcValidStr; break
                }
                const tmpV = parseFunc(item[fieldItem.FieldName])
                console.log(tmpV)
                item[fieldItem.FieldName] = tmpV
                console.log(item[fieldItem.FieldName])
              } else {
                if (fieldItem.TypeName === 'time') {
                  item[fieldItem.FieldName] = funcValidTime(item[fieldItem.FieldName])
                }
              }
            }
            console.log(item)
            return item
          }
          )
          tmp.totals = responseData.Totals
          // tmp.totals = responseData.
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
