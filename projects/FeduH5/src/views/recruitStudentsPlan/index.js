/*
 * @Author: 吴同学 
 * @Date: 2022-01-21 13:38:24 
 * @Last Modified by: 吴同学
 * @Last Modified time: 2022-01-21 13:39:48
 */

// 获取招生状态
export function getLiveStatusStr(status) {
    switch (status) {
      case 0:
        return "未上架";
      case 1:
        return "招生中";
    }
  }
  
  // 获取招生状态背景色
  export function getLiveStatusBg(status) {
    switch (status) {
      case 0:
        return "blue-bg";
      case 1:
        return "yellow-bg";
    }
  }