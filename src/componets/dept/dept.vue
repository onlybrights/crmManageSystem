<template>
  <div class="dept" v-loading="fullscreenLoading">
    <el-card class="bread">
      <my-bread level1="系统管理" level2="部门管理"></my-bread>
    </el-card>
    <el-card>
      <el-button class="addBtn" plain v-for="(item,index) in json['/dept']" :key="index" @click="features(item.code)"
        v-if="item.status==1">{{item.name}}</el-button>
      <el-table :data="tableData" style="width: 100%;margin-bottom: 20px;" row-key="id" highlight-current-row :tree-props="{children: 'children'}" @row-click="rowClick($event)">
        <el-table-column prop="fullname" label="公司全称" width="180">
        </el-table-column>
        <el-table-column prop="simplename" label="公司简称" width="180">
        </el-table-column>
        <el-table-column prop="id" label="部门id">
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 模态框 -->
    <!-- 添加部门 -->
    <deptAdd ref="deptAdd" :type="btnType" @clearObject="clearObject" :item="rowuser"></deptAdd>

    <!-- 修改部门 -->
    <deptEdit ref="deptEdit" :type="btnType" @clearObject="clearObject" :item="rowuser"></deptEdit>

    <!-- 删除部门 -->
    <deptDelete ref="deptDelete" :type="btnType" @clearObject="clearObject" :item="rowuser"></deptDelete>

    <!-- 模态框结束 -->
  </div>
</template>

<script>
  import deptAdd from './deptAdd.vue'
  import deptEdit from './deptEdit.vue'
  import deptDelete from './deptDelete.vue'
  import {
    mapMutations,
    mapState
  } from 'vuex'
  import {
    http,
    menulist,
    deptlist
  } from '../../api/api.js'
  export default {
    components: {
      deptAdd,
      deptEdit,
      deptDelete
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
      // 获取部门功能项
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
      //获取部门列表
      getrolelist() {
        this.fullscreenLoading = true;
        this.$http.get(http + deptlist, {
          params: {
            name: this.inputValue
          }
        }).then((res) => {
          // console.log(res)
          if (res.status == 200) {

            this.tableData = res.data.data
            // console.log(this.tableData)
          } else {
            // console.log(res)
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
        if (v === 'deptAdd') {
          this.btnType = {
            [v]: true,
            classify: v
          }
        } else {
          if (this.rowuser == '') {
            this.$message.error('请选择部门')
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
      // 对话框配置
      rolemodal(val, type) {
        // console.log(type)
        this.btnType = {
          [type]: true,
          classify: type
        }
        this.$refs.roleEdit.getDept()
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
