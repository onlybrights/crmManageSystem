import Vue from 'vue'
import App from './App.vue'
import router from './router/router.js'
import store from './store/index.js'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import echarts from 'echarts'
import myBread from './componets/common/myBread.vue'

Vue.component('my-bread',myBread)


//类似axios
import resource from 'vue-resource'
//在Vue的原型上添加echars
Vue.prototype.$echarts = echarts

Vue.use(resource)
Vue.use(ElementUI);

//判断是否登录
// 拦截器
Vue.http.interceptors.push((request,next)=>{
  if(localStorage.token){
    Vue.http.headers.common['Authorization'] = localStorage.token
  }else{
    location.href = './login.html'
  }

  next((response)=>{
    // 判断token是否过期
    if(response.status==401){
      location.href = './login.html'
    }else{
      return response
    }
  })
})

new Vue({
  store,
  router,
  el: '#app',
  render: h => h(App)
})
