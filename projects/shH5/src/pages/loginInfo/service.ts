import request from '@/base/request';

// 核对教师查询
export const getTeacherInfo = () =>
  request('/h5Teacher/checkDetailQuery', {
    method: 'GET',
  });

// 核对家长查询
export const getParentInfo = () =>
  request('/h5Parent/getUserMessage', {
    method: 'GET',
  });

// 核对信息选择
export const choseDetail = (merchantId: number, studentId?: number) =>
  request('/teacherLogin/choseDetail', {
    method: 'GET',
    params: {
      merchantId,
      studentId,
    },
  });
