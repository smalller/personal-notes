import request from '@/base/request';

/**
 * 查询二维码收费详情
 */
export const chargeCodeDetail = (codeId: string) =>
  request(`/parentIndex/chargeCodeDetail/${codeId}`, {
    method: 'GET',
  });

// 去支付
export const goPay = (data: any) =>
  request('/parentIndex/goPay', {
    method: 'post',
    data,
  });
