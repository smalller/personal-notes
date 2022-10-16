import request from '@/utils/request'

/**
 * 查询学校列表
 * @param params
 * @returns {AxiosPromise}
 * @constructor
 */
export function QuerySchoolList(params) {
  return request({
    url: '/schools/api/school/query',
    method: 'GET',
    params: params,
  })
}

/**
 * 查询举报列表
 * @param params
 * @returns {AxiosPromise}
 * @constructor
 */
export function GetReportList(params) {
  return request({
    url: '/schools/api/report/query',
    method: 'GET',
    params: params,
  })
}

/**
 * 提交举报
 * @param params
 * @returns {AxiosPromise}
 * @constructor
 */
export function SendReport(params) {
  return request({
    url: '/schools/api/report/operation',
    method: 'post',
    data: params,
  })
}

/**
 * 查询小程序学校列表
 * @param params
 * @returns {AxiosPromise}
 * @constructor
 */
export function getSchoolList(params) {
  return request({
    url: '/schools/api/Applet/unAccess/query',
    method: 'GET',
    params: params,
  })
}

/**
 * 删除小程序学校
 * @param id
 * @returns {*}
 */
export const deleteSchool = (id) =>
  request({
    url: `/schools/api/Applet/delete/${id}`,
    method: 'delete',
  })

/**
 * 修改园所考勤设置
 * @param params
 * @returns {*}
 */
export const schoolSetAtt = (params) =>
  request({
    url: `/schools/api/school/setAtt/${params.schoolId}`,
    method: 'put',
    data: params.attType,
  })
