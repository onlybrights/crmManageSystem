<template>
  <el-menu :default-active="$route.path" class="el-menu-vertical-demo" unique-opened v-if="roles" router>
    <el-menu-item index="/home">
      <i class="el-icon-house"></i>
      <span slot="title">首页</span>
    </el-menu-item>
    <el-submenu :index="item.path" v-for="(item,index) in menuList" :key="index" v-if="roles.indexOf(item.path)!==-1">

      <template slot="title">
        <i :class="icons[item.id]"></i>
        <span>{{item.name}}</span>
      </template>

      <el-menu-item :index="v.path" v-for="(v,i) in item.children" :key="i"
      v-if="roles.indexOf(v.path)!==-1">

        <i :class="icons[v.id]"></i>
        <span>{{v.name}}{{v.id}}</span>
      </el-menu-item>

    </el-submenu>
  </el-menu>
</template>

<script>
  import {http,listForRouter,info} from '../api/api.js'
  import {mapMutations,mapState} from 'vuex'
  export default{
    computed:{
      ...mapState({
        'roles':({user})=>user.roles
      })
    },
    data(){
      return{
        menuList:[],
        icons:{
          1:'el-icon-s-help',
          2:'el-icon-s-operation',
          4:'el-icon-s-custom',
          12:'el-icon-s-check',
          21:'el-icon-s-grid',
          17:'el-icon-s-order',
          22:'el-icon-collection',
          41:'el-icon-c-scale-to-original',
          46:'el-icon-edit-outline',
          42:'el-icon-tickets',
          45:'el-icon-folder',
        }
      }
    },
    mounted(){
      //获取动态导航数据
      this.getData();
      this.getrole();
    },
    methods:{
      //状态管理
      ...mapMutations(['getMenu','getInfo']),
      getData(){
        // 请求接口，获取所有导航
        this.$http.get(http+listForRouter).then((res)=>{
          if(res.status==200){
            this.menuList = res.data.data
            // console.log(this.menuList)
            this.getMenu(res.data.data)
          }else{
            this.$message.error(res.data.msg)
          }
        },(error)=>{
          this.$message.error(error.data.message)
        })
      },
      //获取用户权限导航
      getrole(){
        this.$http.get(http+info).then((res)=>{
          if(res.status==200){
            this.getInfo(res.data.data)
            // console.log(res.data.data)
          }else{
            this.$message.error(res.data.msg)
          }

        },(error)=>{
          this.$message.error(error.data.message)
        })
      }
    }
  }
</script>

<style scoped>
  ul.el-menu-vertical-demo.el-menu{
    height: 100vh;
  }

</style>
