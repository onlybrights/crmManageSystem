<template>
  <el-dialog title="添加角色" :visible.sync="thisType" v-if="thisType" @close="clears">
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
	import {mapMutations} from 'vuex'
  import {
    http,
    deptlist,
    addrole
  } from '../../api/api.js'
  export default {
    props: ['type', 'item'],
    watch: {
      type() {
        // 判断按钮类型
        if (this.type.classify == 'roleEdit') {
          //改变状态
          this.thisType = this.type[this.type.classify]

        }

      },
      item(){
        // 过滤修改的属性
        for (let i in this.item) {
          if (i in this.form) {
            this.form[i] = this.item[i]
          }
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
          pid:0,
          id:0
        },
        depts:[],
        deptarr:{value:'id',label:'fullname',children:'children'},
        role:{}
      }
    },
    methods: {
      // 获取部门二级联动信息
      getDept() {
        this.$http.get(http + deptlist).then((res) => {
          if (res.status == 200) {
            this.depts = this.changedept(res.data.data)
          } else {
            this.$message.error(res.data.msg)
          }


        }, (err) => {
          this.$message.error(err.data.message)
        })
      },
      // 优化部门数据
      changedept(value) {
        value.forEach((item) => {
          if (item.children.length == 0) {
            item.children = null
          } else {
            this.changedept(item.children)
          }
        })
        return value
      },
      // 获取选中部门信息
      deptinfo(val,id){
        val.forEach((item)=>{
          if(item.id==id){
            this.role = item
          }else{
            if(item.children!=null){
              this.deptinfo(item.children,id)
            }
          }
        })
      },
      // 修改角色信息
      addUserInfo() {
        let float = true
        for (let i in this.form) {
          if(this.form[i]==0){
            continue
          }
          if (this.form[i] == '') {
            console.log(i,this.form[i])
            float = false
          }
        }
        if (float) {
          let len = (this.form.deptid.length) - 1
          this.form.deptid = this.form.deptid[len]
          this.deptinfo(this.depts,this.form.deptid)
          this.form.num = this.role.num
          this.form.pid = this.role.pid
          this.form.id = this.role.id
          this.$http.post(http + addrole, JSON.stringify(this.form), {
              emulateJSON: true
            })
            .then((res) => {
              if (res.status == 200) {
                console.log(res)
                this.$message.success('修改成功')
                this.$emit('clearObject')
                this.thisType = !this.thisType
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
