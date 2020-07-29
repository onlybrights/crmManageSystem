<template>
  <div v-loading="fullscreenLoading">
    <el-card class="bread">
      <my-bread level1="CMS管理" level2="新建文章"></my-bread>
    </el-card>
    <el-card>
      <el-form :inline="true" :model="form" class="demo-form-inline">
        <el-form-item label="标题">
          <el-input v-model="form.title" placeholder="标题"></el-input>
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="form.region" placeholder="栏目列表" v-if="selectData">
            <el-option class="select" v-for="(item,index) in selectData" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">提交</el-button>
        </el-form-item>
      </el-form>
      <div ref="editors" class="editors">

      </div>
    </el-card>
  </div>

</template>

<script>
  // 富文本编辑器
  import wangeditor from 'wangeditor'
  import {
    mapState
  } from 'vuex'
  import {
    http,
    list,
    file,
    addarticle
  } from '../../api/api.js'
  export default {
    computed: {
      ...mapState({
        'infos': ({
          user
        }) => user.infos
      })
    },
    data() {
      return {
        form: {
          title: '',
          region: ''
        },
        selectData: [],
        editor: {},
        fullscreenLoading:false
      }
    },
    mounted() {
      this.getChannelList()
      this.fullscreenLoading = true;
      

      // 创建富文本编辑器
      this.editor = new wangeditor(this.$refs.editors)
      // 隐藏“网络图片”tab
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
              // console.log(res)
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
      setTimeout(() => {
        this.fullscreenLoading = false;
      }, 2000);
    },
    methods: {
      // 获取栏目列表
      getChannelList() {
        this.$http.get(http + list)
          .then((res) => {
            this.selectData = res.data.data
            // console.log(this.selectData)
          }, (err) => {
            this.$message.error(err.data.message)
          })
      },
      // 提交文章
      onSubmit() {
        let json = {
          author: this.infos.name,
          content: this.editor.txt.text().replace(/\%/g, '%25'),
          idChannel: this.form.region,
          Title: this.form.title
        }
        let type = true
        for (let i in json) {
          if (json[i] == '') {
            type = false
          }
        }
        if (type) {
          this.$http.post(http + addarticle, JSON.stringify(json))
            .then((res) => {
              // console.log(res)
            }, (err) => {
              this.$message.error(res.data.message)
            })
        } else {
          this.$message.error('请填写完整信息')
        }

      }
    }
  }
</script>

<style scoped="scoped">
  .select {
    position: relative;
    z-index: 2;
  }

  .editors {
    position: relative;
    z-index: 1;
  }
</style>
