<template>
  <div class="login login-container">
<!--    <div class="login-lang">-->
<!--      <change-language color="#409EFF"></change-language>-->
<!--    </div>-->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{$t('login.login')}}</span>
      </div>

      <div>

        <el-form
          :model="form"
          status-icon
          :rules="rules"
          ref="form"
          label-width="170px"
        >

<!--          <el-form-item-->
<!--            v-for="(label, key) in labels"-->
<!--            :label="label"-->
<!--            :prop="key"-->
<!--            :key="key"-->
<!--          >-->
<!--            <el-input-->
<!--              :type="key == 'name' ? 'text' : 'password'"-->
<!--              v-model="form[key]"-->
<!--              :placeholder="'请输入'+label+'，长度为6到18个字符'"-->
<!--            ></el-input>-->
<!--          </el-form-item>-->
          <el-form-item
              :label="$t('login.username')"
              prop="name"
          >
            <el-input
                type="text"
                v-model="form.name"
                placeholder="请输入用户名，长度为6到18个字符"
            ></el-input>
          </el-form-item>
          <el-form-item
              :label="$t('login.pass')"
              prop="password"
          >
            <el-input
              type="password"
              v-model="form.password"
              placeholder="请输入密码，长度为6到18个字符"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer">
            <el-button type="primary" @click="submitForm('form')">
              {{$t('login.login')}}
            </el-button>

<!--            <el-button @click="toRegister">-->
<!--              {{$t('login.register')}}-->
<!--            </el-button>-->
        </div>

      </div>
    </el-card>

  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import ChangeLanguage from "../components/ChangeLanguage";
export default {
  name: 'Login',
  components: {
    ChangeLanguage
  },


  data(){
    let validatePass = (rule, value, callback) => {
      // console.log(value, rule)
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.form.repassword !== '') {
          this.$refs.form.validateField('repassword');
        }
        callback();
      }
    }


    return {
      form:{
        name:'',
        password:''
      },

      labels:{
        name: '用户名',
        password: '密码'
      },

      rules: {
        name: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 1, max: 18, message: '长度在 1 到 18 个字符 ', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 1, max: 18, message: '长度在 1 到 18 个字符 ', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ],
      }
    }
  },

  computed:{
    ...mapState({
      ableFlag: state => state.ableFlag
    })
  },

  created() {
    this.setStateValue({ name: 'ableFlag', value: false})
  },

  methods:{

    /**
     * 引入state处理操作
     * @method mapMutations() vuex封装，用于传递state中mutations的
     * @param  (object)
     */
    ...mapMutations({
      setStateValue: 'setStateValue',
      addTabs: 'addTabs'
    }),
    /**
     * 登录提交，对数据进行校验，成功就提交，跳转到首页，失败则提示
     * @method submitForm()
     * @param (string) formName 提交表单的名称
     * @todo 接口对接
     */
    submitForm(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // console.log(valid,'submit!!');
          this.logIn();
        } else {
          this.$message({type:'error', message:'失败了'})
          console.log('error submit!!');
          return false;
        }
      });
      // 临时模拟登录
      // if (this.form.name === '123456' && this.form.password === '123456'){
      //   this.$message({type:'success', message: '登录成功'})
      //   let loginTime = new Date().toLocaleString()
      //   window.sessionStorage.setItem('isLogin', 'true')
      //   window.sessionStorage.setItem('loginTime', loginTime)
      //   this.setStateValue({ name: 'ableFlag', value: true})
      //   this.$router.push({path:'/home'})
      // }

    },
    logIn(){
      const data={
        UserName:this.form.name,
        PassWord:this.form.password
      };
      let param={
        url:'/cgi-bin/getlogin.cgi',
        method:'post',
        bodyData:data
      };
      this.$http.requestPost(param).then((result)=>{
        console.log(result)
        if(result.data.State=='success'){
          this.$message({type:'success', message: '登录成功'});
          let loginTime = new Date().toLocaleString();
          const role=result.data.Data.Role;
          const userName=JSON.parse(JSON.stringify(this.form.name));
          console.log(role)
          window.sessionStorage.setItem('userName',userName)
          window.sessionStorage.setItem('role',role);
          window.sessionStorage.setItem('isLogin', 'true');
          window.sessionStorage.setItem('loginTime', loginTime);
          this.setStateValue({ name: 'ableFlag', value: true});
          this.setStateValue({name:'aliveTabs',value:[{path:'home',value:'概览'}]})
          this.setStateValue({ name: 'activeTab', value: 'home'})
          this.$router.push({path:'/home'});
        }else if(result.data.State=='fail'){
          this.$message({type:'warning',message:result.data.Info});
        }else{
          this.$message({type:'warning',message:'未知错误，请联系开发人员！'})
        }
      })
    },

    /**
     * 跳转到注册界面
     * @method toRegister
     *
     */
    toRegister(){
      this.$router.push({path:'/Register'})
    }
  }
}
</script>

<style lang="less">
//@import "../../static/common/login";
//.login{
//
//}
</style>
