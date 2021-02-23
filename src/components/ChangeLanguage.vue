<template>
  <el-dropdown placement="bottom" class="change-lang" @command="changeLanguage">
    <span class="el-dropdown-link" :style="'color:'+ color || 'black' ">
      {{this.lang}}<i class="el-icon-arrow-down el-icon--right"></i>
    </span>
    <el-dropdown-menu slot="dropdown" >
      <el-dropdown-item command="cn">
        <div > 中文 </div>
      </el-dropdown-item>
      <el-dropdown-item command="en">
        <div > English </div>
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  name: "ChangeLanguge",
  props:[
    'color'
  ],
  data(){
    return {
      lang: '中文',
      // color: '#409EFF',
    }
  },
  mounted() {
    console.log(this.lang, localStorage.getItem('lang'))
    this.lang = localStorage.getItem('lang') == 'en' ? 'English' :'中文'
  },
  methods: {
    /**
     * 切换语言
     * @method changeLanguage
     * @params (string)lang 语言设置，值为 ’en‘ 或者 ’cn’
     * */
    changeLanguage(lang) {
      this.lang = lang == 'en' ? 'English' : '中文'
      // console.log(this.lang, lang)
      //设置中英文模式
      this.$i18n.locale = lang

      //将用户设置存储到localStorage以便用户下次打开时使用此设置
      localStorage.setItem('lang', this.$i18n.locale)
    },
  }
}
</script>

<style scoped lang="less">
.change-lang{
  /deep/.el-dropdown-link {
    cursor: pointer;
  }
  /deep/.el-dropdown-menu {
    width: 112px;
  }
}

</style>
