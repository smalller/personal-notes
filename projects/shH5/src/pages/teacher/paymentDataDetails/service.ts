import request from '@/base/request';

/**
 * 查询明细详情
 */
export const orderDetail = (orderId: string) =>
  request(`/h5Teacher/payHistoryDetail`, {
    method: 'GET',
    params: {
      orderId,
    },
  });
