import axios, { AxiosPromise, AxiosRequestConfig, AxiosResponse } from "axios";
import { ElNotification } from "element-plus";
import router from "@/config/routes";
import settings from "@/config/settings";
import { getToken, setToken } from "@/utils/localToken";

export interface ResponseData {
  code: number;
  data?: any;
  msg?: string;
  token?: string;
  message?: string;
}

const customCodeMessage: { [key: number]: string } = {
  1001: "当前用户登入信息已失效，请重新登入再操作", // 未登陆
};

const serverCodeMessage: { [key: number]: string } = {
  200: "服务器成功返回请求的数据",
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  500: "服务器发生错误，请检查服务器(Internal Server Error)",
  502: "网关错误(Bad Gateway)",
  503: "服务不可用，服务器暂时过载或维护(Service Unavailable)",
  504: "网关超时(Gateway Timeout)",
};

/**
 * 异常处理程序
 */
const errorHandler = (error: any) => {
  const { response } = error;
  const { data } = response;
  const { code, message } = data;

  if (response && response.status) {
    const errorText = serverCodeMessage[response.status] || response.statusText;
    const { status, request } = response;
    ElNotification({
      type: "error",
      title: `请求错误 ${status}: ${request.responseURL}`,
      message: errorText,
    });
  } else {
    ElNotification({
      type: "error",
      title: `提示`,
      message: message || "服务异常",
    });
  }

  if (+code === 1001) {
    router.replace("/user/login");
  }

  return Promise.reject(error);
};

/**
 * 配置request请求时的默认参数
 */
const request = axios.create({
  baseURL: process.env.VUE_APP_APIHOST, // url = api url + request url
  // withCredentials: true, // 当跨域请求时发送cookie
  timeout: 0, // 请求超时时间,5000(单位毫秒) / 0 不做限制
});

/**
 * 请求拦截器
 */
request.interceptors.request.use(
  async (config: AxiosRequestConfig & { cType?: boolean }) => {
    // 如果设置了cType 说明是自定义 添加 Content-Type类型 为自定义post 做铺垫
    if (config["cType"]) {
      config.headers["Content-Type"] =
        "application/x-www-form-urlencoded;charset=UTF-8";
    }

    // 自定义添加token header
    const headerToken = await getToken();
    config.headers["source"] = 2;
    if (headerToken) {
      config.headers[settings.ajaxHeadersTokenKey] = headerToken;
    }

    return config;
  }
  /* error=> {} */ // 已在 export default catch
);

/**
 * 响应拦截器
 */
request.interceptors.response.use(
  async (response: AxiosResponse) => {
    const res: ResponseData = response.data;
    const { code, token, message } = res;
    // 重置刷新token
    if (token) {
      await setToken(token);
    }

    if(response.config.responseType === 'blob') {
        return response;
    }

    if (+code !== 1000) {
      ElNotification({
        type: "error",
        title: "提示",
        message: message || "服务异常",
      });

      if (+code === 1001) {
        router.replace("/user/login");
      }

    }

    // if (+code === 1001) {
    //     router.replace('/user/login');
    // }

    return response;
  }
  /* error => {} */ // 已在 export default catch
);

export default function (config: AxiosRequestConfig): AxiosPromise<any> {
  return request(config)
    .then((response: AxiosResponse) => response.data)
    .catch((error) => errorHandler(error));
}
