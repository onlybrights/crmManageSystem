import Vue from 'vue'
import Vuex from 'vuex'
import nav from './modules/nav.js'
import user from './modules/user.js'
Vue.use(Vuex)




export default new Vuex.Store({

  modules:{
    nav,
    user
  }

})
