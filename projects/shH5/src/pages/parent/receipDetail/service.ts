import request from '@/base/request';

// 电子收据详情
export const receiptDetail = (orderId: string) =>
  request(`/h5Parent/receiptDetail/${orderId}`, {
    method: 'GET',
  });
