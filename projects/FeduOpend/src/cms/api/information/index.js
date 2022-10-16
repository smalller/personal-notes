//创建园所相关
import request from '@/utils/request'
export const SCHOOLLIST = '/schools/school/query' //查询学校列表
const ADDSCHOOL = '/schools/school/add' //增加学校
const EDITSCHOOL = '/schools/school' //编辑学校
const CONTROLSCHOOL = '/schools/school/forbid'
/**
 * 添加学校
 * @param params
 * @returns {AxiosPromise}
 */
export function addSchool(params) {
  return request({ url: ADDSCHOOL, data: params, method: 'post' })
}

/**
 * 编辑学校
 * @param params
 * @param id 学校id
 * @returns {AxiosPromise}
 */
export function updateSchool(params, id) {
  return request({ url: `${EDITSCHOOL}/${id}`, data: params, method: 'put' })
}

/**
 * 启用禁用学校
 * @param id
 * @param schoolId
 * @returns {AxiosPromise}
 */
export function handleSchool(id, schoolId, forbid) {
  return request({
    url: `${CONTROLSCHOOL}/${id}/${schoolId}?enable=${forbid}`,
    method: 'put',
  })
}
