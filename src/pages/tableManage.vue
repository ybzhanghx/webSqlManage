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
      <div class="handle-box">
        <el-button
          @click="()=>{ this.dialogs.isVisible = true;  }"
          icon="el-icon-circle-plus-outline"
          type="primary"
        >{{$t('add')}}
        </el-button>
      </div>
      <div  v-if="isLoadGrid">
        <GridManager :option="gridOption" ref="tableGrid"></GridManager>
      </div>
    </div>

    <el-dialog :visible.sync="dialogs.isVisible" :title="this.$t(this.dialogs.types)" width="35%">
<!--      &lt;!&ndash;      类型&ndash;&gt;-->
<!--      <el-form  label-width="80px" ref="form" size="medium" >-->
<!--        <el-form-item :label="this.$t('type')">-->
<!--          <el-select v-model="this.dialogs.select" :disabled="this.DialogAction !=='add'" style="width:30%" @change="TypeValueChoosed">-->
<!--            <el-option-->
<!--              v-for="item in TypeSelectList"-->
<!--              :key="item.value"-->
<!--              :label="item.label"-->
<!--              :value="item">-->
<!--              <span style="float: left">{{ item.label }}</span>-->

<!--            </el-option>-->
<!--          </el-select>-->
<!--        </el-form-item>-->
<!--        &lt;!&ndash;        数据源&ndash;&gt;-->
<!--        <el-form-item :label="this.$t('dataSource')"   v-if="selectTypeValue.value==='Leaf'">-->
<!--          <el-cascader  style="width:50%"-->
<!--                        v-model="selectDataSourceValue"-->
<!--                        :options="dataSourceList"-->
<!--                        :disabled="this.DialogAction !=='add'"-->
<!--                        :props="{ expandTrigger: 'hover' }"-->

<!--          ></el-cascader>-->
<!--        </el-form-item>-->
<!--        &lt;!&ndash;        功能名&ndash;&gt;-->
<!--        <el-form-item :label="this.$t('funcName')" style="width:50%">-->
<!--          <el-input v-model="EditFuncName" placeholder="请输入内容" ></el-input>-->
<!--        </el-form-item>-->
<!--        &lt;!&ndash;        所在层级&ndash;&gt;-->
<!--        <el-form-item :label="$t('parentFunc')">-->
<!--          <el-select v-model="selectParentValue" :disabled="isDisableParentSelect" placeholder="请选择" value-key="label">-->
<!--            <el-option-->
<!--              v-for="item in parentFuncList"-->
<!--              :key="item.value"-->
<!--              :label="item.label"-->
<!--              :value="item"-->
<!--              :disabled="item.disabled">-->
<!--              <span style="float: left">{{ item.label }}</span>-->
<!--              &lt;!&ndash;              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>&ndash;&gt;-->
<!--            </el-option>-->
<!--          </el-select>-->
<!--        </el-form-item>-->
<!--      </el-form>-->
      <span class="dialog-footer" slot="footer">
                <el-button @click="() => { this.dialogs.isVisible = false }">取 消</el-button>

            </span>
    </el-dialog>
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
      isLoadGrid: false,
      gridOption: {},
      dialogs: {
        isVisible: false,
        types: 'add'
      },
      defaultCols: [{
        key: 'del',
        text: this.$t('action'),
        template: () => {
          return '<el-button size="mini"  @click="delRow(row)">删除 </el-button>'
        }
      }
      ]
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
      const tmpArr = this.$route.path.slice(7).split('|')
      const res = await getTableConfig({ DB: tmpArr[0], TB: tmpArr[1] })
      if (res.Code !== 0) {
        this.$message.error('table load error !')
      }
      const tmpName = res.Data.map(item => {
        return item.field_name
      })
      // this.gridOption.columnData =
      const result = this.defaultCols
      result.push(...tmpName.map(
        element => {
          return {
            key: element,
            text: element
          }
        }
      ))
      return result
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
      await getTableDataList(paramData).then(
        (responseData) => {
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
          tmp.data = getData.map(item => {
            for (const fieldItem of responseData.Fields) {
              if (fieldItem.AbleNull) {
                let parseFunc = (obj) => {}
                switch (fieldItem.TypeName) {
                  case 'time': parseFunc = funcValidTime; break
                  case 'string':parseFunc = funcValidStr; break
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
          tmp.totals = responseData.Totals
        }
      )
      return tmp
    },
    async delRow (row) {

    }
  },
  watch: {
    async $route (to, from) {
      this.isLoadGrid = false
      const value = await this.getColName()
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
