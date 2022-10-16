import request from '@/base/request';

// 核对教师查询
export const getTeacherInfo = () =>
  request('/h5Teacher/checkDetailQuery', {
    method: 'GET',
    params: {
      identityStatus: 1,
    },
  });

// 核对家长查询
export const getParentInfo = () =>
  request('/h5Parent/getUserMessage', {
    method: 'GET',
    params: {
      identityStatus: 2,
    },
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

// 教师首页信息
export const teacherIndexDetail = () =>
  request('/h5Teacher/myTeacherIndexDetail', {
    method: 'GET',
  });

// 家长首页信息
export const parentIndexDetail = () =>
  request('/h5Parent/payDetail', {
    method: 'GET',
  });
