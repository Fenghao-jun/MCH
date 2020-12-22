// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import store from '../store/index'
import App from './App'
import router from './router'
import elementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import packageConfig from '../package.json'
import i18n from './i18n/i18n';
import locale from 'element-ui/lib/locale/lang/en'
import http from './https.js'
import idea from './public.js'

window.$version = packageConfig.version

Vue.config.productionTip = false
Vue.prototype.$http = http
Vue.prototype.$idea = idea
Vue.use(Vuex)
Vue.use(elementUI)
// console.dir(store)
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  components: { App },
  template: '<App/>'
})
