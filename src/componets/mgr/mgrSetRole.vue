<template>
  <div class="mgrSetRole">

    <el-dialog title="分配角色" :visible.sync="thisType" @close="clears">
      <el-form :model="form">
        <el-form-item label="用户名" label-width="120px">
          {{item.name}}
        </el-form-item>
        <el-form-item label="角色" label-width="120px">
          <el-select v-model="form.roles" placeholder="请选择角色">
            <el-option
            v-for="(item,index) in treeData"
            :key="index"
            :label="item.name"
            :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="thisType = false">取 消</el-button>
        <el-button type="primary" @click="setRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {mapState,mapMutations} from 'vuex'
  import {http,getrole,setrole} from '../../api/api.js'
  export default{
    computed:{
      // 获取当前登录用户的角色信息
      ...mapState({
        'infos':({user})=>user.infos
      })
    },
    props:['type','item'],
    watch:{
      type(){
        if(this.type.classify=='mgrSetRole'){
          this.thisType = this.type[this.type.classify]
        }
      },
      item(){
        this.form.roles = this.item.roleName
      }
    },
    data(){
      return{
        // 状态
        thisType:this.type[this.type.classify],
        // 表单绑定数据
        form:{
          roles:''
        },
        // 角色列表
        treeData:[]
      }
    },
    methods:{
      // 获取角色信息
      getroles(){
        this.$http.get(http+getrole,{
          params:{
            idUser:this.infos.id
          }
        })
        .then((res)=>{
          if(res.status==200){
            this.treeData = res.data.data.treeData
          }else{
            this.$message.error(res.data.msg)
          }

        },(err)=>{
          this.$message.error(err.data.message)
        })
      },
      // 分配角色
      setRole(){
        this.$http.get(http+setrole,{
          params:{
            userId:this.item.id,
            roleIds:this.form.roles
          }
        })
        .then((res)=>{
          if(res.status==200){
            // console.log(res)
            this.thisType = !this.thisType
            this.$message.success('分配成功')
            this.$emit('clearObject')
          }else{
            this.$message.error(res.data.msg)
          }

        },(err)=>{
          this.$message.error(err.data.message)
        })
      },
      // 关闭对话框回调
      ...mapMutations(['getCurrentuser']),
      clears(){
        this.getCurrentuser('')
      }
    }
  }
</script>

<style>
</style>
