<template>
 <div id="login">
   <el-form class="form" ref="form" :model="form" label-width="80px">
     <el-form-item label="用户名">
       <el-input v-model="form.username"></el-input>
     </el-form-item>
     <el-form-item label="密码">
       <el-input v-model="form.password" show-password></el-input>
     </el-form-item>
     <el-form-item>
       <el-button type="primary" @click="onSubmit">登录</el-button>
     </el-form-item>
   </el-form>
 </div>
</template>

<script>
  import {http,login} from './api/api.js'
  export default{
    data(){
      return{
        form:{
          username:'',
          password:''
        }
      }
    },
    methods:{
      onSubmit(){
        if(this.form.username===''){
          this.$message.error('用户名不能为空！')
        }else if(this.form.password===''){
          this.$message.error('密码不能为空！')
        }else{
          this.$http.post(http+login,this.form,{emulateJSON:true})
          .then((res)=>{
            if(res.data.msg!='用户名或密码错误'){
              this.$message.success(res.data.msg)
              localStorage.setItem('token',res.data.data.token)
              location.href = './'
            }else{
              this.$message.error(res.data.msg)
            }
          })
          .catch((error)=>{
            this.$message.error(error.data.msg)
          })
        }
      }
    }
  }
</script>

<style scoped="scoped">
form.el-form.form{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    width: 500px;

  }
</style>
