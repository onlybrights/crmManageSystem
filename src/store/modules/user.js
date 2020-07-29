export default{
  state:{
    // 每个角色的导航权限
    roles:[],
    // 每个用户的登录信息
    infos:'',
    // 每个角色的功能
    features:{},
    // 当前被选中的用户信息
    currentUser:''
  },
  getters:{

  },
  mutations:{
    getInfo(state,data){
      // 每个角色的导航权限
      state.roles = data.permissions
      // 每个用户的登录信息
      state.infos = data.profile
    },

    getFeatures(state,data){
      // 每个角色的功能
      state.features = data
    },

    getCurrentuser(state,data){
      state.currentUser = data
    }
  },
  actions:{

  }
}
