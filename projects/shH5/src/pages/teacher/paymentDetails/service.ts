import request from '@/base/request';

export interface PaymentDetailsParams {
  id: string;
  mcId: string;
}

interface ChargeNameDetailParams {
  classId?: string | number;
  gradeId?: string | number;
  projectId?: string | number;
  studentId?: string | number;
}

/**
 * 缴费统计详情
 * @param params
 */
export const getPaymentDetails = (Id: string, mcId: string) =>
  request('/parent/selectStatisticsDetail', {
    method: 'GET',
    params: {
      Id,
      mcId,
    },
  });

// 标记为操作
export const updatePayType = (Id: number, userId: number, status: number) =>
  request('/parent/updatePayType', {
    method: 'GET',
    params: {
      Id,
      userId,
      status,
    },
  });

// 查询存在子订单
export const splitSonOrderExist = (data: ChargeNameDetailParams) =>
  request('/parentIndex/splitSonOrderExist', {
    method: 'post',
    data,
  });

// 一键催缴
export const handleInfo = (Id: string, classId: number) =>
  request('/parent/goToPay', {
    method: 'GET',
    params: {
      Id,
      classId,
    },
  });
