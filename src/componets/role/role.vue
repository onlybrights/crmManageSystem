<template>
  <div v-loading="fullscreenLoading">
    <el-card class="bread">
      <my-bread level1="系统管理" level2="角色管理"></my-bread>
    </el-card>
    <el-card>
      <el-button class="addBtn" plain v-for="(item,index) in json['/role']" :key="index" @click="features(item.code)" v-if="item.status==1">{{item.name}}</el-button>
      <div class="search">
        <el-input placeholder="请输入内容" v-model="inputValue" class="input-with-select" clearable style="width: 400px;"
          @clear="clearSearch">
          <el-button slot="append" icon="el-icon-search" @click="changeinput"></el-button>
        </el-input>
      </div>

      <el-table :data="tableData" style="width: 100%" @row-click="rowClick($event)" highlight-current-row max-height="380px" v-if="tableData">
        <el-table-column label="角色名称" prop="name"></el-table-column>
        <el-table-column label="部门名称" prop="deptName"></el-table-column>
        <el-table-column label="角色编码" prop="tips"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="rolemodal(scope.row,'roleEdit')" plain type="primary" icon="el-icon-edit" circle></el-button>
            <el-button @click="rolemodal(scope.row,'roleDelete')" plain type="danger" icon="el-icon-delete" circle></el-button>
            <el-button @click="rolemodal(scope.row,'roleSetAuthority')" plain type="success" icon="el-icon-check" circle></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 模态框 -->
      <!-- 添加用户 -->
      <roleAdd ref="roleAdd" :type="btnType" @clearObject="clearObject"></roleAdd>

      <!-- 修改用户 -->
      <roleEdit ref="roleEdit" :type="btnType" @clearObject="clearObject" :item="rowuser"></roleEdit>

      <!-- 删除用户 -->
      <roleDelete ref="roleDelete" :type="btnType" @clearObject="clearObject" :item="rowuser"></roleDelete>

      <!-- 分配角色 -->
      <roleSetAuthority ref="roleSetAuthority" :type="btnType" @clearObject="clearObject" :item="rowuser"></roleSetAuthority>


      <!-- 模态框结束 -->
    </el-card>
  </div>
</template>

<script>
  import roleAdd from './roleAdd.vue'
  import roleEdit from './roleEdit.vue'
  import roleSetAuthority from './roleSetAuthority.vue'
  import roleDelete from './roleDelete.vue'
  import {
    mapMutations,
    mapState
  } from 'vuex'
  import {
    http,
    menulist,
    rolelist
  } from '../../api/api.js'
  export default {
    components: {
      roleAdd,
      roleEdit,
      roleSetAuthority,
      roleDelete
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
      // 获取角色功能项
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
      //获取角色列表
      getrolelist() {
        this.fullscreenLoading = true;
        this.$http.get(http + rolelist, {
          params: {
            name:this.inputValue
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
        if (v === 'roleAdd') {
          this.btnType = {
            [v]: true,
            classify: v
          }
          this.$refs.roleAdd.getDept()
        } else {
          if (this.rowuser == '') {
            this.$message.error('请选择角色')
          } else {
              this.btnType = {
                [v]: true,
                classify: v
              }
              switch (v) {
                case 'roleEdit':
                  this.$refs.roleEdit.getDept()
                  break;
                case 'roleSetAuthority':
                  // this.$refs.roleSetAuthority.getroles()
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
      rolemodal(val,type) {
        // console.log(type)
        this.btnType = {
          [type]: true,
          classify:type
        }
        if(type=='roleAdd'||type=='roleEdit'){
          this.$refs.roleEdit.getDept()
        }

      },
      // 搜索关键字
      changeinput() {
        if (this.inputValue == '') {
          this.$message.error('请输入关键字')
        } else {
          this.getrolelist()
        }
      },
      // 清空搜索框触发事件
      clearSearch() {
        this.getrolelist()
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

<style scoped>
  .addBtn {
    margin: 10px 10px 10px 0;
  }

  .demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }

  .pagination {
    margin-top: 20px;
  }
</style>
