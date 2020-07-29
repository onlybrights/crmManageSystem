<template>
  <div class="channelDelete">
    <el-dialog title="提示" :visible.sync="thisType" width="30%" @close='clear'>
      <span>确定要删除 {{item.title}} 文章吗</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="thisType = false">取 消</el-button>
        <el-button type="primary" @click="mgrdelete">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {
    mapMutations
  } from 'vuex'
  import {
    http,
    addarticle
  } from '../../api/api.js'
  export default {

    props: ['type', 'item'],
    watch: {
      type() {
        if (this.type.classify == 'deleteArticle') {
          this.thisType = this.type[this.type.classify]
        }
      }
    },
    data() {
      return {
        thisType: this.type[this.type.classify]
      }
    },
    methods: {
      // 删除栏目
      mgrdelete() {
        this.$http.delete(http + addarticle, {
            params: {
              id: this.item.id
            }
          })
          .then((res) => {
            if (res.status == 200) {
              if (res.code == 9999) {
                this.$message.error(res.data.msg)
              } else {
                console.log(res)
                this.thisType = !this.thisType
                this.$message.success('删除成功')
                this.$emit('clearObject')
              }
            } else {
              this.$message.error(res.data.msg)
            }

          }, (err) => {
            this.$message.error(err.data.message)
          })
      },
      // 关闭对话框回调
      ...mapMutations(['getCurrentuser']),
      clear() {
        this.getCurrentuser('')
      }
    }
  }
</script>

<style>
</style>
