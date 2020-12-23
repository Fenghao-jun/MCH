<template>
  <div>
<!--    <div class="system-name">-->
<!--        <span>-->
<!--          GSMR接口监测系统-->
<!--        </span>-->
<!--    </div>-->
    <el-card class="top-tip">
      <div class="system-name">
        <span>
          MTCA网管软件
        </span>
      </div>
      <div>
        <span>
        登录账户:
        <el-dropdown placement="bottom">
          <span class="el-dropdown-link">
            {{ user }}({{ userRole }})<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <span @click="toPersonal">个人中心</span>
            </el-dropdown-item>
            <el-dropdown-item>
              <span @click="logout">退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </span>

        <span>登录时间:&nbsp;{{loginTime}}</span>
        <span>版本:&nbsp;{{ version }}</span>




        <span class="top-lang">
         <change-language></change-language>
        </span>
      </div>
    </el-card>

    <el-dialog
      title="excel任务列表"
      :visible.sync="excelList"
      width="30%"
      center>
      <span>excel任务列表的内容</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click=" excelList = false">取 消</el-button>
        <el-button type="primary" @click=" excelList = false">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="个人中心"
      :visible.sync="personalCenter"
      width="30%"
      center>
      <div>
        <el-form
          :model="personForm"
          ref="personForm"
          :rules="rules"
          label-width="100px"
        >
          <el-form-item label="旧密码:"  prop="oldPass">
            <el-input v-model="personForm.oldPass" placeholder="长度在 6 到 18 个字符"></el-input>
          </el-form-item>
          <el-form-item label="新密码:" prop="newPass">
            <el-input v-model="personForm.newPass" placeholder="长度在 6 到 18 个字符"></el-input>
          </el-form-item>
          <el-form-item label="确认新密码:" prop="checkNewPass">
            <el-input v-model="personForm.checkNewPass" placeholder="长度在 6 到 18 个字符"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="personalCenter = false">取 消</el-button>
        <el-button type="primary" @click="submitPersonal">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import ChangeLanguage from './ChangeLanguage'
export default {
  name: "TopTip",
  components:{
    ChangeLanguage
  },
  beforeDestroy() {
    this.sendTime()
  },

  data() {
    return {
      user: window.sessionStorage.getItem('userName'),
      userRole: window.sessionStorage.getItem('role'),
      version: window.$version,
      excelList: false,
      loginTime: sessionStorage.getItem('loginTime'),
      personalCenter: false,
      personForm: {
        oldPass: '',
        newPass: '',
        checkNewPass: '',
      },
      rules: {
        oldPass: [
          { required: true, message: '请输入旧密码', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 6 到 18 个字符', trigger: 'blur' }
        ],
        newPass: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 6 到 18 个字符', trigger: 'blur' }
        ],
        checkNewPass: [
          { required: true, message: '请再次输入新密码', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 6 到 18 个字符', trigger: 'blur' }
        ],
      }
    }
  },
  mounted() {
    // console.log(localStorage.getItem('lang'), 'top-tip')
    // this.sendTime();
  },
  methods: {
    /**
     * 关闭前发送当前时间
     * @method toPersonal
     * @todo 细节需要完善
     * **/

    /**
     * 跳到个人中心
     * @method toPersonal
     * @todo 细节需要完善
     * **/
    toPersonal() {
      this.personalCenter = true;
    },
    /**
     * 跳到个人中心
     * @method toPersonal
     * @todo 细节需要完善
     * **/
    submitPersonal() {
      // this.personForm
      // this.$message({type:'success', message:'密码修改成功'})
      // this.personalCenter = false
      //判断新旧密码是否相同
      if(this.personForm.checkNewPass!=this.personForm.newPass){
        return this.$message({
          type:'warning',
          message:'新密码输入不一致！'
        })
      };
      let data ={
        UserName:window.sessionStorage.getItem('userName'),
        PassWord:this.personForm.newPass,
        OldPassWord:this.personForm.oldPass
      };
      const param={
        url:'/cgi-bin/setlogin.cgi',
        method:'post',
        bodyData:data
      };
      this.$http.requestPost(param).then((result)=>{
        // console.log(result);
        if(result.data.Data.State=='success'){
          this.$router.push('/Login');
          //清楚所有缓存
          window.sessionStorage.clear();
          this.$message({
            type:'success',
            message:'密码更改成功，请重新登录！'
          })
        }else if(result.data.State=='fail'){
          this.$message({type:'warning',message:result.data.Info});
        }else{
          this.$message({type:'warning',message:'未知错误，请联系开发人员！'})
        }
      });
    },

    /**
     * 跳到excel任务列表
     * @method toExcelList
     * @todo 细节需要完善
     * **/
    toExcelList() {
      this.excelList = true
    },
    /**
     * 清空通知
     * @method clearNotice
     *
     * */
    clearNotice() {
      this.$message({type: 'success', message: '已清空', duration: 1000})
    },

    /**
     * 退出登录, 将token注销
     * @method logout
     * @todo 细节需要完善
     * **/
    logout() {
      console.log('logout')
      window.sessionStorage.setItem('isLogin', '')
      this.$router.push({path: '/Login'})
    },

  }
}
</script>

<style scoped lang="less">
.system-name{
  position: relative;
  //position: absolute;
  //height: 46px;
  //font-size: 20px;
  //line-height: 46px;
  //margin-left: 200px;
  //white-space:nowrap;
  span{
    position: absolute;
    /* height: 46px; */
    font-size: 20px;
    font-weight: bold;
    line-height: 1px;
    white-space: nowrap;
    color: #375777;
  }
}
.top-tip {
  /deep/ .el-card__body {
    display: flex;
    justify-content: space-between;
    padding: 15px;
    font-size: 14px;
    text-align: right;
  }
  span {
    margin: 5px;
  }
  .el-button {
    padding: 0;
  }
  .el-dropdown-link {
    cursor: pointer;
  }

}
</style>
