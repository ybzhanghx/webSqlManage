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
          @click="addFun"
          type="primary"
        >功能测试
        </el-button>
        <el-button
          @click="delAllSelection"
          class="handle-del mr10"
          icon="el-icon-delete"
          type="primary"
        >批量删除
        </el-button>
        <el-select class="handle-select mr10" placeholder="地址" v-model="query.address">
          <el-option key="1" label="广东省" value="广东省"></el-option>
          <el-option key="2" label="湖南省" value="湖南省"></el-option>
        </el-select>
        <el-input class="handle-input mr11" placeholder="用户名" v-model="query.name"></el-input>
        <el-button @click="handleSearch" icon="el-icon-search" type="primary">搜索</el-button>
      </div>
      <el-table
        :data="tableData"
        @selection-change="handleSelectionChange"
        border
        class="table"
        header-cell-class-name="table-header"
        ref="multipleTable"
      >
        <el-table-column align="center" type="selection" width="55"></el-table-column>
        <el-table-column align="center" label="ID" prop="id" width="55"></el-table-column>
        <el-table-column label="用户名" prop="name"></el-table-column>
        <el-table-column label="账户余额">
          <template slot-scope="scope">￥{{scope.row.money}}</template>
        </el-table-column>
        <el-table-column align="center" label="头像(查看大图)">
          <template slot-scope="scope">
            <el-image
              :preview-src-list="[scope.row.thumb]"
              :src="scope.row.thumb"
              class="table-td-thumb"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column label="地址" prop="address"></el-table-column>
        <el-table-column align="center" label="状态">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.state==='成功'?'success':(scope.row.state==='失败'?'danger':'')"
            >{{scope.row.state}}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="注册时间" prop="date"></el-table-column>
        <el-table-column align="center" label="操作" width="180">
          <template slot-scope="scope">
            <el-button
              @click="handleEdit(scope.$index, scope.row)"
              icon="el-icon-edit"
              type="text"
            >编辑
            </el-button>
            <el-button
              @click="handleDelete(scope.$index, scope.row)"
              class="red"
              icon="el-icon-delete"
              type="text"
            >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          :current-page="query.pageIndex"
          :page-size="query.pageSize"
          :total="pageTotal"
          @current-change="handlePageChange"
          background
          layout="total, prev, pager, next"
        ></el-pagination>
      </div>
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog :visible.sync="editVisible" title="编辑" width="30%">
      <el-form :model="form" label-width="70px" ref="form">
        <el-form-item label="用户名">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="form.address"></el-input>
        </el-form-item>
      </el-form>
      <span class="dialog-footer" slot="footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button @click="saveEdit" type="primary">确 定</el-button>
            </span>
    </el-dialog>
  </div>
</template>

<script>
// import {fetchData} from '../../api/index';
import bus from '../components/common/bus'

export default {
  name: 'basetable',
  data () {
    return {
      query: {
        address: '',
        name: '',
        pageIndex: 1,
        pageSize: 10
      },
      tableData: [],
      multipleSelection: [],
      delList: [],
      editVisible: false,
      pageTotal: 0,
      form: {},
      idx: -1,
      id: -1
    }
  },
  created () {
    this.getData()
  },
  methods: {
    // 获取 easy-mock 的模拟数据
    // getData () {
    //   fetchData(this.query).then(res => {
    //     console.log(res)
    //     this.tableData = res.list
    //     this.pageTotal = res.pageTotal || 50
    //   })
    // },
    // 触发搜索按钮
    handleSearch () {
      this.$set(this.query, 'pageIndex', 1)
      this.getData()
    },
    // 删除操作
    // eslint-disable-next-line no-unused-vars
    handleDelete (index, row) {
      // 二次确认删除
      this.$confirm('确定要删除吗？', '提示', {
        type: 'warning'
      })
        .then(() => {
          this.$message.success('删除成功')
          this.tableData.splice(index, 1)
        })
        .catch(() => {
        })
    },
    // 多选操作
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    delAllSelection () {
      const length = this.multipleSelection.length
      let str = ''
      this.delList = this.delList.concat(this.multipleSelection)
      for (let i = 0; i < length; i++) {
        str += this.multipleSelection[i].name + ' '
      }
      this.$message.error(`删除了${str}`)
      this.multipleSelection = []
    },
    addFun () {
      bus.$emit('funAdd', 'testFiled', 'root')
    },
    // 编辑操作
    handleEdit (index, row) {
      this.idx = index
      this.form = row
      this.editVisible = true
    },
    // 保存编辑
    saveEdit () {
      this.editVisible = false
      this.$message.success(`修改第 ${this.idx + 1} 行成功`)
      this.$set(this.tableData, this.idx, this.form)
    },
    // 分页导航
    handlePageChange (val) {
      this.$set(this.query, 'pageIndex', val)
      this.getData()
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
    font-size: 14px;
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
