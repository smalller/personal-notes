import { Toast } from 'react-vant';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { history } from 'umi';
import { redirectLogin } from '@/base/common';

export interface ResponseData {
  code: number;
  data?: any;
  msg?: string;
  token?: string;
  message?: string;
}

const baseURL: string = process.env.BASE_URL as string;

const service = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    source: 1,
  },
});

// 发起请求之前的拦截器
service.interceptors.request.use(
  (config: any) => {
    if (sessionStorage.getItem('token')) {
      config.headers.token = sessionStorage.getItem('token');
    }
    return config;
  },
  (error: any) => {
    Toast.info(error);
    Promise.reject(error);
  },
);

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const res: ResponseData = response.data;
    const { code, message } = res;
    if (+code !== 1000 && message && +code !== 1016) {
      Toast.info(message);
    }

    if (+code === 1001) {
      redirectLogin();
    }

    return Promise.resolve(response.data);
  },
  (error: AxiosError) => {
    Toast.info(error);
    return Promise.reject(error);
  },
);

export default service;
