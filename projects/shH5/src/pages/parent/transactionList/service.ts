import request from '@/base/request';

// 支付记录
export const payHistory = (params?: any) =>
  request('/ParentDetails/selectParentDetails', {
    method: 'GET',
    params,
  });
