//幼儿接口相关
import request from '@/utils/request'

export const CHILDLIST = '/schools/student/query' //幼儿列表
export const BATCHCHILDREN = 'userserver/user/batchInsertStu' //批量导入学生
const ISEXIT = '/schools/student/exist' //根据姓名手机号判断幼儿是否存在
const CHILDADD = '/schools/student/add' //添加幼儿
const SEARCHFAMILY = '/schools/stuFamily/queryFamiliesByStudent' //根据id查询家长
const EDITCHILD = '/schools/student'

export function editChild(params, id) {
  return request({ url: `${EDITCHILD}/${id}`, data: params, method: 'put' })
}

/**
 * 判断幼儿是否存在
 * @param params
 * @returns {AxiosPromise}
 */
export function childEixt(params) {
  return request({ url: ISEXIT, data: params, method: 'post' })
}

/**
 * 添加幼儿
 * @param params
 * @returns {AxiosPromise}
 */
export function addChild(params) {
  return request({ url: CHILDADD, data: params, method: 'post' })
}

/**
 * 根据id查询学生家长
 * @param studentIds 学生id 多个逗号分隔
 * @returns {AxiosPromise}
 */
export function searchFamily(studentIds) {
  return request({ url: `${SEARCHFAMILY}?studentIds=${studentIds}` })
}
