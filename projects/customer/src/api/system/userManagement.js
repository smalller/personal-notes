import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/blade-system/user/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const update = (row) => {
  return request({
    url: '/api/blade-system/user/update',
    method: 'post',
    data: row
  })
}
