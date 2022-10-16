//代理商订单相关
import request from '@/utils/request'
export const ORDERLIST = '/orders/api/order/getOrders' //查询订单列表
const GETGATEWAYTYPE = '/orders/api/order/getGatewayType' //查询支付方式
const GETORDERSTATUS = '/orders/api/order/getOrderStatus' //查询订单状态
const ORDERINFO = '/orders/agent/getList' //获取订单信息
/**
 * 查询支付方式
 * @returns {AxiosPromise}
 */
export function getGatewayType() {
  return request({
    url: GETGATEWAYTYPE,
    method: 'get',
  })
}

/**
 * 查询订单状态
 * @returns {AxiosPromise}
 */
export function getOrderStatus() {
  return request({
    url: GETORDERSTATUS,
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
