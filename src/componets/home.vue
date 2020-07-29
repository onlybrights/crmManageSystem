<template>

      <el-card id="home" ref='myecharts' class="home" v-loading="fullscreenLoading">

      </el-card>


</template>

<script>
  import {
    http,
    list,
    articlebychannel
  } from '../api/api.js'
  export default {
    data() {
      return {
        fullscreenLoading:false
      }
    },
    mounted() {
      this.useEcharts()
    },
    methods: {
      //useEcharts

      useEcharts() {
        this.fullscreenLoading = true
        let arrClassify = []
        let arrNum = []
        Promise.all([
          this.$http.get(http + list),
          this.$http.get(http + articlebychannel)
        ]).then((res) => {
          arrClassify = res[0].data.data.map((item) => {
            return item.name
          })
          arrNum = res[1].data.data.map((item) => {
            return item.articles
          })
          this.demo(arrClassify, arrNum)
        }).catch((err) => {

        })
      },
      //echarts文档模板
      demo(arrClassify, arrNum) {
        let myechars = this.$echarts.init(document.getElementById('home'))
        let option = {
          title: {
            text: '文章统计'
          },
          color: ['#3398DB'],
          tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
              type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [{
            type: 'category',
            data: arrClassify,
            axisTick: {
              alignWithLabel: true
            }
          }],
          yAxis: [{
            type: 'value'
          }],
          series: [{
            name: '直接访问',
            type: 'bar',
            barWidth: '60%',
            data: arrNum
          }]
        };
        myechars.setOption(option);
        setTimeout(() => {
          this.fullscreenLoading = false;
        }, 2000);
      }
    }
  }
</script>

<style scoped>
  .home {
    width: 480px;
    height: 300px;
  }
  .bread{
    margin-bottom: 20px;
  }
</style>
