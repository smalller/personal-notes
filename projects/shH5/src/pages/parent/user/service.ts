import request from '@/base/request';

// 家长个人中心信息
export const myDetail = () =>
  request('/h5Parent/myDetail', {
    method: 'get',
  });
