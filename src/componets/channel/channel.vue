<template>
  <div v-loading="fullscreenLoading">
    <el-card class="bread">
      <my-bread level1="CMS管理" level2="栏目管理"></my-bread>
    </el-card>
    <el-card>
      <el-button class="addBtn" plain v-for="(item,index) in json['/channel']" :key="index" @click="features(item.code)"
        v-if="item.status==1">{{item.name}}</el-button>
      <el-table :data="tableData" style="width: 100%" highlight-current-row @row-click="rowClick($event)">
        <el-table-column prop="name" label="分类名称">
        </el-table-column>
        <el-table-column prop="code" label="类型编码">
        </el-table-column>
        <el-table-column prop="id" label="分类id">
        </el-table-column>
        <el-table-column prop="modifyTime" label="更新时间">
        </el-table-column>
      </el-table>
      <!-- 模态框 -->
      <!-- 添加栏目 -->
      <channelAdd ref="channelAdd" :type="btnType" @clearObject="clearObject"></channelAdd>

      <!-- 修改栏目 -->
      <channelEdit ref="channelEdit" :type="btnType" @clearObject="clearObject" :item="rowuser"></channelEdit>

      <!-- 删除栏目 -->
      <channelDelete ref="channelDelete" :type="btnType" @clearObject="clearObject" :item="rowuser"></channelDelete>

      <!-- 模态框结束 -->
    </el-card>
  </div>
</template>

<script>
  import channelAdd from './channelAdd.vue'
  import channelEdit from './channelEdit.vue'
  import channelDelete from './channelDelete.vue'
  import {
    mapMutations,
    mapState
  } from 'vuex'
  import {
    http,
    menulist,
    list
  } from '../../api/api.js'
  export default {
    components: {
      channelAdd,
      channelEdit,
      channelDelete
    },
    watch: {
      currentUser() {
        this.rowuser = this.currentUser
      },
    },
    computed: {
      ...mapState({
        // 当前选中的角色
        'currentUser': ({
          user
        }) => user.currentUser
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
      this.getchannellist()
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
      //获取栏目列表
      getchannellist() {
        this.fullscreenLoading = true;
        this.$http.get(http + list, ).then((res) => {
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
        if (v === 'channeladd') {
          this.btnType = {
            [v]: true,
            classify: v
          }
        } else {
          if (this.rowuser == '') {
            this.$message.error('请选择栏目')
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
      channelmodal(val, type) {
        // console.log(type)
        this.btnType = {
          [type]: true,
          classify: type
        }
      },

      // 关闭对话框
      clearObject() {
        // 关闭对话框之后更新数据
        this.getchannellist()
        // 关闭对话框之后清空当前选择的栏目
        this.rowuser = ''

      }
    }
  }

</script>

<style>
</style>
