<template>
  <div class="sidebar">

    <el-menu
      :collapse="collapse"
      :default-active="onRoutes"
      active-text-color="#20a0ff"
      background-color="#324157"
      class="sidebar-el-menu"
      text-color="#bfcbd9"
      router
      unique-opened
    >
      <template v-for="item in items">
        <template v-if="item.subs">
          <el-submenu :route="{path: '/'+item.index }" :index="item.index" :key="item.index">
            <template slot="title">
              <i :class="item.icon"></i>
              <span slot="title">{{ item.title }}</span>
            </template>
            <template v-for="subItem in item.subs">
<!--              <el-submenu-->
<!--                :index="subItem.index+'id'"-->
<!--                :route="{path: '/table/'+item.index }"-->
<!--                :key="subItem.index+'id'"-->
<!--                v-if="subItem.subs"-->
<!--              >-->
<!--                <template slot="title">{{ subItem.title }}</template>-->
<!--              </el-submenu>-->
              <el-menu-item
                :index="subItem.index"
                :key="subItem.index"
                :route="{path: '/table/'+subItem.index }"
              >{{ subItem.title }}
              </el-menu-item>
            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :route="{path: '/'+item.index }"  :index="item.index" :key="item.index">
            <i :class="item.icon"></i>
            <span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
import bus from './common/bus'
const baseItems = [
  {
    icon: 'el-icon-lx-copy',
    index: 'funManage',
    title: '功能列表'
  }
]
export default {
  data () {
    return {
      collapse: false
    }
  },
  computed: {
    items: function () {
      const getTree = this.$store.getters.getState
      const tmp = getTree.children.map(node => {
        const tmpNode = {
          icon: 'el-icon-collection-tag',
          index: node.value,
          title: node.name
        }
        if (node.childs > 0) {
          tmpNode.subs = this.parseTree(node.children)
        } else if (node.value !== 'funManage') {
          tmpNode.index = 'empty/' + node.value
        }
        return tmpNode
      })
      return baseItems.concat(tmp)
    },
    onRoutes () {
      return this.$route.path.replace('/', '')
    }
  },
  created () {
    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    bus.$on('collapse', msg => {
      this.collapse = msg
      bus.$emit('collapse-content', msg)
    })
  },
  methods: {
    parseTree (list) {
      return list.map(node => {
        const tmp = {
          icon: 'el-icon-paperclip',
          index: node.value,
          title: node.name
        }
        if (node.childs > 0) {
          tmp.subs = this.parseTree(node.children)
        }
        return tmp
      })
    }
  }
}
</script>

<style scoped>
  .sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    overflow-y: scroll;
  }

  .sidebar::-webkit-scrollbar {
    width: 0;
  }

  .sidebar-el-menu:not(.el-menu--collapse) {
    width: 250px;
  }

  .sidebar > ul {
    height: 100%;
  }
</style>
