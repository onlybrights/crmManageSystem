<template>
  <el-dialog title="添加字典" :visible.sync="thisType" v-if="thisType" @close="clears">
    <el-form :model="form" label-width="80px">
      <el-form-item label="字典名称">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <div v-show="selects.length">
        <el-form-item label="字典详情"></el-form-item>
        <el-row :gutter="20" v-for="(item,$index) in selects" :key="$index">
          <el-col :span="8">
            <el-form-item label="状态码">
              <el-input v-model="selects[$index].status"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="状态值">
              <el-input v-model="selects[$index].content"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-button plain type="danger" @click="selects.splice($index,1)">移除</el-button>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="pushSelect(selects)">添加字典详情</el-button>
      <el-button type="primary" @click="addUserInfo">确 定</el-button>
    </div>
  </el-dialog>

</template>

<script>
  import {
    mapState,
    mapMutations
  } from 'vuex'
  import {
    http,
    dict
  } from '../../api/api.js'
  export default {
    computed: {
      ...mapState({
        // 当前登录的用户信息
        'infos': ({
          user
        }) => user.infos
      })
    },
    props: ['type', 'item'],
    watch: {
      type() {

        if (this.type.classify == 'dictAdd') {
          this.thisType = this.type[this.type.classify]
        }
      }
    },
    data() {
      return {
        thisType: this.type[this.type.classify],
        form:{
          name:''
        },
        selects:[],
        value:'',
        dictValues:''
      }
    },
    methods: {

      // 添加字典
      addUserInfo() {
        let float = true
        for (let i in this.form) {
          if (this.form[i] == '') {
            float = false
          }
        }
        if (float) {
          this.reSelects(this.selects)
          // 发送添加请求
          this.$http.post(http + dict+`?dictName=${this.form.name}&dictValues=${this.dictValues}`)
            .then((res) => {
              if (res.status == 200) {
                console.log(res)
                this.$message.success('添加成功')
                this.thisType = !this.thisType
                // 调用父组件事件
                this.$emit('clearObject')
              } else {
                this.$message.error(res.data.msg)
              }
            }, (err) => {
              this.$message.error(err.data.message)
            })
        } else {
          this.$message.error('请填写完整用户信息')
        }
      },
      // 添加字典详情
      pushSelect(data){
        data.push({status:'',content:''})
      },
      // 格式化字典详情数据
      reSelects(data){
        let str = ''
        data.forEach((item)=>{
          str+=item.status+':'+item.content+';'
        })
        this.dictValues = str
      },
      // 对话框关闭回调
      clears() {
        for (let i in this.form) {
          this.form[i] = ''
        }
        this.selects = []
        this.getCurrentuser('')
      },
      ...mapMutations(['getCurrentuser'])
    }
  }
</script>

<style>
</style>
