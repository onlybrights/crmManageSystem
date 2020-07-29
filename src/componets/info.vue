<template>
  <div class="info">
	  <el-card class="bread">
		  <my-bread level1="用户信息"></my-bread>
	  </el-card>
    <el-card class="box-card">

      <div class="text item">
        账户：{{infos.account}}
        <el-button class="close" size="mini" type="danger" plain @click="close">退出</el-button>
      </div>
      <div class="text item">
        修改密码：<a href="javascript:;" @click="dialogFormVisiblePwd=true">修改密码</a>
      </div>
      <div class="text item">
        用户名：{{infos.name}}
      </div>
      <div class="text item">
        生日：{{infos.birthday}}
      </div>
      <div class="text item">
        性别：{{infos.sex==1?'男':'女'}}
      </div>
      <div class="text item">
        邮箱：{{infos.email}}
      </div>
      <div class="text item">
        电话：{{infos.phone}}
      </div>
      <div class="text item">
        部门：{{infos.dept}}
      </div>
    </el-card>

    <!-- 修改密码对话框 -->
    <el-dialog title="修改密码" :visible.sync="dialogFormVisiblePwd" @close='clear'>
      <el-form :model="form">
        <el-form-item label="旧密码" :label-width="formLabelWidth">
          <el-input v-model="form.oldPassword" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" :label-width="formLabelWidth">
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="重复密码" :label-width="formLabelWidth">
          <el-input v-model="form.rePassword" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改密码对话框结束 -->
  </div>
</template>

<script>
  import {http,updatePwd} from '../api/api.js'
  import {mapState} from 'vuex'
  export default{
    computed:{
      ...mapState({
        'infos':({user})=>user.infos
      })
    },
    data(){
      return{
        dialogFormVisiblePwd:false,
        formLabelWidth:"120px",
        form:{
          oldPassword:'',
          password:'',
          rePassword:''
        },

      }
    },
    methods:{
      // 修改密码
      onSubmit(){
        if(this.form.oldPassword==''){
          this.$message.error('请输入旧密码')
        }else if(this.form.password==''){
          this.$message.error('请输入新密码')
        }else if(this.form.rePassword==''){
          this.$message.error('请再次输入密码')
        }else if(this.form.password!=this.form.rePassword){
          this.$message.error('两次密码不一致')
        }else{
          this.$http.post(http+updatePwd,this.form,{emulateJSON:true})
          .then((res)=>{
            console.log(res)
            if(res.status==200){
              this.$message.success('修改成功')
            }else if(res.data.msg=="不能修改超级管理员密码"){
              this.$message.error(res.data.msg)
            }
            this.dialogFormVisiblePwd = false
          },(error)=>{
            this.$message.error(error.data.message)
          })
        }
      },
      //关闭对话框清空数据
      clear(){
        for(var i in this.form){
          this.form[i] = ''
        }
      },
      //退出登录
      close(){
        localStorage.clear()
        this.infos = ''
        location.href = './login.html'
      }
    }
  }
</script>

<style scoped>
  div.text.item{
    padding: 10px 0;
  }
  div.el-card__body{
    padding: 10px;
  }
  .text {
      font-size: 14px;
    }

    .item {
      padding: 18px 0;
    }

    .box-card {
      width: 480px;
    }
    .close{
      margin-left: 50px;
    }
</style>
