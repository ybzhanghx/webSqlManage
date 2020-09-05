<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <el-button
                        @click="addDialog"
                        icon="el-icon-circle-plus-outline"
                        type="primary"
                      >{{$t('add')}}
                      </el-button>
      </div>
      <div>
        <GridManager :option="gridOption" ref="grid" ></GridManager>
      </div>
    </div>

    <el-dialog :visible.sync="addVisible" :title="this.$t(this.DialogAction)" width="35%">
<!--      类型-->
      <el-form  label-width="80px" ref="form" size="medium" >
        <el-form-item :label="this.$t('type')">
          <el-select v-model="selectTypeValue" :disabled="this.DialogAction !=='add'" style="width:30%" @change="TypeValueChoosed">
            <el-option
              v-for="item in TypeSelectList"
              :key="item.value"
              :label="item.label"
              :value="item">
              <span style="float: left">{{ item.label }}</span>

            </el-option>
          </el-select>
        </el-form-item>
<!--        数据源-->
        <el-form-item :label="this.$t('dataSource')"   v-if="selectTypeValue.value==='Leaf'">
          <el-cascader  style="width:50%"
            v-model="selectDataSourceValue"
            :options="dataSourceList"
                        :disabled="this.DialogAction !=='add'"
            :props="{ expandTrigger: 'hover' }"

           ></el-cascader>
        </el-form-item>
<!--        功能名-->
        <el-form-item :label="this.$t('funcName')" style="width:50%">
          <el-input v-model="EditFuncName" placeholder="请输入内容" ></el-input>
        </el-form-item>
<!--        所在层级-->
        <el-form-item :label="$t('parentFunc')">
          <el-select v-model="selectParentValue" :disabled="isDisableParentSelect" placeholder="请选择" value-key="label">
            <el-option
              v-for="item in parentFuncList"
              :key="item.value"
              :label="item.label"
              :value="item"
              :disabled="item.disabled">
              <span style="float: left">{{ item.label }}</span>
              <!--              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>-->
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span class="dialog-footer" slot="footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button @click="dialogFun()" type="primary">确 定</el-button>
            </span>
    </el-dialog>

    <el-dialog :visible.sync="editVisible" title="编辑" width="30%" z-index="50" height="75%">

      <jsonE  v-bind:value="tableConfigJsonStr" @changed="getEditValue"  ></jsonE>
      <span class="dialog-footer" slot="footer">
                <el-button @click="resetSourceConfig() ">取 消</el-button>
                <el-button @click="saveConfig()" type="primary">确 定</el-button>
            </span>
    </el-dialog>
  </div>
</template>

<script>

