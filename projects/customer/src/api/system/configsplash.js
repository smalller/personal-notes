import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/blade-system/config/splash/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/blade-system/config/splash/remove',
    method: 'delete',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/blade-system/config/splash/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/blade-system/config/splash/submit',
    method: 'post',
    data: row
  })
}

