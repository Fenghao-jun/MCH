<template>
  <div class="register login-container">

    <div class="login-lang">
      <change-language color="#409EFF"></change-language>
    </div>

    <el-card>

      <div slot="header" class="clearfix">
        <span>{{$t('login.register')}}</span>
      </div>

      <div>

        <el-form
          :model="form"
          status-icon :rules="rules"
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
          <el-form-item
              :label="$t('login.checkPass')"
              prop="repassword"
          >
            <el-input
                type="password"
                v-model="form.repassword"
                placeholder="请再次输入密码，长度为6到18个字符"
            ></el-input>
          </el-form-item>
        </el-form>

        <div slot="footer" >
            <el-button type="primary" @click="toLogin">
              {{$t('login.login')}}
            </el-button>

            <el-button @click="submitForm('form')">
              {{$t('login.register')}}
            </el-button>
            <el-button type="danger" @click="resetForm('from')">
              {{$t('login.reset')}}
            </el-button>
        </div>
      </div>

    </el-card>


  </div>
</template>

<script>
import {mapMutations, mapState} from "vuex";
import ChangeLanguage from "../components/ChangeLanguage";
export default {
  name: 'Register',
  components: {
    ChangeLanguage
  },
  data(){
    // 自定义校验规则
    let validatePass = (rule, value, callback) => {
      console.log(value, rule)
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.form.repassword !== '') {
          this.$refs.form.validateField('repassword');
        }
        callback();
      }
    }
    let validateRepass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.form.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    }
    return {
      form:{
        name:'',
        password:'',
        repassword:''
      },

      labels:{
        name: '用户名',
        password: '密码',
        repassword: '确认密码',
      },

      rules: {
        name: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 6, max: 18, message: '长度在 6 到 18 个字符 ', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 18, message: '长度在 6 到 18 个字符 ', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ],
        repassword: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { min: 6, max: 18, message: '长度在 6 到 18 个字符 ', trigger: 'blur' },
          { validator: validateRepass, trigger: 'blur' }
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
     * 跳转到登录页面
     * @method toLogin()
     */
    toLogin(){
      this.$router.push({path:'/Login'})
    },

    /**
     * 注册提交，对数据进行校验，成功就提交，失败则提示
     * @method submitForm()
     * @param (string) formName 提交表单的名称
     * @todo 接口对接
     */
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$message({type:'success', message:'注册成功'})
        } else {
          this.$message({type:'error', message:'失败了'})
          console.log('error submit!!');
          return false;
        }
      });
      this.setStateValue({ name: 'ableFlag', value: true})
      this.$router.push({path:'/PriCallLog'})
    },

    /**
     * 对表单数据重置
     * @method submitForm()
     * @param (string) formName 需要重置的表单的名称
     *
     */
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }





}
</script>
<style lang="less">
//@import "../../static/common/login";
//.register{
//
//}
</style>
