import request from '@/base/request';

export interface Notice {
  id: string;
  title: string;
  createTime: string;
  [key: string]: any;
}

interface Params {
  pageNum: number;
  pageSize: number;
}

/**
 * 查询老师通知列表
 */
export const getTeacherNotice = (params: Params) =>
  request('/teacher/selectTeacherNotices', {
    method: 'GET',
    params,
  });

/**
 * 查询家长通知列表
 */
export const getUserNotice = () =>
  request('/teacher/selectStudentNotices', {
    method: 'GET',
  });
