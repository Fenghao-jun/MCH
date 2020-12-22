import Vue from 'vue'
import Router from 'vue-router'

import Login from "../pages/Login"
import Register from "../pages/Register"
import {Message} from "element-ui";

//MTCA网管软件
import PortManagement from '../pages/management/PortManagement.vue';
import VLANManagement from '../pages/management/VLANManagement.vue';
import test from '../pages/management/test.vue';
import home from '../pages/home/home.vue';
import PowerManagement from '../pages/control/power.vue';
import SystemLog from '../pages/log/SystemLog.vue';
import OperationLog from '../pages/log/OperationLog.vue';
import User from '../pages/user/User.vue';
import UserManagement from "../pages/user/UserManagement";
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
Vue.use(Router)
const routes = [
    {
      path: '/',
      redirect: '/Login',
      component: Login,
      children: [ ]
    },
    {
      path: '/Login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/Register',
      name: 'Register',
      component: Register,
    },

    //
    //MTCA网管软件
    {
        path: '/PortManagement',
        name: 'PortManagement',
        component: PortManagement
    },
    {
        path: '/VLANManagement',
        name: 'VLANManagement',
        component: VLANManagement
    },
    {
      path: '/test',
      name: 'test',
      component: test
    },
    {
      path: '/home',
      name: 'home',
      component: home
    },
    {
      path: '/PowerManagement',
      name: 'PowerManagement',
      component: PowerManagement
    },
    {
      path: '/SystemLog',
      name: 'SystemLog',
      component: SystemLog
    },
    {
      path: '/OperationLog',
      name: 'OperationLog',
      component: OperationLog
    },
    {
      path: '/UserManagement',
      name: 'UserManagement',
      component: UserManagement
    },


]
const router = new Router({
  base: '/MCH/',
  mode: 'history',
  routes
})

// 全局前置导航守卫
// to: 要到的对象
// from：来源对象
// next：回调函数，用来跳转页面
router.beforeEach( (to, from, next)=>{
  //操作员权限
  const rolePower={home,
                   PortManagement,
                   VLANManagement,
                   OperationLog,
                   SystemLog,
                   PowerManagement,
                   Login,
                   Register};
  // 登录检查
  // console.log(to);
  // 需要针对cookie操作存取token，这里需要自己写一个cookie工具或者
  // 使用库，可以参考mdn
  let isLogin = window.sessionStorage.getItem('isLogin');
  let goTo=to.name;
  const role=window.sessionStorage.getItem('role');

  // if(to.meta){
    if(isLogin || to.path === '/Login' || to.path === '/Register'){
      if(role=='操作员'&&!rolePower[goTo]){
        Message({
          message:'没有访问权限',
          type:'warning'
        })
      }else{
        next()
      }

    }else{
      next({path:'/Login'})
    }
})


export default router
