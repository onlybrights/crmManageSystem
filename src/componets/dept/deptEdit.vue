<template>

    <el-dialog title="修改部门" :visible.sync="thisType" v-if="thisType" @opened="opens" @close="clears" >
      <el-form :model="form" label-width="80px">
        <el-form-item label="部门全称">
          <el-input v-model="form.fullname"></el-input>
        </el-form-item>
        <el-form-item label="部门简称">
          <el-input v-model="form.simplename"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="thisType = false">取 消</el-button>
        <el-button type="primary" @click="addUserInfo">确 定</el-button>
      </div>
    </el-dialog>

</template>

<script>
  import {mapState,mapMutations} from 'vuex'
  import {http,dept} from '../../api/api.js'
  export default {
    computed:{
      ...mapState({
        // 当前登录的用户信息
        'infos': ({
          user
        }) => user.infos
      })
    },
    props: ['type','item'],
    watch:{
      type(){
          if(this.type.classify=='deptEdit'){
            this.thisType = this.type[this.type.classify]
          }
      }
    },
    data() {
      return {
        thisType: false,
        form: {
          fullname: '',
          simplename: ''
        }
      }
    },
    methods:{
      // 修改部门
      addUserInfo(){
        let float = true
        for(let i in this.form){
            if(this.form[i]==''){
              console.log(i)
              float = false
            }
        }
        if(float){
          this.form.pid = parseInt(this.item.pid)
          this.form.num = parseInt(this.item.num)
          this.form.id = parseInt(this.item.id)
          // 发送修改请求
           this.$http.post(http+dept,JSON.stringify(this.form),{emulateJSON:true})
           .then((res)=>{
             if(res.status==200){
               // 添加成功数据后销毁临时数据
               delete this.form.num
               delete this.form.pid
               delete this.form.id
               this.$message.success('修改成功')
               this.thisType = !this.thisType
               // 调用父组件事件
               this.$emit('clearObject')
             }else{
               this.$message.error(res.data.msg)
             }

           },(err)=>{
             console.log(err)
             this.$message.error(err.data.message)
           })
        }else{
          this.$message.error('请填写完整用户信息')
        }
      },
      // 对话框打开回调
      opens(){
        //获取当前选中部门信息
        for(let i in this.item){
          if(i in this.form){
            this.form[i] = this.item[i]
          }
        }
      },
      // 对话框关闭回调
      clears(){
        for(let i in this.form){

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
