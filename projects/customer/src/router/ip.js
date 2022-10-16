let api, tengxun, imgHead, token, rongyunKey
import axios from 'axios'
import store from '@/store/';
import router from '@/router/router';
import {
  serialize
} from '@/util/util';
import {
  getToken
} from '@/util/auth';
import {
  Message
} from 'element-ui';
import website from '@/config/website';
import {
  Base64
} from 'js-base64';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';



if (process.env.NODE_ENV === "development") {
  api = "/api";
  tengxun = "/map";
  imgHead = '/file/admin/system/upload/down?keyName=';
  rongyunKey = 'pvxdm17jpw7hr'
} else if (process.env.NODE_ENV === "testing") {
  api = 'https://systemtest.cdhqht.com'
  tengxun = 'https://apis.map.qq.com'
  imgHead = 'https://systemtest.cdhqht.com/admin/system/upload/down?keyName=';
  rongyunKey = 'pvxdm17jpw7hr'
} else {
  api = 'https://system.cdhqht.com'
  tengxun = 'https://apis.map.qq.com'
  imgHead = 'https://system.cdhqht.com/admin/system/upload/down?keyName=';
  rongyunKey = 'e0x9wycfepwtq'
}

const api_request = axios.create({
  baseURL: api,
  timeout: 10000
})
// NProgress 配置
NProgress.configure({
  showSpinner: false
});

api_request.interceptors.request.use(config => {
  //开启 progress bar
  NProgress.start();
  const meta = (config.meta || {});
  const isToken = meta.isToken === false;
  config.headers['Authorization'] = `Basic ${Base64.encode(`${website.clientId}:${website.clientSecret}`)}`;
  //让每个请求携带token
  if (getToken() && !isToken) {
    config.headers[website.tokenHeader] = 'bearer ' + getToken()
  }
  //headers中配置text请求
  if (config.text === true) {
    config.headers["Content-Type"] = "text/plain";
  }
  //headers中配置serialize为true开启序列化
  if (config.method === 'post' && meta.isSerialize === true) {
    config.data = serialize(config.data);
  }
  return config
}, error => {
  return Promise.reject(error)
});


api_request.interceptors.response.use(res => {
  //关闭 progress bar
  NProgress.done();
  //获取状态码
  const status = res.data.code || res.status;
  const statusWhiteList = website.statusWhiteList || [];
  const message = res.data.msg || res.data.error_description || '未知错误';
  //如果在白名单里则自行catch逻辑处理
  if (statusWhiteList.includes(status)) return Promise.reject(res);
  //如果是401则跳转到登录页面
  if (status === 401) store.dispatch('FedLogOut').then(() => router.push({
    path: '/login'
  }));
  // 如果请求为非200否者默认统一处理
  if (status !== 200) {
    Message({
      message: message,
      type: 'error'
    });
    return Promise.reject(new Error(message))
  }
  return res;
}, error => {
  NProgress.done();
  return Promise.reject(new Error(error));
});


const file_request = axios.create({
  baseURL: api,
  timeout: 10000
})

file_request.interceptors.request.use(config => {
  NProgress.start();
  config.headers['Authorization'] = `Basic ${Base64.encode(`${website.clientId}:${website.clientSecret}`)}`;
  token = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).token : ''
  // axios.defaults.headers.common["X-Store-Token"] = token;
  config.headers.common['X-Admin-Token'] = token
  return config;
});

file_request.interceptors.response.use(res => {
  //关闭 progress bar
  NProgress.done();
  //获取状态码
  console.log(111)
  console.log(res)
  const status = res.data.code || res.status;
  const statusWhiteList = website.statusWhiteList || [];
  const message = res.data.msg || res.data.error_description || '未知错误';
  //如果在白名单里则自行catch逻辑处理
  if (statusWhiteList.includes(status)) return Promise.reject(res.data);
  //如果是401则跳转到登录页面
  if (status === 401) store.dispatch('FedLogOut').then(() => router.push({
    path: '/login'
  }));
  // 如果请求为非200否者默认统一处理
  if (status !== 200) {
    Message({
      message: message,
      type: 'error'
    });
    return Promise.reject(new Error(message))
  }
  return res;
}, error => {
  NProgress.done();
  return Promise.reject(new Error(error));
});


const map_request = axios.create({
  baseURL: tengxun,
  timeout: 10000
})

map_request.interceptors.request.use(config => {
  return config;
});


export {
  api_request,
  map_request,
  file_request,
  imgHead,
  rongyunKey
};
