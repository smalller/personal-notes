import request from '@/base/request';

interface Params {
  pageNum: number;
  pageSize: number;
}

interface ChargeNameDetailParams {
  classId?: string | number;
  gradeId?: string | number;
  projectId?: string | number;
  studentId?: string | number;
}

// 查询存在子订单
export const splitSonOrderExist = (data: ChargeNameDetailParams) =>
  request('/parentIndex/splitSonOrderExist', {
    method: 'post',
    data,
  });

// 通知列表
export const selectStudentNotices = (params: Params) =>
  request('/teacher/selectStudentNotices', {
    method: 'get',
    params,
  });
