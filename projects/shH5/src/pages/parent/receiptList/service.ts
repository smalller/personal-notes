import request from '@/base/request';

// 电子收据列表
export const receiptList = (params?: any) =>
  request('/h5Parent/receiptList', {
    method: 'GET',
    params,
  });
