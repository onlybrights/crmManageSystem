import Vue from 'vue'
import VueRouter from 'vue-router'

import index from '../componets/index.vue'
import aside from '../componets/aside.vue'
import info from '../componets/info.vue'
import home from '../componets/home.vue'
import mgr from '../componets/mgr/mgr.vue'
import role from '../componets/role/role.vue'
import dept from '../componets/dept/dept.vue'
import menu from '../componets/menu/menu.vue'
import channel from '../componets/channel/channel.vue'
import articleEdit from '../componets/articelEdit/articleEdit.vue'
import article from '../componets/article/article.vue'
import fileMgr from '../componets/fileMgr/fileMgr.vue'
import dict from '../componets/dict/dict.vue'
Vue.use(VueRouter);

//关于路由重复的报错解决方案
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
const router = new VueRouter({
  routes: [

    {
      path: '/',
      component: index,
      redirect: '/home',
      children: [{
          path: '/home',
          component: home
        },
        {
          path: '/info',
          component: info
        },
        {
          path: '/mgr',
          component: mgr
        },
        {
          path: '/role',
          component: role
        },
        {
          path: '/dept',
          component: dept
        },
        {
          path: '/menu',
          component: menu
        },
        {
          path: '/channel',
          component: channel
        },
        {
          path: '/cms/articleEdit',
          component: articleEdit
        },
        {
          path: '/article',
          component: article
        },
        {
          path: '/fileMgr',
          component: fileMgr
        },
        {
          path: '/dict',
          component: dict
        }
      ]
    },
    {
      path: 'aside',
      component: aside
    }
  ]
})

export default router;
