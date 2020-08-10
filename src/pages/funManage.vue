<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 功能管理
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button
                        @click="addDialog"
                        icon="el-icon-circle-plus-outline"
                        type="primary"
                      >{{$t('add')}}
                      </el-button>
<!--      <q-btn color="primary" :label="$t('add')" @click="addFun"/>-->
      </div>
<!--      <div class="handle-box">-->
<!--        <el-button-->
<!--          @click="addFun"-->
<!--          type="primary"-->
<!--        >功能测试-->
<!--        </el-button>-->
<!--        <el-button-->
<!--          @click="delAllSelection"-->
<!--          class="handle-del mr10"-->
<!--          icon="el-icon-delete"-->
<!--          type="primary"-->
<!--        >批量删除-->
<!--        </el-button>-->
<!--        <el-select class="handle-select mr10" placeholder="地址" v-model="query.address">-->
<!--          <el-option key="1" label="广东省" value="广东省"></el-option>-->
<!--          <el-option key="2" label="湖南省" value="湖南省"></el-option>-->
<!--        </el-select>-->
<!--        <el-input class="handle-input mr11" placeholder="用户名" v-model="query.name"></el-input>-->
<!--        <el-button @click="handleSearch" icon="el-icon-search" type="primary">搜索</el-button>-->
<!--      </div>-->
<!--      <el-table-->
<!--        :data="tableData"-->
<!--        @selection-change="handleSelectionChange"-->
<!--        border-->
<!--        class="table"-->
<!--        header-cell-class-name="table-header"-->
<!--        ref="multipleTable"-->
<!--      >-->
<!--        <el-table-column align="center" type="selection" width="55"></el-table-column>-->
<!--        <el-table-column align="center" label="ID" prop="id" width="55"></el-table-column>-->
<!--        <el-table-column label="用户名" prop="name"></el-table-column>-->
<!--        <el-table-column label="账户余额">-->
<!--          <template slot-scope="scope">￥{{scope.row.money}}</template>-->
<!--        </el-table-column>-->
<!--        <el-table-column align="center" label="头像(查看大图)">-->
<!--          <template slot-scope="scope">-->
<!--            <el-image-->
<!--              :preview-src-list="[scope.row.thumb]"-->
<!--              :src="scope.row.thumb"-->
<!--              class="table-td-thumb"-->
<!--            ></el-image>-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--        <el-table-column label="地址" prop="address"></el-table-column>-->
<!--        <el-table-column align="center" label="状态">-->
<!--          <template slot-scope="scope">-->
<!--            <el-tag-->
<!--              :type="scope.row.state==='成功'?'success':(scope.row.state==='失败'?'danger':'')"-->
<!--            >{{scope.row.state}}-->
<!--            </el-tag>-->
<!--          </template>-->
<!--        </el-table-column>-->

<!--        <el-table-column label="注册时间" prop="date"></el-table-column>-->
<!--        <el-table-column align="center" label="操作" width="180">-->
<!--          <template slot-scope="scope">-->
<!--            <el-button-->
<!--              @click="handleEdit(scope.$index, scope.row)"-->
<!--              icon="el-icon-edit"-->
<!--              type="text"-->
<!--            >编辑-->
<!--            </el-button>-->
<!--            <el-button-->
<!--              @click="handleDelete(scope.$index, scope.row)"-->
<!--              class="red"-->
<!--              icon="el-icon-delete"-->
<!--              type="text"-->
<!--            >删除-->
<!--            </el-button>-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--      </el-table>-->

      <div>
        <GridManager :option="gridOption" ref="grid" ></GridManager>
      </div>
<!--      <div class="pagination">-->
<!--        <el-pagination-->
<!--          :current-page="query.pageIndex"-->
<!--          :page-size="query.pageSize"-->
<!--          :total="pageTotal"-->
<!--          @current-change="handlePageChange"-->
<!--          background-->
<!--          layout="total, prev, pager, next"-->
<!--        ></el-pagination>-->
<!--      </div>-->
    </div>

    <!-- 编辑弹出框 -->