import GridManager from 'gridmanager-vue'
import 'gridmanager-vue/css/gm-vue.css'
import jsonE from '../components/tableJsonConfig'
import { getTableConfig, getTableNames, UpdateTableConfig } from '../api/api'
import { FuncTreeNode } from '../store/funcManageBar/common'
import TableDataRow from '../common/funcManage'
export default {
  data () {
    return {
      tableConfig: {
        tt: 2,
        bb: 3
      },
      baseList: [],
      tableConfigJsonStr: '',
      tmpConfigValue: '',
      // start-- 添加框
      EditFuncName: '',
      selectTypeValue: {},
      TypeSelectList: [{
        value: 'Leaf',
        label: this.$t('leafNode')
      },
      {
        value: 'Parent',
        label: this.$t('nonLeafNode')

      }],
      selectDataSourceValue: {},
      selectParentValue: {},
      addVisible: false,
      setTmpValue: 0,
      DialogAction: 'add',
      editRow: {},
      // end
      editVisible: false,
      editThisRow: {},
      gridOption: {
        // 表格唯一標識
        gridManagerName: 'test-gm',
        height: '100%',
        firstLoading: true,
        pageSize: 10,
        // 列配置
        columnData: [
          {
            key: 'funcName',
            text: this.$t('funcName'),
            align: 'center'
          }, {
            key: 'parentName',

            text: this.$t('parentFunc'),
            align: 'center'
          }, {
            key: 'action',
            text: '动作',
            align: 'center',
            template: () => {
              return '<el-button size="mini"  @click="updateVisible(row)">修改 </el-button>' +
                '<el-button size="mini"  @click="updateSource(row)">编辑数据源配置 </el-button>' +
                '<el-button size="mini"  @click="delRow(row)">删除 </el-button>'
            }
          }
        ],
        supportAjaxPage: true,
        ajaxData: (settings, params) => {
          return this.setTableData(params.cPage, params.pSize)
        }
        // ...更多配置請參考API
      }
    }
  },
  components: {
    GridManager,
    jsonE
  },

  created () {
    this.addVisible = false
    this.tableConfigJsonStr = JSON.stringify(this.tableConfig, null, 2)
    getTableNames({ }).then(responseData => {
      for (const dbtb of responseData.Data) {
        const node = {
          value: dbtb.DbName,
          label: dbtb.DbName
        }
        node.children = dbtb.TbName.map(Tb => {
          return {
            value: Tb,
            label: Tb,
            disabled: false
          }
        })
        this.baseList.push(node)
      }
    }
    )
  },
  computed: {
    tableData: function () {
      const getTree = this.$store.getters.getState
      const tmpData = getTree.children.map(itemValue => {
        return new TableDataRow(itemValue.value, '/', itemValue.name, '/', itemValue.isLeaf)
      })
      for (const parentTitle of getTree.children) {
        for (const tableNode of parentTitle.children) {
          tmpData.push(new TableDataRow(tableNode.value, parentTitle.value, tableNode.name, parentTitle.name, tableNode.isLeaf))
        }
      }
      return { data: tmpData, totals: tmpData.length }
    },
    dataSourceList: function () {
      return this.baseList
    },
    parentFuncList: function () {
      const getTree = this.$store.getters.getState
      const tmpList = [{
        value: '/',
        label: '/',
        disabled: true
      }]
      tmpList.push(...getTree.children.map(item => {
        return {
          value: item.value,
          label: item.name,
          disabled: false
        }
      }))
      return tmpList
    },
    isDisableParentSelect: function () {
      return this.selectTypeValue.value === 'Parent'
    }
  },

  methods: {
    async saveConfig () {
      var parsedObject
      try {
        parsedObject = JSON.parse(this.tableConfigJsonStr)
      } catch (e) {
        this.$message.error('json格式错误')
        return
      }
      if (this.editRow.funcKey === 'zybtest|tableA') {
        const tmpArr = this.editRow.funcKey.split('|')
        const res = await UpdateTableConfig({ DB: tmpArr[0], TB: tmpArr[1], Data: parsedObject })
        if (res.Code !== 0) {
          this.$message.error('保存失败' + res.Msg)
        } else {
          this.$message.info('更改成功')
          this.tmpConfigValue = this.tableConfigJsonStr
          this.tableConfig = parsedObject
        }
      }
      this.editVisible = false
    },
    resetSourceConfig () {
      this.tableConfigJsonStr = this.tmpConfigValue
      this.editVisible = false
    },
    getEditValue (newValue) {
      this.tableConfigJsonStr = newValue
    },
    delRow (row) {
      this.$store.commit({
        type: 'delNode',

        value: row.funcKey,
        parentValue: row.parentFunKey

      })
      GridManager.refreshGrid(this.gridOption.gridManagerName)
    },
    // 点击编辑行数据
    updateVisible (row) {
      this.editRow = row
      this.addVisible = true
      this.DialogAction = 'update'
      this.selectTypeValue = row.type ? this.TypeSelectList[0] : this.TypeSelectList[1]
      this.selectDataSourceValue = row.funcKey.split('|')
      this.selectParentValue = {
        value: this.editRow.parentFunKey,
        label: this.editRow.parentName
      }
    },
    async updateSource (row) {
      this.tableConfig = {}
      try {
        const tmpArr = row.funcKey.split('|')
        const res = await getTableConfig({ DB: tmpArr[0], TB: tmpArr[1] })
        if (res.Code === 0) {
          this.tableConfig = res.Data.map(item => {
            delete item.is_key
            delete item.is_able_null
            item.newName = item.field_name
            item.action = 'keep'
            return item
          })
        } else {
          console.log(res.msg)
        }
      } catch (e) {
        console.log(e)
      }
      this.tableConfigJsonStr = JSON.stringify(this.tableConfig, null, 2)
      this.tmpConfigValue = this.tableConfigJsonStr
      this.editVisible = true
      this.editRow = row
    },
    // 获取 easy-mock 的模拟数据
    addDialog () {
      this.addVisible = true
      this.DialogAction = 'add'
      this.selectTypeValue = this.TypeSelectList[1]
      this.parentFuncList[0].disabled = true
    },
    TypeValueChoosed () {
      if (this.selectTypeValue.value === 'Leaf') {
        this.selectParentValue = {}
      } else {
        this.selectParentValue = this.parentFuncList[0]
      }
    },
    async setTableData (page_, size_) {
      const tmp = {}
      tmp.data = this.tableData.data.slice((page_ - 1) * size_, page_ * size_)
      tmp.totals = this.tableData.totals
      return tmp
    },
    dialogFun () {
      if (this.DialogAction === 'add') {
        this.addFun()
      } else {
        this.editFun()
      }
    },
    addFun () {
      const tmpNode = new FuncTreeNode(
        '',
        this.EditFuncName,
        this.selectTypeValue.value === 'Leaf'
      )
      let parentDir = '/'
      if (this.selectTypeValue.value === 'Leaf') {
        tmpNode.value = this.selectDataSourceValue.reduce((a, b) => { return a + '|' + b })
        parentDir = this.selectParentValue.value
      } else {
        this.setTmpValue++
        tmpNode.value = 'item' + String(this.setTmpValue)
      }
      this.$store.commit({ type: 'addNode', nodeData: { node: tmpNode, parent: parentDir } })
      this.addVisible = false
      GridManager.refreshGrid(this.gridOption.gridManagerName)
    },
    editFun () {
      this.$store.commit({
        type: 'updateNode',
        name: this.EditFuncName,
        value: this.selectDataSourceValue.reduce((a, b) => { return a + '|' + b }),
        isLeaf: this.selectTypeValue.value === 'Leaf',
        parentValue: this.editRow.parentFunKey,
        newParentValue: this.selectParentValue.value

      })
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

  .jsonEditorSetd {
    width: 75%;
    height: 100px;
  }

</style>
