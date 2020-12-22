import axios from 'axios';
import qs from 'qs'
// 部分数据需要存进store或取出
// import store from "../../store/index"
// 请求错误时提示，根据需求引入不同ui
import {Message} from "element-ui";
// 根据返回值进行页面跳转
import router from "vue-router"
// 封装的获取本地token的方法
// import { getToken } from "@/utils/auth"

// 环境的切换
// if (process.env.NODE_ENV === 'development') {
//     // axios.defaults.baseURL = 'http://127.0.0.1:8082/' // 本地环境
//     axios.defaults.baseURL = 'http://192.168.0.103:8081/' // 开发环境
// } else if (process.env.NODE_ENV === 'debug') {
//     axios.defaults.baseURL = 'http://127.0.0.1:8082/' // 本地环境
// } else if (process.env.NODE_ENV === 'production') {
//     axios.defaults.baseURL = 'http://192.168.0.103:8081/'// 生产环境
// }

const service = axios.create({
    // baseURL: '/apis',
    baseURL: 'http://192.168.1.100/',
    // baseURL: 'http://192.168.0.103:8081/',
    timeout: '500000',
})

service.interceptors.request.use(function (config) {
  // console.log(config)
    // 在发送请求之前做些什么
  if(config.data){
    const userName=window.sessionStorage.getItem('userName');
    config.data=JSON.parse(config.data);
    if(userName){
      config.data.ID=userName;
    }
    config.data=JSON.stringify(config.data);
  };
  // 如果没有请求数据，自动添加请求体
  // if(!config.data){
  //   console.log('++++++++++++++++++')
  //   config.data={
  //     ID:userName,
  //   }
  //   console.log(config)
  // };
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
service.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    return response;
}, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
});


export default {
    /**
     * 注意这个是get请求，后端使用requestParam接收参数，只会接收在url上的参数，是获取不到
     * data的，因为data是放在requestBody中，所以要拼接到url上
     * */
    requestGet(param = {url: '', data: {}, bodyData: {}}) {
        // console.log(qs.stringify(param.data))
        return service({
            url: param.url + '?' + qs.stringify(param.data),
            method: 'get',
            data: param.bodyData,
            headers: {

                "Content-Type": "application/json"
                // "Content-Type": "application/x-www-form-urlencoded"
            }
        })
    },

    /**
     * 后端以url参数，即使name=tom&&age=18，这种形式接收参数，即需要将对象转换成字符串
     * 使用json的接口只是将对象字符串化，达不到需求，使用qs插件可以
     * @param (string) url 请求的地址  (object)data 请求的参数  (string)method 请求的方法类型
     *
     * */
    requestPost(param = {url: '', data: {}, bodyData: {}, method: 'post'}) {
        // console.log(qs.stringify(param.data))
        return service({
            url: param.url,
            // url: param.url + '?' + qs.stringify(param.data),
            method: param.method,
            data: JSON.stringify(param.bodyData) ,
            headers: {
                // "Content-Type": "application/json"
                // "Content-Type": "application/x-www-form-urlencoded"
                "Content-Type" :"text/plain"
            }
        })
    },

    throttle(fn, interval) {
        var last;
        var timer;
        var interval = interval || 200;
        return function () {
            var th = this;
            var args = arguments;
            var now = +new Date();
            if (last && now - last < interval) {
                clearTimeout(timer);
                timer = setTimeout(function () {
                    last = now;
                    fn.apply(th, args);
                }, interval);
            } else {
                last = now;
                fn.apply(th, args);
            }
        }
    }
}
