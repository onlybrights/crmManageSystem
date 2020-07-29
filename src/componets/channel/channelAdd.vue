<template>

  <el-dialog title="添加栏目" :visible.sync="thisType" v-if="thisType" @close="clears">
    {{form.deptid}}
    <el-form :model="form" label-width="80px">
      <el-form-item label="分类名称">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="分类编码">
        <el-input v-model="form.code"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="thisType = false">取 消</el-button>
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
    channel
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
    props: ['type'],
    watch: {
      type() {

        if (this.type.classify == 'channeladd') {
          this.thisType = this.type[this.type.classify]
        }
      }
    },
    data() {
      return {
        thisType: this.type[this.type.classify],
        form: {
          code: '',
          name: ''

        }
      }
    },
    methods: {

      // 添加栏目
      addUserInfo() {
        let float = true
        for (let i in this.form) {
          if (this.form[i] == '') {
            float = false
          }

        }
        if (float) {

          // 发送添加请求
          this.$http.post(http + channel,this.form, {
              emulateJSON: true
            })
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
      // 对话框关闭回调
      clears() {
        for (let i in this.form) {
          this.form[i] = ''
        }
        this.getCurrentuser('')
      },
      ...mapMutations(['getCurrentuser'])
    }
  }
</script>

<style>
</style>
