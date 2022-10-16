import request from "@/base/request";

/**
 * 查询商家信息，活动信息
 */
export const getShowPicTime = () => request('/mamserver/api/showPic/getShowPicTime', {
	method: 'get'
})

/**
 * 查询照片列表
 */
export const getShowPicList = () => request('/mamserver/api/showPic/getShowPic', {
	method: 'get'
})

/**
 * 查询是否可以直接购买卷
 */
export const getShowPicInfo = () => request('/orders/order/getShowPicInfo', {
	method: 'get'
})

/**
 * 查询兑换卷列表
 * @param {any} params 
 */
export const getCouponsList = (params) => request('/mamserver/api/coupons/getCouponsList', {
	method: 'get',
	params
})

/**
 * 查询兑换卷详情
 * @param {*} params 
 */
export const getCouponsDetail = (params) => request(`/mamserver/api/coupons/getCouponsDetail/${params.id}`, {
	method: 'get'
})

/**
 * 判断用户能否选择照片
 */
export const checkByUser = () => request('/mamserver/api/showPic/checkByUser', {
	method: 'get'
})