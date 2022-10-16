import request from '@/base/request';

/**
 * 查询年级列表
 */
export const getGradeList = () =>
  request('/h5Order/gradeList', {
    method: 'GET',
  });

interface ScreeningTotalParams {
  payBeginTime?: string;
  payEndTime?: string;
  projectType?: string | number;
}

// 查询统计信息
export const screeningTotal = (params?: ScreeningTotalParams) =>
  request('/h5Order/selectMerchantOrderScreeningTotal', {
    method: 'GET',
    params,
  });

// 查询缴费明细列表
export const orderScreening = (params: any) =>
  request('/h5Order/selectMerchantOrderScreening', {
    method: 'GET',
    params: {
      ...params,
    },
  });
