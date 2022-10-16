//订单信息管理
import request from '@/utils/request'

//获取订单信息
const ORDERINFO = '/orders/agent/getList'

//获取支付类型
export function getPayType() {
  return request({
    url: '/orders/api/order/getGatewayType',
    method: 'get',
  })
}
//获取支付状态
export function getStatusType() {
  return request({
    url: '/orders/api/order/getOrderStatus',
    method: 'get',
  })
}
//获取代理商返现数据
export function getOrderInfo(id) {
  return request({
    url: `${ORDERINFO}?orderId=${id}`,
    method: 'get',
  })
}
