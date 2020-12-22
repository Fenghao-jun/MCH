import zhLocale from 'element-ui/lib/locale/lang/zh-CN'

// 用于存放 语言字段

const cn = {

  ...zhLocale,

  /**
   * 中文语言包
   * 以下为各组件静态的文字对应的中文
   * @tode 对各组件静态的文字归类并将对应的中文写好
   * */
  login: {
    login: '登录',
    register: '注册',
    username: '用户名',
    pass: '密码',
    checkPass: '确认密码',
    reset: '重置'
  },
  asideNav:{
    PRIInterface: 'PRI接口',
    PRIcallLog: 'PRI呼叫记录查询',
    PRIsignalingQuery: 'PRI信令查询',
    PRImoduleAnalysis: '车载模块运行分析',
    PRIhandoverRecord: 'PRI邻局移交记录',
    PRIstatistics: 'RBC业务时长统计',

  }

}
export default cn

