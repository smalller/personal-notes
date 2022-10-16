import axios, { AxiosError, AxiosResponse } from "axios";
import Message from "@/themes/message";

import $store from "../store";
// import VueCookie from 'vue-cookie'
const allRule: string[] = ["/userserver/regLogin/login"];
// import qs from "qs";
const baseURL: string =
  process.env.NODE_ENV === "development"
    ? process.env.VUE_APP_BASE_API
    : process.env.VUE_APP_BASE_API;

// 操作正常Code数组
// const codeVerificationArray = isArray(successCode)
//   ? [...successCode]
//   : [...[successCode]]

// const CODE_MESSAGE: Object = {
//   200: "服务器成功返回请求数据",
//   201: "新建或修改数据成功",
//   202: "一个请求已经进入后台排队（异步任务）",
//   204: "删除数据成功",
//   400: "发出信息有误",
//   401: "用户没有权限（令牌、用户名、密码错误）",
//   403: "用户得到授权，但是访问是被禁止的",
//   404: "访问资源不存在",
//   406: "请求格式不可得",
//   410: "请求资源被永久删除，且不会被看到",
//   500: "服务器发生错误",
//   502: "网关错误",
//   503: "服务不可用，服务器暂时过载或维护",
//   504: "网关超时",
// };

const service = axios.create({
  baseURL,
  timeout: 10000,
});

// 发起请求之前的拦截器
service.interceptors.request.use(
  (config: any) => {
    // console.log(config.url);

    if (!sessionStorage.getItem("token")) {
      config.headers["sysType"] = "cms";
      if (allRule.includes(config.url)) {
        config.headers["token"] = sessionStorage.getItem("token") || "";
        config.headers["userId"] = sessionStorage.getItem("userId") || "";
        config.headers["schoolId"] = sessionStorage.getItem("schoolId") || "";
        config.headers["deviceId"] = 1;

        // config.headers["version"] = "1.4.0";
        return config;
      } else {
        return Promise.reject("登陆过期");
      }
    } else {
      config.headers["token"] = sessionStorage.getItem("token") || "";
      config.headers["userId"] = sessionStorage.getItem("userId") || "";
      config.headers["schoolId"] = sessionStorage.getItem("schoolId") || "";
      // config.headers["schoolId"] = "SCH1397377650709807104";
      config.headers["deviceId"] = 1;
      config.headers["Access-Control-Allow-Methods"] =
        "POST, GET, OPTIONS, DELETE, PUT";
      // config.headers["version"] = "1.5.0";
      return config;
    }
  },
  (error: any) => Promise.reject(error)
);

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    if (+response.data.code !== 0 && +response.data.code !== 1000) {
      Message.error(response.data.msg);
    }
    switch (+response.data.code) {
      case 401:
        $store.dispatch("loginOut");
        return Promise.reject("登录过期");
      default:
        return Promise.resolve(response.data);
    }
  },
  (error: AxiosError) => {
    if (error.response && error.response.status === 401) {
      $store.dispatch("loginOut");
      Message.error("登录过期");
      // location.reload();
    }

    if (error?.message?.indexOf("timeout") > -1) {
      Message.error("连接超时");
    } else {
      console.warn(error.toString());
      if (error.toString() === "登陆过期") {
        Message.error("登录过期");
        $store.dispatch("loginOut");
      }
      if (error.toString() === "token校验失败") {
        Message.error("登录过期");
        $store.dispatch("loginOut");
      } else {
        Message.error(error as unknown as string);
      }
    }
    return Promise.reject(error);
  }
);

export default service;
