<template>
  <div class="aside-nav">
    <div class="menu-collapse" :class="{'left-collapse':isCollapse}">
      <div class="menu--collapse--button" @click="toggleCollapse">
        <i
          class="collapse-icon"
          :class="{'el-icon-caret-left':!isCollapse,'el-icon-caret-right':isCollapse}"
        ></i>
      </div>

    </div>
    <div class="nav-container">
      <el-menu
        :default-active="'/' + activeTab"
        class="el-menu-vertical"
        @open="handleOpen"
        @close="handleClose"
        :collapse="isCollapse"
        :collapse-transition="false"
        :unique-opened='true'
      >
  <!-- :default-openeds="opensArray" -->
        <el-menu-item
          key="首页"
          index="/home"
          @click="toHome">
          <i class="el-icon-house"></i>
          <span >概览</span>
        </el-menu-item>
        <el-submenu
          v-for="(item,index) in menuPaths"
          :index="item.name"
          :key="item.name"
         >
          <template slot="title">
            <i :class="icons[index]"></i>
            <span>{{item.name}}</span>
          </template>

          <el-menu-item-group>
            <el-menu-item
              v-for="menu in item.children"
              :key="menu.name"
              :index="menu.path"
              @click="openNavTab(menu.path)"
            >
              {{menu.name}}
            </el-menu-item>
          </el-menu-item-group>
        </el-submenu>

      </el-menu>
    </div>
  </div>
</template>

 <script>
import { mapState, mapMutations } from 'vuex'
/* MTCA */
import PortManagement from '../pages/management/PortManagement'
export default {
  name: 'AsideNav',
  props:[
    'navWidth'
  ],
  data () {

    return {
      isCollapse: false,
      defaultMenu: '',
      opens: [],
      icons:[
       'el-icon-search',
       'el-icon-time',
       'el-icon-s-data',
       // 'el-icon-setting',
      //  'el-icon-document',
       'el-icon-set-up',
       'el-icon-s-custom'
      ],
    }
  },
  computed:{
    ...mapState({
      activeTab: state => state.activeTab,
      aliveTabs: state => state.aliveTabs,
      asideWidth: state => state.asideWidth
    }),
    opensArray(name){
      console.log(this.activeTab,'00')
      console.log(name)
      for(let i = 0; i < this.menuPaths.length; i++){
        let children = this.menuPaths[i].children
        for(let j = 0; j < children.length; j++){
            if( this.activeTab === children[j].path.replace('/', '') ) {
              return [this.menuPaths[i].name]
            }
        }
      }
    },

    // 菜单数据，
    // 监测i18n中语言设置的改变从而改变菜单展示的语言
    menuPaths(){
      console.log(this.$i18n.tc('asideNav.PRIcallLog'))
      const role=window.sessionStorage.getItem('role');
      console.log(role)
      if(role=='操作员'){
        return [
          {
            name: '设备控制',
            path: '',
            children: [
              {
                name: '电源管理',
                path: '/PowerManagement'
              }
            ]
          },
          {
            name: '交换管理',
            path: '',
            children: [
              {
                name: '端口管理',
                path: '/PortManagement',
              },
              {
                name: 'VLAN管理',
                path: '/VLANManagement',
              }
            ]
          },
          {
            name: '日志统计',
            path: '',
            children: [
              {
                name: '系统日志',
                path: '/SystemLog',
              },
              {
                name: '操作日志',
                path: '/OperationLog'
              }
            ]
          },


          // {
          //   name: '配置信息',
          //   path: '',
          //   children: [
          //
          //   ]
          // },
          /*         {
                    name: '参数设置',
                    path: '',
                    children: [

                    ]
                  }, */
        ]
      }
      return [
        {
          name: '设备控制',
          path: '',
          children: [
            {
              name: '电源管理',
              path: '/PowerManagement'
            }
          ]
        },
        {
          name: '交换管理',
          path: '',
          children: [
            {
              name: '端口管理',
              path: '/PortManagement',
            },
            {
              name: 'VLAN管理',
              path: '/VLANManagement',
            }
          ]
        },
        {
          name: '日志统计',
          path: '',
          children: [
            {
              name: '系统日志',
              path: '/SystemLog',
            },
            {
              name: '操作日志',
              path: '/OperationLog'
            }
          ]
        },


        {
          name: '配置信息',
          path: '',
          children: [
            {
              name:'系统更新',
              path:'/updateSystem'
            }
          ]
        },
        // {
        //   name: '参数设置',
        //   path: '',
        //   children: [
        //
        //   ]
        // },
        {
          name: '权限管理',
          path: '',
          children: [
            {
              name: '用户信息',
              path: '/UserManagement',
            }
          ]
        }
      ]
    }

  },
  mounted(){
    this.defaultMenu =  window.location.pathname
    this.setAsideWidth()
  },
  methods:{
    ...mapMutations({
      setStateValue: 'setStateValue',
      addTabs: 'addTabs'
    }),
    /**
     * 根据菜单是否展开，设置aside的宽度
     * @method setAsideWidth
     * */
    setAsideWidth(){
      let width = this.isCollapse ? '1px' : '240px'
      this.setStateValue({ name:'asideWidth', value: width })
    },

    /**
     * 菜单收起和展开
     * @method toggleCollapse
     * @param (string)menuPath 当前点击的tab的路径
     *
     * */
    toggleCollapse(){
      this.isCollapse = !this.isCollapse
      this.setAsideWidth()
    },
    handleOpen(){
      console.log('chufa')
    },
    handleClose(){
      console.log('chufaclose')
    },

    /**
     * 点击导航，切换路由,将state中activeTab修改为menuPath的值,向aliveTabs中添加menuPath
     * @method openNavTab
     * @param (string)menuPath 当前点击的tab的路径
     *
     * */
    openNavTab(menuPath){
      console.log(menuPath)
      let path = menuPath.replace('/', '');
      const hashPath={
        home:'概览',
        PowerManagement:'电源管理',
        PortManagement:'端口管理',
        VLANManagement:'VLAN管理',
        SystemLog:'系统日志',
        OperationLog:'操作日志',
        UserManagement:'用户信息',
        updateSystem: '系统更新'
      };
      // console.log(path)
      this.setStateValue({ name: 'activeTab', value: path })
      // 对增加的menuPath进行校验, 如果已经存在，则不做添加操作
      let flag = this.aliveTabs.some( (item) => {
        // console.log(item.path)
        return item.path == path } )
      if(!flag){
        this.addTabs( {path:path,value:hashPath[path]} )
      }
      this.$router.push(path)
    },
    //首页方法
    toHome(){
      this.$router.push("/home")
      this.openNavTab('/home')
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.aside-nav{
  border-right: #e6e6e6 1px solid;
  height: 100%;

  .menu-collapse{
    opacity: 0;
    position: absolute;
    top: 0px;
    left: 240px;
    width: 20px;
    height: 100%;
    background: transparent;
    //background: red;
    text-align: center;
    .menu--collapse--button{
      height: 100px;
      cursor: pointer;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background-color: rgba(33, 41, 47, 0.3);;
    }
    .collapse-icon{
      font-size: 20px;
      width: 20px;
      position: relative;
      top:50%;
      transform: translateY(-50%) scaleY(1.5);

    }
  }
  .menu-collapse:hover{
    opacity: 1;
  }
  .left-collapse{
    left: 0px;
  }

  .nav-container{
    position: relative;
    height: 962px;
    overflow-x: hidden;
    overflow-y: auto;
    .el-menu{
      border-right: none;
    }
  }


}



</style>
