import request from '@/base/request';

// 支付
export const pay = (data: any) =>
  request('/pay/pay', {
    method: 'post',
    data,
  });
