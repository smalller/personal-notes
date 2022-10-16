import request from '@/base/request';

interface ChargeNameDetailParams {
  classId?: string | number;
  gradeId?: string | number;
  projectId?: string | number;
  studentId?: string | number;
}

// 去支付
export const goPay = (data: any) =>
  request('/parentIndex/goPay', {
    method: 'post',
    data,
  });

// 查询为他代付详情信息
export const chargeNameDetail = (params: ChargeNameDetailParams) =>
  request('/parentIndex/chargeNameDetail', {
    method: 'get',
    params,
  });
