<template>
    <el-container v-if="ableFlag">

      <el-aside :width="asideWidth">
        <aside-nav ></aside-nav>
      </el-aside>

      <el-container>

        <el-header height="50px">
          <top-tip></top-tip>
        </el-header>

        <el-main :style="defaultHeight">
          <!-- 注意这里使用的数据是state中的数据，不要使用v-model绑定 -->
          <el-tabs
            :value="activeTab"
            type="card"
            closable
            @tab-remove="removeTab"
            @tab-click="toggleTab"
          >
            <el-tab-pane
                v-for="item in aliveTabs"
                :key="item.path"
                :label="item.value"
                :name="item.path"
            >
            </el-tab-pane>

          </el-tabs>
            <keep-alive :include="aliveTabs">
              <router-view></router-view>
            </keep-alive>
        </el-main>
      </el-container>


    </el-container>

    <router-view v-else></router-view>
</template>

<script>
import AsideNav from './components/AsideNav'
import TopTip from "./components/TopTip";
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'App',
  components:{
    AsideNav,
    TopTip
  },
  data(){
    return {
      defaultHeight:{
        height:''
      },
      menu:{
        home:'首页',

      }
    }
  },
  // beforeDestroy() {
  //
  // },
  computed:{

    ...mapState({
      activeTab: state => state.activeTab,
      aliveTabs: state => state.aliveTabs,
      ableFlag: state => state.ableFlag,
      asideWidth: state => state.asideWidth
    })
  },
  created(){
    // 首次访问时候，将activeTab设置为当前页面的路由
    console.log(window.location)
    let currentPath = window.location.pathname.replace('/MCH/', '');
    console.log(currentPath)
    const hashPath={
      home:'首页',
      PowerManagement:'电源管理',
      PortManagement:'接口管理',
      VLANManagement:'VLAN设置',
      SystemLog:'系统日志',
      OperationLog:'操作日志',
      UserManagement:'用户信息'
    };

    if( currentPath == 'Login' || currentPath == 'Register'){
      // currentPath=this.menu[window.location.pathname.replace('/MCH/', '')]
      this.setStateValue({ name: 'ableFlag', value: false})
      // console.log(currentPath,'000')
      console.log(this.setStateValue)
    }else{
      // currentPath=this.menu[window.location.pathname.replace('/MCH/', '')]
      this.setStateValue({ name: 'ableFlag', value: true})
      this.setStateValue({ name: 'activeTab', value: currentPath})
      this.setStateValue({ name: 'aliveTabs', value: [{path:currentPath,value:hashPath[currentPath]}]})
    }


    // window.addEventListener("resize", this.getHeight);
    // this.getHeight();
  },

  watch: {

  },
  methods:{
    unloadFn(){
      this._gap_time=new Date().getTime()-this._beforeUnload_time;
      if(this._gap_time<=5){
        const data={
          UserName:this.form.name,
          PassWord:this.form.password
        };
        const param={
          url:'/cgi-bin/getlogin.cgi',
          method:'post',
          bodyData:data
        }
        this.$http.requestPost(param)
      }
    },
    beforeunloadFn () {
      this._beforeUnload_time=new Date().getTime();
    },


    ...mapMutations({
      setStateValue: 'setStateValue',
      addTabs: 'addTabs'
    }),


    /**
     * 删除tab
     * @method removeTab
     * @todo 组件缓存清除？
     * **/
    removeTab(targetTab) {
      // console.log(targetTab)
      // console.log(this.aliveTabs)
      let tabs=this.aliveTabs;
      // console.log(tabs)
      tabs.forEach((tab,index)=>{
        if(tab.path==targetTab){
          let nextTab=tabs[index+1]||tabs[index-1];
          // console.log(nextTab)
          if(nextTab){
            console.log('jinru')
                this.setStateValue({ name: 'activeTab', value:  nextTab.path} );
            console.log('bbbb')
                this.$router.push({path: '/' + nextTab.path });
          }
        }
      });
      // tabs = tabs.filter((item) => {item.path!==targetTab;
      //   console.log(item)});
      // console.log(tabs)


      // let tabs = this.aliveTabs
      // if ( this.activeTab === targetTab ) {
      //   let index = function (){
      //     let num;
      //     for (let i = 0;i<tabs.length;i++){
      //       if (tabs[i].path==targetTab){
      //         return num=i;
      //       }
      //     }
      //     return num
      //   }
      //   console.log(index)
      //
      //   let nextTab = tabs[index + 1] || tabs[index - 1];
      //   console.log(nextTab, 'nexttab')
      //   if (nextTab) {
      //     this.setStateValue({ name: 'activeTab', value: '/' + nextTab.path} )
      //     this.$router.push({path: '/' + nextTab.path })
      //   }
      // }
      tabs = tabs.filter( item => item.path !== targetTab )
      // console.log(this.aliveTabs)
      if ( tabs.length !== 0 ) {
        this.setStateValue({name:'aliveTabs', value: tabs})
        console.log("ccc")
      } else {
        this.$message({type:'warning', message:'只剩下一个了，不能再删除了'})
      }

    },

    /**
     * 点击切换tab
     * @method toggleTab
     *
     * **/
    toggleTab(){
      let e = window.event || event
      let path = e.target.innerText
      let currentPath = window.location.pathname.replace('/MCH/', '')
      console.log(window.location.pathname)
      const hashPath={
        首页:"home",
        电源管理:'PowerManagement',
        接口管理:'PortManagement',
        VLAN设置:'VLANManagement',
        系统日志:'SystemLog',
        操作日志:'OperationLog',
        用户信息:'UserManagement'
      };
      // let currentPath = hashPath[path];
      this.setStateValue({ name: 'activeTab', value: hashPath[path] })
      // let path = '/' + e.target.innerText

      console.log(path)

      console.log(currentPath)
      if( hashPath[path] !== currentPath ){
        this.$router.push({path: '/' + hashPath[path]})
      }
    },

    /*
     *定义方法，获取高度减去头尾
    */
    // getHeight() {
    //   this.defaultHeight.height = window.innerHeight - 90 + "px";
    // }
  }
}
</script>

<style lang="less">
//引入公共样式
@import "../static/common/login";
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
body{
  margin: 0;
  padding: 0;
}
.el-header{
  min-width: 1275px;
}

.el-main{
  //padding-top: 10px;
  min-width: 1275px;
  padding: 10px 20px;
  .el-tabs__item{
    height: 25px;
    line-height: 25px;
    font-size: 14px;
  }
  .el-tabs__nav-next, .el-tabs__nav-prev{
    line-height: 25px;
  }
}
.clear-padding{
  padding: 0;
  margin: 0;
  overflow: hidden;
}
</style>
