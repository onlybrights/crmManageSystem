<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item v-if="level1">{{level1}}</el-breadcrumb-item>
    <el-breadcrumb-item v-if="level2">{{level2}}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
  export default{
    props:['level1','level2'],

    data(){
      return{

      }
    }
  }
</script>

<style>
</style>
