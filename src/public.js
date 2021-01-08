export default {
   /* *节流方法
   * fn传入函数，interval代表几秒内能执行一次
   *
   */
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
  },

  /* *判断是否是整数
  * 因为es5没有方法判断是否整数
  *
  */
  isInt(num){
    return typeof num === 'number'&& num%1 === 0;
  }
}
