<template>
  <div class="menu" v-loading="fullscreenLoading">
    <el-card class="bread">
      <my-bread level1="系统管理" level2="菜单管理"></my-bread>
    </el-card>
    <el-card>
      <el-button class="addBtn" plain v-for="(item,index) in json['/menu']" :key="index" @click="features(item.code)"
        v-if="item.status==1">{{item.name}}</el-button>
      <el-table :data="tableData" style="margin-bottom: 20px;" row-key="id" highlight-current-row :tree-props="{children: 'children'}" @row-click="rowClick($event)">
        <el-table-column prop="id" label="菜单id">
        </el-table-column>
        <el-table-column prop="name" label="名称">
        </el-table-column>
        <el-table-column prop="levels" label="级别">
        </el-table-column>
        <el-table-column prop="url" label="链接标识">
        </el-table-column>
        <el-table-column label="是否是菜单">
          <template slot-scope="scope">
            <el-button plain :type="scope.row.ismenu=='1'?'primary':'danger'" size="mini">{{scope.row.isMenuName}}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-button plain :type="scope.row.status=='1'?'primary':'danger'" size="mini">{{scope.row.statusName}}</el-button>
          </template>
        </el-table-column>

      </el-table>
    </el-card>
    <!-- 模态框 -->
    <!-- 添加菜单 -->
    <menuAdd ref="menuAdd" :type="btnType" @clearObject="clearObject" :item="rowuser"></menuAdd>

    <!-- 修改菜单 -->
    <menuEdit ref="menuEdit" :type="btnType" @clearObject="clearObject" :item="rowuser"></menuEdit>

    <!-- 删除菜单 -->
    <menuDelete ref="menuDelete" :type="btnType" @clearObject="clearObject" :item="rowuser"></menuDelete>

    <!-- 模态框结束 -->
  </div>
</template>

<script>
  import menuAdd from './menuAdd.vue'
  import menuEdit from './menuEdit.vue'
  import menuDelete from './menuDelete.vue'
  import {
    mapMutations,
    mapState
  } from 'vuex'
  import {
    http,
    menulist
  } from '../../api/api.js'
  export default {
    components: {
      menuAdd,
      menuEdit,
      menuDelete
    },
    watch:{
      currentUser(){
        this.rowuser = this.currentUser
      }
    },
    computed: {
      ...mapState({
        // 当前选中的角色
        'currentUser': ({
          user
        }) => user.currentUser,
        // 当前登录的用户信息
        'infos': ({
          user
        }) => user.infos
      })
    },
    data() {
      return {
        tableData: [],
        json: {},
        inputValue: '',
        rowuser: '',
        btnType: '',
        fullscreenLoading:false
      }
    },
    mounted() {
      this.getmenulist()
      this.getrolelist()
    },
    methods: {
      //把功能项存到vuex
      ...mapMutations(['getFeatures', 'getCurrentuser']),
      // 获取菜单功能项
      getmenulist() {
        let json = {}
        this.$http.get(http + menulist).then((res) => {
          if (res.status == 200) {
            // console.log(res)
            res.data.data.forEach((item) => {
              item.children.forEach((v) => {
                this.$set(json, v.url, v.children)
              })
            })
            this.json = json
            this.getFeatures(json)
            // console.log(json)
          } else {
            this.$message.error(res.data.msg)
          }

        }, (error) => {
          this.$message.error(error.data.message)
        })
      },
      //获取菜单列表
      getrolelist() {
        this.fullscreenLoading = true;
        this.$http.get(http + menulist).then((res) => {
          // console.log(res)
          if (res.status == 200) {
            this.tableData = res.data.data
            // console.log(this.tableData)
          } else {
            console.log(res)
            this.$message.error(res.data.msg)
          }
          setTimeout(() => {
            this.fullscreenLoading = false;
          }, 2000);
        }, (error) => {
          // console.log(error)
          this.$message.error(error.data.message)
        })
      },
      // 功能按钮触发事件
      features(v) {
        // console.log(v)
        if (v === 'menuAdd') {
          this.btnType = {
            [v]: true,
            classify: v
          }
        } else {
          if (this.rowuser == '') {
            this.$message.error('请选择菜单')
          } else {
            this.btnType = {
              [v]: true,
              classify: v
            }
          }
        }
      },
      // 选择当前行
      rowClick(e) {
        this.getCurrentuser(e)
        // console.log(this.rowuser)
      },
      // 关闭对话框
      clearObject() {
        // 关闭对话框之后更新数据
        this.getrolelist()
        // 关闭对话框之后清空当前选择的用户
        this.rowuser = ''
      }
    }
  }
</script>

<style>
</style>
