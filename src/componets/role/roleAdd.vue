<template>

    <el-dialog title="添加角色" :visible.sync="thisType" v-if="thisType" @close="clears">
      {{form.deptid}}
      <el-form :model="form" label-width="80px">
        <el-form-item label="角色名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="角色编码">
          <el-input v-model="form.tips"></el-input>
        </el-form-item>
        <el-form-item label="部门" v-if="depts">
          <el-cascader v-model="form.deptid" :options="depts" :props="deptarr" :show-all-levels="false">
          </el-cascader>
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
  import {http,deptlist,addrole} from '../../api/api.js'
  export default {
    computed:{
      ...mapState({
        // 当前登录的用户信息
        'infos': ({
          user
        }) => user.infos
      })
    },
    props: ['type'],
    watch:{
      type(){

          if(this.type.classify=='roleAdd'){
            this.thisType = this.type[this.type.classify]
          }
      }
    },
    data() {
      return {
        thisType: this.type[this.type.classify],
        form: {
          tips: '',
          name: '',
          deptid: '',
          num:0,
          pid:0
        },
        depts:[],
        deptarr:{value:'id',label:'fullname',children:'children'},
        item:{}

      }
    },
    methods:{
      // 获取部门二级联动信息
      getDept() {
        this.$http.get(http+deptlist).then((res)=>{
          if(res.status==200){
            console.log(res.data.data)
            this.depts = this.changedept(res.data.data)
          }else{
            this.$message.error(res.data.msg)
          }
        },(err)=>{
          this.$message.error(err.data.message)
        })
      },
      // 优化部门数据结构
      changedept(value){
        value.forEach((item)=>{
          if(item.children.length==0){
            item.children = null
          }else{
            this.changedept(item.children)
          }
        })
        return value
      },
      // 获取选中部门信息
      deptinfo(val,id){
        val.forEach((item)=>{
          if(item.id==id){
            this.item = item
          }else{
            if(item.children!=null){
              this.deptinfo(item.children,id)
            }
          }
        })

      },
      // 添加角色
      addUserInfo(){
        let float = true
        for(let i in this.form){
          if(i=='num'||i=='pid'){
            continue
          }

            if(this.form[i]==''){
              float = false
            }

        }
        if(float){
          // 处理当前选中部门数据类型
          let len = this.form.deptid.length - 1
          this.form.deptid = this.form.deptid[len]
          // 调用获取当前部门对象
          this.deptinfo(this.depts,this.form.deptid)
          this.form.num = this.item.num
          this.form.pid = this.item.pid
          // 发送添加请求
           this.$http.post(http+addrole,JSON.stringify(this.form),{emulateJSON:true})
           .then((res)=>{
             if(res.status==200){
               console.log(res)
               this.$message.success('添加成功')
               this.thisType = !this.thisType
               // 添加成功数据后销毁临时数据
               this.form.num = null
               this.form.pid = null
               // 调用父组件事件
               this.$emit('clearObject')
             }else{
               this.$message.error(res.data.msg)
             }

           },(err)=>{
             this.$message.error(err.data.message)
           })
        }else{
          this.$message.error('请填写完整用户信息')
        }
      },
      // 对话框关闭回调
      clears(){
        for(let i in this.form){
          if(i=='sex'||i=='status'){
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
