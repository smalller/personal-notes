import request from '@/base/request';

// 支付记录详情
export const payHistoryDetail = (id: string) =>
  request('/ParentDetails/selectParentDetailById', {
    method: 'GET',
    params: {
      id,
    },
  });

// 修改登记信息
export const setDetailRegister = (data: any) =>
  request('/h5Teacher/setPayHistoryDetailRegister', {
    method: 'post',
    data,
  });
