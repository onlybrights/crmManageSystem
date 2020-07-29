import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import login from './login.vue'
import resource from 'vue-resource'
import router from './router/router.js'

Vue.use(resource)
Vue.use(ElementUI);

new Vue({
  router,
  el: '#login',
  render: h => h(login)
})
