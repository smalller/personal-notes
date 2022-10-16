import request from "../base/request.js"

/**
 * 获取微信OpenId
 */
export const getOpenId = (params) => request('/pays/paycert/unAccess/getOpenId',{
	// url: '/pays/paycert/getOpenId',
	method: 'get',
	params: params
})

/**
 * 微信登录获取用户信息
 */
export const weChatLogin = (params) => request('/userserver/regLogin/unAccess/wxLogin',{
	method: 'post',
	params: params,
})

/**
 * 获取短信
 */
export const getSms = phone => request(`/userserver/regLogin/getWxRegSms/app/${phone}`, {
	method: 'post',
})

/**
 * 绑定微信
 */
export const bindWx = (params,contentType) => request('/userserver/regLogin/unAccess/wxBind', {
	method: 'post',
	data: params,
	headers: {
		 'content-type':contentType
	}
})

/**
 * 获取vip状态
 */
export const getVipStatus = () => request('/userserver/api/user/isMiniVip', {
	method: 'get'
})

/**
 * 编辑邮箱
 * @param {*} params 
 */
export const editEmail = (params) => request('/mamserver/api/showPic/fillInEmail', {
	method: 'put',
	params: params
})