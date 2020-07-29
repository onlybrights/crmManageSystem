<template>
  <el-dialog title="分配权限" :visible.sync="thisType" width="30%" @opened="opens" @close="clears" v-if="treeData">
    <el-tree ref="tree" :data="treeData" show-checkbox node-key="id" :default-expanded-keys="checkedIds" :default-checked-keys="checkedIds"
      :props="defaultProps">
    </el-tree>
    <span slot="footer" class="dialog-footer">
      <el-button @click="thisType = false">取 消</el-button>
      <el-button type="primary" @click="setRoleTree">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {
    mapMutations
  } from 'vuex'
  import {
    http,
    setauthority,
    setpermisson
  } from '../../api/api.js'
  export default {
    props: ['type', 'item'],
    watch: {
      type() {
        // 判断按钮类型
        if (this.type.classify == 'roleSetAuthority') {
          //改变状态
          this.thisType = this.type[this.type.classify]

        }

      }
    },
    data() {
      return {
        thisType: this.type[this.type.classify],
        id: 0,
        checkedIds:[],
        treeData:[],
        defaultProps:{
          children:'children',
          label:'name'
        }
      }
    },
    methods: {
      // 获取角色树
      addUserInfo() {

          this.$http.get(http + setauthority,{
            params:{
              roleId:this.item.id
            }
          })
            .then((res) => {
              if (res.status == 200) {
                console.log(res)
                this.checkedIds = res.data.data.checkedIds
                this.treeData = res.data.data.treeData
                // this.$message.success('修改成功')
                // this.$emit('clearObject')
                // this.thisType = !this.thisType
              } else {
                this.$message.error(res.data.msg)
              }


            }, (err) => {
              this.$message.error(err.data.message)
            })
      },
      // 分配角色树
      setRoleTree(){
        // 获取全选状态及半选状态的数组
        let checkedAll = this.$refs.tree.getCheckedKeys()
        let checkedHalf = this.$refs.tree.getHalfCheckedKeys()
        let arrChecked = [...checkedAll,...checkedHalf]
        this.$http.post(http+setpermisson,{
            roleId:this.item.id,
            permissions:arrChecked.join(',')
        },{emulateJSON:true})
        .then((res)=>{
          if(res.status==200){
            this.$message.success('分配成功')
            this.thisType = !this.thisType
            this.$emit('clearObject')
          }else{
            this.$message.error(res.data.msg)
          }
          
        },(err)=>{
          this.$message.error(err.data.message)
        })
      },

      // 对话框打开完成回调
      opens(){
        this.addUserInfo()
      },
      // 对话框关闭回调
      clears() {
        this.getCurrentuser('')

      },
      ...mapMutations(['getCurrentuser'])
    }
  }
</script>

<style>
</style>
