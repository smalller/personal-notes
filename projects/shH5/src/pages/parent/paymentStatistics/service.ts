import request from '@/base/request';

interface ChargeNameDetailParams {
  classId?: string | number;
  gradeId?: string | number;
  projectId?: string | number;
  studentId?: string | number;
}

/**
 * 缴费统计列表
 */
export const chargeNameListByStudent = (params: any) =>
  request('/parentIndex/chargeNameListByStudent', {
    method: 'GET',
    params,
  });

// 查询存在子订单
export const splitSonOrderExist = (data: ChargeNameDetailParams) =>
  request('/parentIndex/splitSonOrderExist', {
    method: 'post',
    data,
  });
