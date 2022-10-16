import request from '@/base/request';

// 查询授权状态
export const getAuthStatus = (payType: number | string) =>
  request('/oauth2/getAuthStatus', {
    method: 'get',
    params: {
      payType,
    },
  });

// 获取微信授权
export const getWXOpenId = (params: any) =>
  request('/oauth2/getMerchantOpenId', {
    method: 'get',
    params,
  });

// 支付
export const pay = (data: any) =>
  request('/pay/pay', {
    method: 'post',
    data,
  });
