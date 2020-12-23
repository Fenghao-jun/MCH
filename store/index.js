import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    activeTab: 'home',
    aliveTabs: [{path:'home',value:'首页'} ],
    ableFlag: true,
    asideWidth: '240px'
  },
  mutations:{
    setStateValue(state, {name, value}){
      state[name] = value
      console.log(state,'000000')
      // console.log('这是state')
    },
    addTabs(state, value){
      state.aliveTabs.push(value)
      console.log(state, '.....')
    },
    deleteTabs(state, value){

    }
  }
})

export default store
