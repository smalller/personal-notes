import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/ns-store/finance/page',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getDetail = (orderId) => {
  return request({
    url: '/api/ns-store/order/detail',
    method: 'get',
    params: {
      orderId
    }
  })
}

export const getFinanceCount = (params) => {
  return request({
    url: '/api/ns-store/finance/getFinanceCount',
    method: 'get',
    params: {
      ...params
    }
  })
}
