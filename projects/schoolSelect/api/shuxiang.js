import request from "../base/request.js"

/**
 * 分页查询作品
 */
export const getWorkList = (params) => request('/schools/api/sxApplet/unAccess/queryWorksList',{
	// url: '/pays/paycert/getOpenId',
	method: 'get',
	params: params
})

/**
 * 作品投票
 */
 export const voteWork = (id,openId) => request(`/schools/api/sxApplet/unAccess/vote/{id}/{openId}?id=${id}&openId=${openId}`,{
	// url: '/pays/paycert/getOpenId',
	method: 'post',
})

/**
 * 查询报名状态
 */
 export const getEroStatus = (params) => request('/schools/api/sxApplet/selectSignByUserId',{
	// url: '/pays/paycert/getOpenId',
	method: 'get',
	params: params
})

/**
 * 报名
 */
export const sign = params => request('/schools/api/sxApplet/sign', {
	method: 'post',
	data: params,
	headers: {
		'Content-Type': 'application/json;charset=utf-8'
	}
})
/**
 * 提交作品
 */
 export const submitWork = (params) => request('/schools/api/sxApplet/submitWork',{
	method: 'post',
	data: params
})



/**
 * 查询已导入学校
 */
export const getGroupList = (params) => request('/schools/api/sxApplet/getSchools', {
	method: 'get',
	params,
})

/**
 * 登记游客信息
 */
export const setTourist = params => request('/schools/api/sxApplet/unAccess/tourist', {
	method: 'post',
	data: params
})

//查询作品详情
export const getDetails = params => request(`/schools/api/sxApplet/unAccess/queryWorksDetails/${params.id}`, {
	method: 'get'
})

/**
 * 查询个人积分情况
 */
export const getUserNum = params => request('/schools/api/sxApplet/getPersonMessage', {
	method: 'get'
})

/**
 * 查询报名数量
 */
export const getSignNum = params => request('/schools/api/sxApplet/unAccess/querySignList', {
	method: 'get'
})

/**
 * 查询个人积分排名及作品数量
 */
export const getUserPerson = params => request('/schools/api/sxApplet/getPersonMessage', {
	method: 'get'
})

/**
 * 查询团体积分排名及作品数量
 */
export const getGroupPerson = params => request('/schools/api/sxApplet/getTeamMessage', {
	method: 'get'
})

/**
 * 查询自己发布的作品列表
 */
export const getUserWork = () => request('/schools/api/sxApplet/getWorksByUserId', {
	method: 'get'
})

/**
 * 查询广告列表
 */
export const getAd = (params) => request('/schools/api/sxAppletAd/query',{
	method: 'get',
	params
})

/**
 * 点击广告进行记录
 */
export const saveAd = (params) => request(`/schools/api/sxAppletAd/record/${params.id}`, {
	method: 'put'
})

/**
 * 查询活动信息
 */
export const getActivityInfo = (params) => request('/schools/api/sxApplet/getSxTime', {
	method: 'get'
})

/**
 * 查询报名信息
 */
export const getSignData = () => request('/schools/api/sxApplet/getSignByUserId', {
	method: 'get'
})

/**
 * 更新报名信息
 */
export const updateSignData = (params) => request('/schools/api/sxApplet/updateSign',{
	method: 'put',
	data: params
})