import request from "../base/request.js"

/**
 * 获取预览图片
 */
export const reviewImg = data => request('/mamserver/api/idPhoto/unAccess/getPreview', {
	method: 'post',
	params: data.params,
	data: data.base64,
	headers: {
		'content-type': 'application/json'
	}
})

/**
 * 生成证件照
 */
export const getIDPhoto = params => request('/mamserver/api/idPhoto/getPhotoByKey', {
	method: 'GET',
	params: params
})
