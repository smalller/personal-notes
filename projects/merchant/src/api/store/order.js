import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/ns-store/order/page',
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

export const getBookableSeatList = (seatCode) => {
  return request({
    url: '/api/ns-store/storeseat/getBookableSeatList',
    method: 'get',
    params: {
      seatCode
    }
  })
}

//接单
export const receive = (orderId) => {
  return request({
    url: '/api/ns-store/order/receive',
    method: 'post',
    params: {
      orderId,
    }
  })
}

//拒单
export const reject = (orderId) => {
  return request({
    url: '/api/ns-store/order/reject',
    method: 'post',
    params: {
      orderId,
    }
  })
}

//上桌
export const append = (orderUserId) => {
  return request({
    url: '/api/ns-store/order/updateServedStatus',
    method: 'post',
    params: {
      orderUserId,
    }
  })
}

//到店审核
export const arrived = (row) => {
  let data = new FormData();
  for (let key in row) {
    data.append(key, row[key])
  }
  return request({
    url: '/api/ns-store/order/arrived',
    method: 'post',
    data
  })
}

//确认离店
export const closed = (orderId) => {
  return request({
    url: '/api/ns-store/order/closed',
    method: 'post',
    params: {
      orderId,
    }
  })
}

//更改座位
export const updateSeatInfo = (row) => {
  let formData = new FormData();
  for (let key in row) {
    formData.append(key, row[key]);
  }
  return request({
    url: '/api/ns-store/order/updateSeatInfo',
    method: 'post',
    data: formData
  })
}

//协商退款
export const refund = (orderUserId) => {
  return request({
    url: '/api/ns-store/order/negotiateRefund',
    method: 'post',
    params: {
      orderUserId,
      reason: ''
    }
  })
}

//审核退款
export const refundAudit = (orderUserId) => {
  return request({
    url: '/api/ns-store/order/refundAudit',
    method: 'post',
    params: {
      orderUserId,
    }
  })
}

//获取隐私号码
export const getCustomerPhone = (orderId) => {
  return request({
    url: `/api/ns-store/customer/${orderId}`,
    method: 'post',
  })
}
