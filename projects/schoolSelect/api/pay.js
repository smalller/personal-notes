import request from "../base/request.js"

/**
 * 创建订单
 */
export const createOrder = (data) => request('/orders/order/addProductByOne', {
	method: 'post',
	data: data
})

/**
 * 获取支付信息
 */
export const startPay = (data) => request('/pays/pay/payUrl', {
	method: 'post',
	data: data
})

/**
 * 获取商品列表
 */
export const getProducts = (params) => request('/orders/order/getProducts', {
	method: 'get',
	params: params
})

/**
 * 解码微信信息
 */
export const dcode = (params) => request('/pays/paycert/unAccess/decrypt', {
	method: 'get',
	params: params
})

/**
 * 查询用户是否购买小程序学校视频
 */
export const getVideoStatus = params =>request('/userserver/api/user/isSchVideoVip', {
	method: 'get',
	params: params
})

/**
 * 查询购买订单
 */
export const getOrderList = (params) => request('/orders/order/getOrderList', {
	method: 'get',
	params
})

/**
 * 查询订单详情
 * @param {any} params 
 */
export const getOrderDetails = (params) => request(`/orders/order/queryOrderDetails/${params.orderId}`, {
	method: 'get'
})

/**
 * 删除订单
 * @param {*} params 
 */
export const deleteOrder = (params) => request(`/orders/order/deleteOrder/${params.id}`, {
	method: 'delete'
})