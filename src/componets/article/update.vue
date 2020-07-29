<template>

  <el-dialog title="修改文章" :visible.sync="thisType" v-if="thisType" @close="clears" @opened="opens">
    <el-form :model="form" label-width="80px" :inline="true">
      <el-form-item label="文章标题">
        <el-input v-model="form.title" style="width: 120px;"></el-input>
      </el-form-item>
      <el-form-item label="分类" label-width="80px">
        <el-select v-model="form.region" placeholder="栏目列表" v-if="selectData" style="width: 140px;">
          <el-option class="select" v-for="(item,index) in selectData" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div ref="updateEditor" class="editors"></div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="thisType = false">取 消</el-button>
      <el-button type="primary" @click="addUserInfo">确 定</el-button>
    </div>
  </el-dialog>

</template>

<script>
  // 富文本编辑器
  import wangeditor from 'wangeditor'
  import {
    mapState,
    mapMutations
  } from 'vuex'
  import {
    http,
    addarticle,
    list,
    file
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
        if (this.type.classify == 'update') {
          this.thisType = this.type[this.type.classify]
        }
      }
    },
    data() {
      return {
        thisType: this.type[this.type.classify],
        form: {
          title: '',
          region: ''
        },
        selectData: '',
        editor: {}
      }
    },
    methods: {
      // 获取栏目列表
      getChannelList() {
        this.$http.get(http + list)
          .then((res) => {
            this.selectData = res.data.data
            console.log(this.selectData)
          }, (err) => {
            this.$message.error(err.data.message)
          })
      },
      // 修改文章
      addUserInfo() {
        let json = {
          title: this.form.title,
          content:this.editor.txt.html().replace(/\%/g,'%25'),
          author:this.item.author,
          id:this.item.id,
          idChannel:this.form.region
        }
        let float = true
        for (let i in json) {
          if (json[i] == '') {
            float = false
          }
        }
        if (float) {
          // 发送添加请求
          this.$http.post(http + addarticle, JSON.stringify(json), {
              emulateJSON: true
            })
            .then((res) => {
              if (res.status == 200) {
                console.log(res)
                this.$message.success('修改成功')
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
      // 打开对话框的回调
      opens() {
        this.form.region = this.item.idChannel
        this.getChannelList()
        for (let i in this.item) {
          if (i in this.form) {
            this.form[i] = this.item[i]
          }
        }
        this.$nextTick(() => {
          this.editor = new wangeditor(this.$refs.updateEditor)
          // 隐藏“ 网络图片” tab
          this.editor.customConfig.showLinkImg = false
          // 图片上传路径
          this.editor.customConfig.uploadImgServer = '/file'
          // 限制上装图片张数
          this.editor.customConfig.uploadImgMaxLength = 1
          this.editor.customConfig.uploadImgTimeout = 50000;
          // 自定义上传图片事件
          this.editor.customConfig.debug = true
          this.editor.customConfig.customUploadImg = (files, insert) => {
            // files 是 input 中选中的文件列表
            // insert 是获取图片 url 后，插入到编辑器的方法
            let f = files[0]
            let d = new FormData
            d.append('file', f)
            // 发送请求
            this.$http.post(http + file, d, {
                // 设置请求头
                headers: {
                  'constnet-type': 'multipart/form-data',
                  'Authorization': localStorage.token
                }
              })
              .then((res) => {
                if (res.status == 200) {
                  console.log(res)
                  let imgUrl = 'http://39.101.217.150/static/' + res.data.data.originalFileName
                  // 上传代码返回图片URL之后，将图片插入到编辑器中
                  insert(imgUrl)
                } else {
                  this.$message.error(res.data.msg)
                }
              }, (err) => {
                this.$message.error(err.data.message)
              })
          }
          this.editor.create()
          this.editor.txt.html(this.item.content)
        })
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

<style scoped>
  .select {
    position: relative;
    z-index: 2;
  }

  .editors {
    position: relative;
    z-index: 1;
  }
</style>
