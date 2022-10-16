import request from '@/base/request';

// 城市列表
export const cityListReq = () =>
  request('/school/cityList', {
    method: 'GET',
  });

// 学校列表
export const schoolListReq = (cityCode: string) =>
  request(`/school/schoolList/${cityCode}`, {
    method: 'GET',
  });

// 家长首页信息
export const parentIndexDetail = () =>
  request('/h5Parent/payDetail', {
    method: 'GET',
  });
