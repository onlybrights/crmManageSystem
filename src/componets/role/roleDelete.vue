<template>
  <div class="roleDelete">
    <el-dialog
      title="提示"
      :visible.sync="thisType"
      width="30%"
      @close='clear'>
      <span>确定要删除 {{item.name}} 角色吗</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="thisType = false">取 消</el-button>
        <el-button type="primary" @click="mgrdelete">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {mapMutations} from 'vuex'
  import {http,addrole} from '../../api/api.js'
  export default{

    props:['type','item'],
    watch:{
      type(){
        if(this.type.classify=='roleDelete'){
          this.thisType = this.type[this.type.classify]
        }
      }
    },
    data(){
      return{
        thisType:this.type[this.type.classify]
      }
    },
    methods:{
      // 删除角色
      mgrdelete(){
        this.$http.delete(http+addrole,{
          params:{
            roleId:this.item.id
          }
        })
        .then((res)=>{
          if(res.status==200){
            if(res.code==9999){
              this.$message.error(res.data.msg)
            }else{
              console.log(res)
              this.thisType = !this.thisType
              this.$emit('clearObject')
              this.$message.success('删除成功')
            }
          }else{
            this.$message.error(res.data.msg)
          }

        },(err)=>{
          this.$message.error(err.data.message)
        })
      },
      // 关闭对话框回调
      ...mapMutations(['getCurrentuser']),
      clear(){
        this.getCurrentuser('')
      }
    }
  }
</script>

<style>
</style>
