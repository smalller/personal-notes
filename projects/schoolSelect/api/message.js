import request from "../base/request.js"

/**
 * 发布评论
 */
export const sendMsg = params => request(`/community/schComment/add`,{
	method: 'post',
	data: params
})

/**
 * 查看评论
 */
export const getMsgList = params => request('/community/schComment/unAccess/queryComments', {
	method: 'get',
	params: params
})


/**
 * 发布游客评论
 */
export const sendTouristMsg = (params) => request('/community/schComment/unAccess/addSxComment', {
	method: 'post',
	data: params
})
