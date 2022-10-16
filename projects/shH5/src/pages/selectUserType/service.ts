import request from '@/base/request';

// 家长个人中心信息
export const getCurrent = () =>
  request('/teacherLogin/getCurrent', {
    method: 'get',
  });

// 家长切换到教师
export const switchingIdentityParent = () =>
  request('/h5Parent/switchingIdentityParent', {
    method: 'post',
  });

// 教师切换到家长
export const switchingIdentityTeacher = () =>
  request('/h5Teacher/switchingIdentityTeacher', {
    method: 'post',
  });

// 判断是否为第一次登录
export const choseIdentity = (identityStatus: number) =>
  request('/teacherLogin/choseIdentity', {
    method: 'get',
    params: {
      identityStatus,
    },
  });
