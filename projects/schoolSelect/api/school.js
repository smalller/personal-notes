import request from "../base/request.js"

/**
 * 查询学校列表
 */
export const getSchoolList = params => request(`/schools/api/Applet/unAccess/query${params}`,{
	method: 'get',
})

/**
 * 查询学校详情
 */
export const getSchoolDetails = params => request(`/schools/api/Applet/unAccess/queryById/${params.id}`,{
	method: 'get'
})