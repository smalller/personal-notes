//班级管理相关
import request from '@/utils/request'
export const CLASSLIST = '/schools/clazz/query' //查询班级列表
const ADDCLASS = '/schools/clazz/add' //新增班级
const EDITCLASS = '/schools/clazz' //编辑班级
/**
 * 新增班级
 * @param params
 * @returns {AxiosPromise}
 */
export function addClass(params) {
  return request({ url: ADDCLASS, data: params, method: 'post' })
}

/**
 *
 * @param params
 * @param id
 * @returns {AxiosPromise}
 */
export function editClass(params, id) {
  return request({ url: `${EDITCLASS}/${id}`, data: params, method: 'put' })
}

/**
 * 查询该学校下所有班级
 * @param schoolId
 * @returns {AxiosPromise}
 */
export function getAllClass(schoolId) {
  return request({
    url: '/schools/clazz/query',
    params: { pageNo: 1, pageSize: 9999, schoolId },
    method: 'get',
  })
}
