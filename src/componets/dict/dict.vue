<template>
  <div class="dict" v-loading="fullscreenLoading">
    <el-card class="bread">
      <my-bread level1="系统管理" level2="字典管理"></my-bread>
    </el-card>
    <el-card>
      <el-button class="addBtn" plain v-for="(item,index) in json['/dict']" :key="index" @click="features(item.code)"
        v-if="item.status==1">{{item.name}}</el-button>
      <div class="search">
        <el-input placeholder="请输入内容" v-model="inputValue" class="input-with-select" clearable style="width: 400px;"
          @clear="clearSearch">
          <el-button slot="append" icon="el-icon-search" @click="changeinput"></el-button>
        </el-input>
      </div>
      <el-table :data="tableData" style="width: 100%;margin-bottom: 20px;" row-key="id" highlight-current-row :tree-props="{children: 'children'}" @row-click="rowClick($event)">
        <el-table-column prop="name" label="字典名称">
        </el-table-column>
        <el-table-column prop="detail" label="字典详情">
        </el-table-column>
        <el-table-column prop="id" label="字典id">
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 模态框 -->
    <!-- 添加字典 -->
    <dictAdd ref="dictAdd" :type="btnType" @clearObject="clearObject" :item="tableData"></dictAdd>

    <!-- 修改字典 -->
    <dictEdit ref="dictEdit" :type="btnType" @clearObject="clearObject" :item="rowuser"></dictEdit>

    <!-- 删除字典 -->
    <dictDelete ref="dictDelete" :type="btnType" @clearObject="clearObject" :item="rowuser"></dictDelete>

    <!-- 模态框结束 -->
  </div>
</template>

<script>
  import dictAdd from './dictAdd.vue'
  import dictEdit from './dictEdit.vue'
  import dictDelete from './dictDelete.vue'
  import {
    mapMutations,
    mapState
  } from 'vuex'
  import {
    http,
    menulist,
    dictlist
  } from '../../api/api.js'
  export default {
    components: {
      dictAdd,
      dictEdit,
      dictDelete
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
        inputValue:'',
        fullscreenLoading:false
      }
    },
    mounted() {
      this.getmenulist()
      this.getdictlist()
    },
    methods: {
      //把功能项存到vuex
      ...mapMutations(['getFeatures', 'getCurrentuser']),
      // 获取字典功能项
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
      //获取字典列表
      getdictlist() {
        this.fullscreenLoading = true;
        this.$http.get(http + dictlist, {
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
        if (v === 'dictAdd') {
          this.btnType = {
            [v]: true,
            classify: v
          }
        } else {
          if (this.rowuser == '') {
            this.$message.error('请选择字典')
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
      dictmodal(val, type) {
        // console.log(type)
        this.btnType = {
          [type]: true,
          classify: type
        }
        this.$refs.dictEdit.getdict()
      },
      // 关闭对话框
      clearObject() {
        // 关闭对话框之后更新数据
        this.getdictlist()
        // 关闭对话框之后清空当前选择的用户
        this.rowuser = ''
      },
      // 清空搜索框回调
      clearSearch(){
        this.page = 1
        this.getdictlist()
      },
      // 搜索关键词
      changeinput(){
        if(this.inputValue==''){
          this.$message.error('请输入关键词')
        }else{
          this.page = 1
          this.getdictlist()
        }
      }
    }
  }
</script>

<style scoped>
  .search{
    margin-top: 20px;
  }
</style>
