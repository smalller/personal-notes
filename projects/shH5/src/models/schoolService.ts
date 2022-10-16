import request from '@/base/request';

export interface SchoolItem {
  h5MessageSchoolVos: any[];
  mId: string | number;
  mName: string;
  className: string;
}

/**
 * 查询教师学校列表
 */
export const getTeacherSchool = () =>
  request('/h5Teacher/checkDetailQuery', {
    method: 'get',
  });
