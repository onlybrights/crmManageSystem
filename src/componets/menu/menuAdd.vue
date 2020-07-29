<template>

  <el-dialog title="添加菜单" :visible.sync="thisType" v-if="thisType" @opened="opens" @close="clears">
    {{item}}
    <el-form :model="form" label-width="80px">
      <el-form-item label="菜单名称">
        <el-input v-model="form.name" ></el-input>
      </el-form-item>
      <el-form-item label="编码">
        <el-input v-model="form.code"></el-input>
      </el-form-item>
      <el-form-item label="组件">
        <el-input v-model="form.component"></el-input>
      </el-form-item>
      <el-form-item label="是否是菜单" label-width="100px">
        <el-radio-group v-model="form.isMenu">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="链接">
        <el-input v-model="form.url"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-radio-group v-model="form.status">
          <el-radio :label="1">启用</el-radio>
          <el-radio :label="0">禁用</el-radio>
        </el-radio-group>
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
    addmenu
  } from '../../api/api.js'
  export default {
    computed: {
      ...mapState({
        // 当前登录的菜单信息
        'infos': ({
          user
        }) => user.infos
      })
    },
    props: ['type', 'item'],
    watch: {
      type() {
        if (this.type.classify == 'menuAdd') {
          this.thisType = this.type[this.type.classify]
        }
      }
    },
    data() {
      return {
        thisType: false,
        form: {
          name: '',
          code: '',
          component:'',
          ismenu:1,
          status:1,
          url:''
        }
      }
    },
    methods: {
      // 添加菜单
      addUserInfo() {
        let float = true
        for (let i in this.form) {
          if (this.form[i] == '') {
            console.log(i)
            float = false
          }
        }
        if (float) {
          this.form.num = 1
          // 发送添加请求
          this.$http.post(http + addmenu, JSON.stringify(this.form), {
              emulateJSON: true
            })
            .then((res) => {
              if (res.status == 200) {
                // 添加成功数据后销毁临时数据
                delete this.form.num
                delete this.form.pcode
                this.$message.success('添加成功')
                this.thisType = !this.thisType
                // 调用父组件事件
                this.$emit('clearObject')
              } else {
                this.$message.error(res.data.msg)
              }

            }, (err) => {
              console.log(err)
              this.$message.error(err.data.message)
            })
        } else {
          this.$message.error('请填写完整菜单信息')
        }
      },
      // 对话框打开回调
      opens() {

        if (this.item=="") {
          this.$message.info('您添加的是一级菜单')
          this.form.pcode = '0'
          console.log(this.form.pcode)
        } else {
          this.form.pcode = this.item.code
          if (this.item.levels==1) {
            this.$message.info('您添加的是二级菜单')
          } else if (this.item.levels == 2) {
            this.$message.info('您添加的是三级菜单')
          } else if (this.item.levels == 3) {
            this.$message.error('无法添加四级菜单')
          }
        }
      },
      // 对话框关闭回调
      clears() {
        for (let i in this.form) {
          if(i=='status'||i=='ismenu'){
            continue
          }
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
