import request from '@/router/axios';

export const getList = (current, size, params, statusBusinesses) => {
  return request({
    url: '/api/blade-system/store/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
      statusBusinesses
    }
  })
}

export const update = (row) => {
  return request({
    url: '/api/blade-system/store/update',
    method: 'post',
    data: row
  })
}
