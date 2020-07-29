<template>
  <div class="home">
    <!-- 最大容器 -->
    <el-container class="g-container">
      <!-- 侧边栏 -->
      <el-aside style="width: 200px;">
		  <my-aside></my-aside>
      </el-aside>
      <!-- 侧边栏结束 -->
      <!-- 内部容器 -->
      <el-container>
        <!-- 头部 -->
        <el-header>
          <el-button type="info" plain @click="goinfo">{{infos.name}}</el-button>
        </el-header>
        <!-- 头部结束 -->
        <!-- 内容 -->
        <el-main>
          <router-view></router-view>
        </el-main>
        <!-- 内容结束 -->
      </el-container>
      <!-- 内部容器结束 -->
    </el-container>
    <!-- 最大容器结束 -->
  </div>
</template>

<script>
  import {mapState} from 'vuex'
	import myAside from './aside.vue'
	export default{
    computed:{
      ...mapState({
        'infos':({user})=>user.infos
      })
    },
		components:{
			myAside
		},
		data(){
			return{

			}
		},
    methods:{
      // 跳转到用户信息
      goinfo(){
        this.$router.push({path:'/info'})
      }
    }
	}
</script>

<style scope>
  .g-container {
    height: 100vh;
  }

  .el-header,
  .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: right;
    line-height: 60px;
  }

  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
  }

  body>.el-container {
    margin-bottom: 40px;
  }
</style>
