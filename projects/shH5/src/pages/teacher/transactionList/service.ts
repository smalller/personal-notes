import request from '@/base/request';

// 支付记录
export const payHistory = (params?: any) =>
  request('/h5Teacher/payHistory', {
    method: 'GET',
    params,
  });
