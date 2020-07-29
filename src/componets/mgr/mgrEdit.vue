<template>
  <div class="modal">
    <el-dialog title="修改用户" :visible.sync="thisType" v-if="item" @close="clears">
      <el-form :model="form" label-width="40px">
        1111
        <el-form-item label="账户">
          <el-input v-model="form.account"></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="生日">
          <el-col :span="11">
            <el-date-picker v-model="form.birthday" type="date" placeholder="选择日期">
            </el-date-picker>
          </el-col>

        </el-form-item>

        <el-form-item label="性别">
          <el-radio-group v-model="form.sex">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="form.phone"></el-input>
        </el-form-item>
        <el-form-item label="部门" v-if="depts">
          <el-cascader v-model="form.deptid" :options="depts" :props="deptarr">
          </el-cascader>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="2">冻结</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="thisType = false">取 消</el-button>
        <el-button type="primary" @click="addUserInfo">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {mapMutations} from 'vuex'
  import {
    http,
    deptlist,
    user
  } from '../../api/api.js'
  export default {
    props: ['type', 'item'],
    watch: {
      type() {
        // 判断按钮类型
        if(this.type.classify=='mgrEdit'){
          //改变状态
          this.thisType = this.type[this.type.classify]
        }
      },
      item(){
        // 过滤修改的属性
        for(let i in this.item){
          if(i in this.form){
            this.form[i] = this.item[i]

          }
        }
      }
    },
    data() {
      return {
        thisType: this.type[this.type.classify],
        form: {
          account: '',
          password: '',
          name: '',
          birthday: '',
          sex: 1,
          email: '',
          phone: '',
          deptid: '',
          status: 1,
          id:''
        },
        depts: [],
        deptarr: {
          value: 'id',
          label: 'fullname',
          children: 'children'
        },
      }
    },
    methods: {
      // 获取部门二级联动信息
      getDept() {
        this.$http.get(http + deptlist).then((res) => {
          if(res.status==200){
            this.depts = this.changedept(res.data.data)
          }else{
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
      // 优化生日数据结构
      reBirthday(time){
        let date = new Date(time)
        date = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()
        this.form.birthday = date
      },
      // 修改用户信息
      addUserInfo() {
        let float = true
        for (let i in this.form) {
          if (this.form[i] == '') {
            float = false
          }
        }
        if (float) {
          // 判断部门数据是否为数组，是则取最后一个字符串
          if(this.form.deptid instanceof Array){
            if(this.form.deptid.length>1){
              let len = (this.form.deptid.length) - 1
              this.form.deptid = this.form.deptid[len] - 0
            }else{
              this.form.deptid = this.form.deptid.join('') - 0
            }
          }
          this.reBirthday(this.form.birthday)
          this.$http.post(http + user, this.form, {
              emulateJSON: true
            })
            .then((res) => {
              if(res.status==200){
                this.$message.success('修改成功')
                this.thisType = !this.thisType
                this.$emit('clearObject')
              }else{
                this.$message.error(res.data.msg)
              }
            }, (err) => {
              this.$message.error(err.data.message)
            })
        } else {
          this.$message.error('请填写完整用户信息')
        }
      },
      // 关闭对话框回调
      ...mapMutations(['getCurrentuser']),
      clears() {

        this.getCurrentuser('')

      }
    }
  }
</script>

<style>
</style>
