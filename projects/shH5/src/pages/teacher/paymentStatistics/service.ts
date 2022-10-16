import request from '@/base/request';

export interface PaymentDetailsStatistics {
  className: string; //班级
  gradeName: string; //年级
  id: number; //缴费id
  mcId: number; //班级id
  orderProgress: string; //缴费进度
  projectName: string; //项目名称
  sumPayStatus: string; //已处理
}

interface Params {
  pageNum: number;
  pageSize: number;
}

/**
 * 缴费统计列表
 */
export const getSelectStatistics = (params: Params) =>
  request('/parent/selectStatistics', {
    method: 'GET',
    params,
  });
