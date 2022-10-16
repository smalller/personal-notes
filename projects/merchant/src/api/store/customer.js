  import request from '@/router/axios';

  export const getList = (current, size, params) => {
    return request({
      url: '/api/ns-store/customer/page',
      method: 'get',
      params: {
        current,
        size,
        ...params
      }
    })
  }

  export const getOrderList = (userId) => {
    return request({
      url: '/api/ns-store/customer/orderList',
      method: 'get',
      params: {
        userId
      }
    })
  }

  export const getOrderDetail = (orderId) => {
    return request({
      url: '/api/ns-store/order/detail',
      method: 'get',
      params: {
        orderId
      }
    })
  }
