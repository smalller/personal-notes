// 获取码值等公用接口
// 获取的数据 为 项目经常使用且不会动态改动的数据
import request from '@/utils/request'
const GETCOUNTRY = '/systemserver/commonArea/getPrentAreas' //根据id查询一堆地址
const GETCITYBYID = '/systemserver/commonArea/getArea' //根据id查询地址
const CODETYPE = '/systemserver/sysCode/queryByType' //获取年级码值
/**
 *
 * @param pid 父id
 * @returns {AxiosPromise}
 */
export function getAllAreaById(pid) {
  return request({ url: `${GETCOUNTRY}?pid=${pid}`, method: 'post' })
}

/**
 *
 * @param id 需要查询的地址id
 * @returns {AxiosPromise}
 */
export function getAreaById(id) {
  return request({ url: `${GETCITYBYID}?id = ${id}`, method: 'post' })
}

/**
 * 获取年级码值
 * @returns {AxiosPromise}
 */
export function getClazzType() {
  return request({ url: `${CODETYPE}/NURSERY_GRADE_NAME`, method: 'get' })
}

/**
 * 获取称谓码值
 * @returns {AxiosPromise}
 */
export function getTitleType() {
  return request({ url: `${CODETYPE}/NURSERY_EMPLOYEE_TITLE`, method: 'get' })
}
