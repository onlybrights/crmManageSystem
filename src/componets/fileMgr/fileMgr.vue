<template>
  <div v-loading="fullscreenLoading">
    <el-card class="bread">
      <my-bread level1="系统管理" level2="文件管理"></my-bread>
    </el-card>
    <el-card>
      <el-upload class="upload-demo" :action="http+file" :before-remove="beforeRemove" multiple :limit="3" :headers="headers" :on-error="error" :on-success="success" style="width: 600px;">
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
      <el-input placeholder="文件名" v-model="inputValue" class="input-with-select" clearable style="width: 600px;margin-top: 20px;" @clear="clearSearch">
        <el-button slot="append" icon="el-icon-search" @click="changeinput"></el-button>
      </el-input>
      <el-table :data="tableData" style="width: 100%" @row-click="rowClick($event)" highlight-current-row v-if="tableData">
        <el-table-column label="id" prop="id"></el-table-column>
        <el-table-column label="创建人" prop="createBy"></el-table-column>
        <el-table-column label="创建时间" prop="createTime"></el-table-column>
        <el-table-column label="预览">
          <template slot-scope="scope">
            <img style="height: 80px;" :src="imgdomnload+scope.row.originalFileName" alt="">
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="downloadPicture(scope.row)">下载</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-if="total!=0" class="pagination" background :total="total" @current-change="currentChange"
        @size-change="handleSizeChange" :current-page="page" :page-sizes="[2,3,4,6,8]" :page-size="3" layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </el-card>
  </div>

</template>

<script>
  import {
    mapMutations,
    mapState
  } from 'vuex'
  import {
    http,
    menulist,
    fileMgr,
    imgdomnload,
    downloadfile,
    file
  } from '../../api/api.js'
  export default {
    watch: {
      currentUser() {
        this.rowuser = this.currentUser
      }
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
        pagesize: 3,
        total: 0,
        inputValue: '',
        btnType: '',
        rowuser: '',
        imgdomnload,
        http,
        file,
        headers:{
          'constnet-type':'multipart/form-data',
          'Authorization':localStorage.token
        },
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
      //获取文章列表
      getuserlist() {
        this.fullscreenLoading = true;
        this.$http.get(http + fileMgr, {
          params: {
            originalFileName: this.inputValue,
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
          setTimeout(() => {
            this.fullscreenLoading = false;
          }, 2000);
        }, (error) => {
          this.$message.error(error.data.message)
        })
      },
      // 下载图片
      downloadPicture(val) {
        location.href = http + downloadfile + '?idFile=' + val.id + '&fileName=' + val.originalFileName
      },
      // 点击当前行事件
      rowClick(item) {
        // console.log(item)
        this.rowuser = item
      },
      // 功能按钮触发事件
      features(v) {
        // console.log(v)
        this.btnType = {
          [v]: true,
          classify: v
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

      },
      // 移除上传图片时的回调
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
      // 上传成功钩子
      success(res){
        // console.log(res)
        this.$message.success(res.msg)
        this.getuserlist()
      },
      // 上传失败钩子
      error(err){
        this.$message.error(err.msg)
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
