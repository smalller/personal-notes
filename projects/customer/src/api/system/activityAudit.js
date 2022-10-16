import request from '@/router/axios';

export const getList = (current, size, params, audit) => {
  return request({
    url: '/api/blade-system/activity/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
      audit
    }
  })
}

export const update = (row) => {
  return request({
    url: '/api/blade-system/activity/submit',
    method: 'post',
    data: row
  })
}
