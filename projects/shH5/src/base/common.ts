import { history } from 'umi';
import request from '@/base/request';

/**
 * 重定向登录页面
 */
export const redirectLogin = (data: any = {}) => {
  history.push({
    pathname: '/login',
    query: Object.assign(history.location.query, data),
  });
};

// 获取教师学校列表/切换班级
export const getSchoolList = (merchantId?: number | string) =>
  request('/h5Teacher/schoolList', {
    method: 'get',
    params: {
      merchantId,
    },
  });

// 获取家长娃儿列表/切换娃儿
export const getStuList = (merchantId: number, studentId: number) =>
  request('/h5Parent/myBabyDetail', {
    method: 'get',
    params: {
      merchantId,
      studentId,
    },
  });
