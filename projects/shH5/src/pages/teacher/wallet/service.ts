import request from '@/base/request';

// 钱包余额
export const selectPurseSum = (params?: any) =>
  request('/Purse/selectPurseSum', {
    method: 'GET',
    params,
  });
