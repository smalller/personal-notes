import request from '@/base/request';

// 查询个人信息
export const myDetail = () =>
  request('/h5Parent/myDetail', {
    method: 'GET',
  });

// 修改个人信息
export const updateMyDetail = (data?: any) =>
  request('/h5Parent/updateMyDetail', {
    method: 'post',
    data,
  });
