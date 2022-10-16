//员工管理相关
import request from '@/utils/request'
import en from '@/i18n/en'
export const STAFFLIST = '/schools/employee/query' //员工列表
const ADDSTAFF = '/schools/employee/add' //增加员工
const EDITSTAFF = '/schools/employee' //编辑班级
const MOVETEACHER = '/schools/employee/bind' //移除老师
const OFFSTAFF = '/schools/schoolEmpRel/quit' //员工离职
/**
 * 新增员工
 * @param params
 * @returns {AxiosPromise}
 */
export function addStaff(params) {
  return request({ url: ADDSTAFF, data: params, method: 'post' })
}

/**
 * 编辑员工
 * @param params
 * @param id
 * @returns {AxiosPromise}
 */
export function editStaff(params, id) {
  return request({ url: `${EDITSTAFF}/${id}`, data: params, method: 'put' })
}

/**
 * 添加或移除老师
 * @param params
 * @returns {AxiosPromise}
 */
export function moveTeacher(params) {
  // console.log(params)
  if (!params.employeeId || !params.clazzId) {
    throw new Error('id clazzId is empty')
  }
  return request({
    url: `${MOVETEACHER}/${params.employeeId}/${params.clazzId}`,
    method: 'put',
    data: params,
  })
}

/**
 *
 * @param id 员工ID
 * @param schoolId 学校ID
 * @param enable 9 禁用参数
 * @returns {AxiosPromise}
 */
export function staffOff(id, schoolId, enable) {
  return request({
    url: `${OFFSTAFF}/${id}/${schoolId}?enable=${enable}`,
    method: 'put',
  })
}
