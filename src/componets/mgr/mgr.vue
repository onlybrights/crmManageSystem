<template>
  <div v-loading="fullscreenLoading">
    <el-card class="bread">
      <my-bread level1="系统管理" level2="用户管理"></my-bread>
    </el-card>
    <el-card>
      <el-button class="addBtn" plain v-for="(item,index) in json['/mgr']" :key="index" @click="features(item.code)"
        v-if="item.status==1">{{item.name}}</el-button>
      <div class="search">
        <el-input placeholder="请输入内容" v-model="inputValue" class="input-with-select" clearable style="width: 400px;"
          @clear="clearSearch">
          <el-button slot="append" icon="el-icon-search" @click="changeinput"></el-button>
        </el-input>
      </div>
      <el-table :data="tableData" style="width: 100%" @row-click="rowClick($event)" highlight-current-row v-if="tableData">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-form label-position="left" inline class="demo-table-expand">

              <el-form-item label="角色名称">
                <span>{{ scope.row.roleName }}</span>
              </el-form-item>
              <el-form-item label="性别">
                <span>{{ scope.row.sexName }}</span>
              </el-form-item>
              <el-form-item label="生日">
                <span>{{ scope.row.birthday }}</span>
              </el-form-item>
              <el-form-item label="邮箱">
                <span>{{ scope.row.email }}</span>
              </el-form-item>
              <el-form-item label="部门名称">
                <span>{{ scope.row.deptName }}</span>
              </el-form-item>
              <el-form-item label="创建时间">
                <span>{{ scope.row.createTime }}</span>
              </el-form-item>
              <el-form-item label="手机号">
                <span>{{ scope.row.phone }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="姓名" prop="name"></el-table-column>
        <el-table-column label="账户" prop="account"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-button plain :type="scope.row.status=='1'?'primary':'danger'" size="mini">{{scope.row.statusName}}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="deleteUser('mgrEdit')" plain type="primary" icon="el-icon-edit" circle></el-button>
            <el-button @click="deleteUser('mgrDelete')" plain type="danger" icon="el-icon-delete" circle></el-button>
            <el-button @click="deleteUser('mgrSetRole')" plain type="success" icon="el-icon-check" circle></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-if="total!=0" class="pagination" background :total="total" @current-change="currentChange"
        @size-change="handleSizeChange" :current-page="page" :page-sizes="[2,4,6,8]" :page-size="4" layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>


      <!-- 模态框 -->
      <!-- 添加用户 -->
      <modals ref="mgrAdd" :type="btnType" @clearObject="clearObject"></modals>

      <!-- 修改用户 -->
      <mgrEdit ref="mgrEdit" :type="btnType" @clearObject="clearObject" :item="rowuser"></mgrEdit>

      <!-- 删除用户 -->
      <mgrDelete ref="mgrDelete" :type="btnType" @clearObject="clearObject" :item="rowuser"></mgrDelete>

      <!-- 分配角色 -->
      <mgrSetRole ref="mgrSetRole" :type="btnType" @clearObject="clearObject" :item="rowuser"></mgrSetRole>


      <!-- 模态框结束 -->
    </el-card>
  </div>

</template>

<script>
  import modals from './modal.vue'
  import mgrEdit from './mgrEdit.vue'
  import mgrSetRole from './mgrSetRole.vue'
  import mgrDelete from './mgrDelete.vue'
  import {
    mapMutations,
    mapState
  } from 'vuex'
  import {
    http,
    menulist,
    userlist
  } from '../../api/api.js'
  export default {
    watch: {
      currentUser() {
        this.rowuser = this.currentUser
      }
    },
    components: {
      modals,
      mgrEdit,
      mgrSetRole,
      mgrDelete
    },
    computed: {
      ...mapState({
        'currentUser': ({
          user
        }) => user.currentUser,
        'infos': ({
          user
        }) => user.infos
      })
    },
    data() {
      return {
        tableData: [],
        json: {},
        page: 1,
        pagesize: 4,
        total: 0,
        inputValue: '',
        rowuser: '',
        btnType: '',
        fullscreenLoading:false
      }
    },
    mounted() {
      this.getmenulist()
      this.getuserlist()
    },
    methods: {
      //把功能项存到vuex
      ...mapMutations(['getFeatures', 'getCurrentuser']),
      // 获取用户功能项
      getmenulist() {
        let json = {}
        this.$http.get(http + menulist).then((res) => {
          if (res.status == 200) {
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
      //获取用户列表
      getuserlist() {
        this.fullscreenLoading = true;
        this.$http.get(http + userlist, {
          params: {

            page: this.page,
            limit: this.pagesize,
            name: this.inputValue

          }
        }).then((res) => {
          if (res.status == 200) {
            // console.log(res)
            this.tableData = res.data.data.records
            this.total = res.data.data.total
            // console.log(this.tableData)
          } else {
            this.$message.error(res.data.msg)
          }
          setTimeout(() => {
            this.fullscreenLoading = false;
          }, 2000);
        }, (error) => {
          this.$message.error(error.data.message)
        })
      },
      // 功能按钮触发事件
      features(v) {
        // console.log(v)
        if (v === 'mgrAdd') {
          this.btnType = {
            [v]: true,
            classify: v
          }
          this.$refs.mgrAdd.getDept()
        } else {
          if (this.rowuser == '') {
            this.$message.error('请选择用户')
          } else {
            this.btnType = {
              [v]: true,
              classify: v
            }
            switch (v) {
              case 'mgrEdit':
                this.$refs.mgrEdit.getDept()
                break;
              case 'mgrSetRole':
                this.$refs.mgrSetRole.getroles()
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
      deleteUser(type) {
        this.btnType = {
          [type]: true,
          classify: type
        }
        if (type == 'mgrEdit') {
          this.$refs[type].getDept()
        } else if (type == 'mgrSetRole') {
          this.$refs[type].getroles()
        } else {
          return
        }

      },
      // 搜索关键字
      changeinput() {
        if (this.inputValue == '') {
          this.$message.error('请输入关键字')
        } else {
          this.page = 1
          this.getuserlist()
        }
      },
      // 清空搜索框触发事件
      clearSearch() {
        this.page = 1
        this.getuserlist()
      },
      //分页-改变当前页
      currentChange(e) {
        this.page = e
        this.getuserlist()
      },
      //每页条数改变触发
      handleSizeChange(e) {
        this.pagesize = e
        this.page = 1
        this.getuserlist()
      },
      // 关闭对话框
      clearObject() {
        // 关闭对话框之后更新数据
        this.getuserlist()
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