<!--    <q-dialog v-model="addVisible">-->
<!--      <q-card style="width:400px;">-->
<!--      <el-form  label-width="70px" ref="form">-->
<!--                <el-form-item label="用户名">-->
<!--&lt;!&ndash;                  <el-input v-model="form.name"></el-input>&ndash;&gt;-->
<!--                </el-form-item>-->
<!--                <el-form-item label="地址">-->
<!--&lt;!&ndash;                  <el-input v-model="form.address"></el-input>&ndash;&gt;-->
<!--                </el-form-item>-->
<!--              </el-form>-->
<!--&lt;!&ndash;        <Register />&ndash;&gt;-->
<!--      </q-card>-->
<!--    </q-dialog>-->

    <el-dialog :visible.sync="addVisible" title="增加" width="30%">
      <el-form  label-width="70px" ref="form">
        <el-form-item :label="this.$t('funcName')">
          <el-select v-model="selectValue" placeholder="请选择" value-key="label">
            <el-option
              v-for="item in funcList"
              :key="item.value"
              :label="item.label"
              :value="item">
              <span style="float: left">{{ item.label }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('parentFunc')">
          <el-select v-model="selectParentValue" placeholder="请选择" value-key="label">
            <el-option
              v-for="item in parentFuncList"
              :key="item.value"
              :label="item.label"
              :value="item">
              <span style="float: left">{{ item.label }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span class="dialog-footer" slot="footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button @click="addFun()" type="primary">确 定</el-button>
            </span>
    </el-dialog>

    <el-dialog :visible.sync="editVisible" title="编辑" width="30%" z-index="1000">

      <jsonE  v-bind:value="tableConfig" @changed="getEditValue"  ></jsonE>
      <span class="dialog-footer" slot="footer">
                <el-button @click="resetSourceConfig() ">取 消</el-button>
                <el-button @click="saveConfig()" type="primary">确 定</el-button>
            </span>
    </el-dialog>
  </div>
</template>

<script>
// import {fetchData} from '../../api/index';
import bus from '../components/common/bus'
import GridManager from 'gridmanager-vue'
import 'gridmanager-vue/css/gm-vue.css'
import jsonE from '../components/tableJsonConfig'
// eslint-disable-next-line no-undef
// console.log($i18n)

export default {
  data () {
    return {
      tableData: {
        data: [],
        totals: 0
      },
      tableConfig: {
        tt: 2,
        bb: 3
      },
      tmpConfigValue: this.tableConfig,
      selectValue: {},
      selectParentValue: {},
      addVisible: false,
      editVisible: false,
      funcList: [{
        value: 'clientManage',
        label: this.$t('clientManage')
      }],
      parentFuncList: [],
      gridOption: {
        // 表格唯一標識
        gridManagerName: 'test-gm',
        height: '100%',
        firstLoading: true,
        // 列配置
        columnData: [
          {
            key: 'funcName',
            width: '180px',
            text: this.$t('funcName'),
            align: 'center'
          }, {
            key: 'parentName',
            width: '180px',
            text: this.$t('parentFunc'),
            align: 'center'
          }, {
            key: 'action',
            width: '180px',
            text: '动作',
            align: 'center',
            template: () => {
              return '<el-button size="mini"  @click="updateRow(row)">编辑 </el-button>' +
                '<el-button size="mini"  @click="delRow(row)">删除 </el-button>'
            }
          }
        ],
        supportAjaxPage: true,
        pageSize: 10,
        ajaxData: () => {
          return this.tableData
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
    this.parentFuncList = this.funcList.concat({
      value: '/',
      label: '/'
    })
    // this.parentFuncList = [
    //   {
    //     value: 'userMange',
    //     label: this.$t('userManage')
    //   },
    //   {
    //     value: 'root',
    //     label: 'none'
    //   }
    // ]
    // this.getData()
  },
  methods: {
    saveConfig () {
      console.log('save:')
      this.tmpConfigValue = this.tableConfig
      this.editVisible = false
    },
    resetSourceConfig () {
      console.log('reset:' + this.tmpConfigValue)
      this.tableConfig = JSON.parse(this.tmpConfigValue)
      this.editVisible = false
    },
    getEditValue (newValue) {
      // console.log(newValue)
      this.tableConfig = newValue
    },
    delRow (row) {
      this.tableData.data = this.tableData.data.filter(
        ({ funcName }) => funcName !== row.funcName
      )
      this.tableData.totals--
      GridManager.refreshGrid(this.gridOption.gridManagerName)
      // console.log(row.id)
      // console.log(row)
    },
    updateRow (row) {
      this.editVisible = true
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
<style lang="scss" scoped>
  .json-editor {
    height: 100%;
    position: relative;

    ::v-deep {
      .CodeMirror {
        height: auto;
        min-height: 300px;
      }

      .CodeMirror-scroll {
        min-height: 300px;
      }

      .cm-s-rubyblue span.cm-string {
        color: #F08047;
      }
    }
  }
</style>
