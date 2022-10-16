import $store from "@/store/index";
import { User } from "@/base/interface";
import axios from "axios";
import micell from "micell";
import Message from "@/themes/message";

/**
 * 登录过期计时
 * */
let loginTimer: null | number;
const startLoginTime = (): void => {
  let time = ($store.state as User).user.expire;
  if (loginTimer) {
    clearInterval(loginTimer);
    loginTimer = null;
  }
  if (($store.state as User).user.userId) {
    loginTimer = setInterval(() => {
      time -= 1;
      $store.dispatch("setExpire", time);
      if (time <= 0) {
        if (loginTimer) {
          clearInterval(loginTimer);
          loginTimer = null;
        }
        $store.dispatch("loginOut");
      }
    }, 1000);
  }
};

type NumAutoAddCall = (number: number) => void;
/**
 * 数字自增长
 * @param number
 * @param call
 * @param time
 */
const numAutoAdd = (
  number: number,
  call: NumAutoAddCall,
  time = 3000
): void => {
  let i = 0;
  const keyNum = number / (time / 20);
  console.log(keyNum);
  const timer = setInterval(() => {
    call(Math.ceil(i));
    if (i >= number) {
      call(number);
      clearInterval(timer);
    }
    i += keyNum;
  }, 20);
};

/**
 * 下载文件
 * @param url
 * @param name
 */
function download(url: string, name: string): void {
  axios
    .get(url, {
      headers: {
        token: sessionStorage.getItem("token") || "",
        userId: sessionStorage.getItem("userId") || "",
        schoolId: sessionStorage.getItem("schoolId") || "",
      },
      responseType: "blob",
    })
    .then((res) => {
      const blob = new Blob([res.data], {
        type: "application/vnd.ms-excel;charset=utf-8",
      });
      const downUrl = window.URL.createObjectURL(blob);
      micell.download(downUrl, name);
    });
}

/**
 * 下载zip，下载单个
 * @param url
 * @param data
 * @param name
 */
function downloadZipPost(url: string, name: string, data?: string[]): void {
  axios({
    method: "post",
    url,
    data,
    headers: {
      token: sessionStorage.getItem("token") || "",
      userId: sessionStorage.getItem("userId") || "",
      schoolId: sessionStorage.getItem("schoolId") || "",
      "Content-Type": "application/json;application/octet-stream",
    },
    responseType: "blob",
  }).then((res) => {
    if (res.data.size === 0) {
      Message.warning("暂无数据可导出");
      return;
    }
    const url = window.URL.createObjectURL(
      // new Blob([res.data], { type: "application/zip" })
      new Blob([res.data], { type: "application/msword" })
    );
    micell.download(url, name);
  });
}

/**
 * 下载zip，下载多个
 * @param url
 * @param name
 */
function downloadZipGet(url: string, name: string): void {
  axios({
    method: "get",
    url,
    headers: {
      token: sessionStorage.getItem("token") || "",
      userId: sessionStorage.getItem("userId") || "",
      schoolId: sessionStorage.getItem("schoolId") || "",
      "Content-Type": "application/json;application/octet-stream",
    },
    responseType: "blob",
  }).then((res) => {
    if (res.data.size === 0) {
      Message.warning("暂无数据可导出");
      return;
    }
    const url = window.URL.createObjectURL(
      new Blob([res.data], { type: "application/zip" })
    );
    micell.download(url, name);
  });
}

/**
 * 学籍批量导出word
 * @param url
 * @param data
 * @param name
 */
function batchDownloadZipPost(
  url: string,
  name: string,
  data?: string[]
): void {
  axios({
    method: "post",
    url,
    data,
    headers: {
      token: sessionStorage.getItem("token") || "",
      userId: sessionStorage.getItem("userId") || "",
      schoolId: sessionStorage.getItem("schoolId") || "",
      "Content-Type": "application/json;application/octet-stream",
    },
    responseType: "blob",
  }).then((res) => {
    if (res.data.size === 0) {
      Message.warning("暂无数据可导出");
      return;
    }
    const url = window.URL.createObjectURL(
      new Blob([res.data], { type: "application/zip" })
    );
    micell.download(url, name);
  });
}

export {
  startLoginTime,
  numAutoAdd,
  download,
  downloadZipPost,
  downloadZipGet,
  batchDownloadZipPost,
};
