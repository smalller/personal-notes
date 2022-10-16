import request from '@/base/request';

interface ChargeNameDetailParams {
  classId?: string | number;
  gradeId?: string | number;
  projectId?: string | number;
  studentId?: string | number;
}

// 拆分子订单
export const splitSonOrder = (data: any) =>
  request('/parentIndex/splitSonOrder', {
    method: 'post',
    data,
  });

// 查询存在子订单
export const splitSonOrderExist = (data: ChargeNameDetailParams) =>
  request('/parentIndex/splitSonOrderExist', {
    method: 'post',
    data,
  });

// 获取拆分金额
export const getAmountQuantity = () =>
  request('/parentIndex/getAmountQuantity', {
    method: 'get',
  });
