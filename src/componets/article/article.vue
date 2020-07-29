<template>
  <div v-loading="fullscreenLoading">
    <el-card class="bread">
      <my-bread level1="系统管理" level2="文章管理"></my-bread>
    </el-card>
    <el-card>
      <el-button class="addBtn" plain v-for="(item,index) in json['/article']" :key="index" @click="features(item.code)"
        v-if="item.status==1">{{item.name}}</el-button>
      <div class="search">
        <el-input placeholder="标题/作者" v-model="inputValue" class="input-with-select" clearable style="width: 300px;"
          @clear="clearSearch">
          <el-button slot="append" icon="el-icon-search" @click="changeinput"></el-button>
        </el-input>
            <el-date-picker
            style="width: 300px;margin-left: 20px;"
              v-model="time"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyyMMddHHmmss"
              @change="changeTime"
              >
            </el-date-picker>
      </div>

      <el-table :data="tableData" style="width: 100%" @row-click="rowClick($event)" highlight-current-row v-if="tableData">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="文章内容">
                <span>{{ scope.row.content }}</span>
              </el-form-item>
              <el-form-item label="创建人">
                <span>{{ scope.row.createBy }}</span>
              </el-form-item>
              <el-form-item label="文章id">
                <span>{{ scope.row.id }}</span>
              </el-form-item>
              <el-form-item label="类型id">
                <span>{{ scope.row.idChannel }}</span>
              </el-form-item>
              <el-form-item label="更新时间">
                <span>{{ scope.row.modifyTime }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="作者" prop="author"></el-table-column>
        <el-table-column label="文章标题" prop="title"></el-table-column>
        <el-table-column label="创建时间" prop="createTime"></el-table-column>
      </el-table>
      <el-pagination v-if="total!=0" class="pagination" background :total="total" @current-change="currentChange"
        @size-change="handleSizeChange" :current-page="page" :page-sizes="[2,4,6,8]" :page-size="4" layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
      <!-- 模态框 -->
      <!-- 修改文章 -->
      <update ref="update" :type="btnType" @clearObject="clearObject" :item="rowuser"></update>

      <!-- 删除文章 -->
      <deleteArticle ref="deleteArticle" :type="btnType" @clearObject="clearObject" :item="rowuser"></deleteArticle>
      <!-- 模态框结束 -->
    </el-card>
  </div>

</template>

<script>
  import update from './update.vue'
  import deleteArticle from './deleteArticle.vue'
  import {
    mapMutations,
    mapState
  } from 'vuex'
  import {
    http,
    menulist,
    userlist,
    articlelist
  } from '../../api/api.js'
  export default {
    watch: {
      currentUser() {
        this.rowuser = this.currentUser
      }
    },
    components: {
      update,
      deleteArticle
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
        time:'',
        title:'',
        author:'',
        startData:'',
        endData:'',
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
      // 获取文章功能项
      getmenulist() {
        this.fullscreenLoading = true;
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
          setTimeout(() => {
            this.fullscreenLoading = false;
          }, 2000);
        }, (error) => {
          this.$message.error(error.data.message)
        })

      },
      //获取文章列表
      getuserlist() {
        this.$http.get(http + articlelist, {
          params: {
            author:this.author,
            title:this.title,
            endDate:this.endData,
            startDate:this.startData,
            page: this.page,
            limit: this.pagesize

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

        }, (error) => {
          this.$message.error(error.data.message)
        })
      },
      // 功能按钮触发事件
      features(v) {
        // console.log(v)
        if (this.rowuser == '') {
          this.$message.error('请选择文章')
        } else {
          this.btnType = {
            [v]: true,
            classify: v
          }
        }
      },
      // 选择当前行
      rowClick(e) {
        this.getCurrentuser(e)
        // console.log(this.rowuser)
      },
      // 搜索关键字
      changeinput() {
        if (this.inputValue == '') {
          this.$message.error('请输入关键字')
        } else {
          this.author = this.inputValue
          this.page = 1
          this.getuserlist()
        }
      },
      // 搜索时间
      changeTime(){
        this.startData = this.time==null ? '' : this.time[0]
        this.endData = this.time==null ? '' : this.time[1]
        // console.log(this.startData,this.endData)
        this.getuserlist()
      },
      // 清空搜索框触发事件
      clearSearch() {
        this.author = ''
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
        // 关闭对话框之后清空当前选择的文章
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
