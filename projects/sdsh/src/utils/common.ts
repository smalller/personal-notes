/*
 * @Author: 吴同学 
 * @Date: 2022-04-22 10:21:15 
 * @Last Modified by: 吴同学
 * @Last Modified time: 2022-04-22 10:23:30
 */


/**
 * 节流函数
 */
export const throttle = (function () {
    let timer: any = 0;
    return function (callback: any, ms: number) {
        clearTimeout(timer);
        timer = setTimeout(callback, ms);
    };
})();