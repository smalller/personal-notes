  "use strict";
  const print = console.log;

  class Simplepolller {
      constructor(options) {
          this.timer = null;
          this.flag = null;
          this.interval = 1000;
          this.simplepolller(this.callback, this.queryFn);
      }

      // 主函数
      simplepolller() {
          this.resolveQueryFn(this.interval, this.queryFn).then(res => {
              this.flag = res;
              this.checkFlagFn(this.flag, this.interval);
          })
      }

      // 初始调用函数
      resolveQueryFn(interval, fn) {
          return new Promise(resolve => {
              this.timer = setInterval(() => {
                  resolve(fn())
              }, interval);
          })
      }

      // 验证返回的布尔值
      checkFlagFn(flag) {
          if (flag === false) {
              clearInterval(this.timer)
              this.interval = this.interval * 1.5;
              // 递归调用主函数
              this.simplepolller(this.callback, this.queryFn);
              print(flag, this.interval)
          }

          if (this.flag === true) {
              print(flag, this.interval)
              this.callback();
          }
      }

      // 回调函数
      callback = () => {
          clearInterval(this.timer);
          return
      }

      // 随机返回布尔值函数
      queryFn = () => Math.random() >= 0.5;
  }

  new Simplepolller();
  new Simplepolller();
  new Simplepolller();