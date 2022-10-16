import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/blade-system/order/list',
    method: 'get',
    params: {
      ...params,
      isPlatform: 1,
      current,
      size,
    }
  })
}

export const getDetail = (orderId) => {
  return request({
    url: '/api/blade-system/order/detail',
    method: 'get',
    params: {
      isPlatform: 1,
      orderId
    }
  })
}

export const getCollageUsers = (orderId) => {
  return request({
    url: '/api/blade-system/order/collage/users',
    method: 'get',
    params: {
      orderId
    }
  })
}

export const refundAudit = (data) => {
  return request({
    url: '/api/blade-system/order/audit/sub',
    method: 'post',
    data
  })
}
