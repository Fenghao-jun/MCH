import Vue from 'vue'

import locale from 'element-ui/lib/locale';

import VueI18n from 'vue-i18n'

import messages from './langs'

Vue.use(VueI18n);

const i18n = new VueI18n({

// 设置语言, 从localStorage中拿到用户的语言选择，如果没有，那默认中文。
  locale: localStorage.getItem('lang') || 'cn',

  messages,

});

//为了实现element插件的多语言切换
locale.i18n((key, value) => i18n.t(key, value));

export default i18n
