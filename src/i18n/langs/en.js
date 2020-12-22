import enLocale from 'element-ui/lib/locale/lang/en'
import cn from "./cn";

const en = {

  ...enLocale,
  /**
   * 英文语言包
   * 以下为各组件静态的文字对应的英文
   * @tode 与中文语言包对应写好英文
   * */
  login: {
    login: 'login',
    register: 'register',
    username: 'username',
    pass: 'password',
    checkPass: 'check password',
    reset: 'reset'
  },
  asideNav:{
    PRIInterface: 'PRI interface',
    PRIcallLog: 'PRI call record query',
    PRIsignalingQuery: 'PRI signaling query',
    PRImoduleAnalysis: 'On-board module operation analysis',
    PRIhandoverRecord: 'PRI Neighboring Office Handover Record',
    PRIstatistics: 'RBC business hours statistics',

  }

}

export default en
