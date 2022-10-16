// 获取码值等公用接口
// 获取的数据 为 项目经常使用且不会动态改动的数据
import request from '@/utils/request'
const GETCOUNTRY = '/systemserver/commonArea/getPrentAreas' //根据id查询一堆地址
const GETCITYBYID = '/systemserver/commonArea/getArea' //根据id查询地址
const CODETYPE = '/systemserver/sysCode/queryByType' //获取年级码值
const SENDPICTURE = '/mamserver/file/uploadAndUserType' //图片上传接口
const GETPICTURE = '/mamserver/file' //文件下载接口
/**
 *
 * @param pid 父id
 * @returns {AxiosPromise}
 */
export function getAllAreaById(pid) {
  return request({
    url: `${GETCOUNTRY}?pid=${pid}`,
    method: 'post',
  })
}

/**
 *
 * @param id 需要查询的地址id
 * @returns {AxiosPromise}
 */
export function getAreaById(id) {
  return request({
    url: `${GETCITYBYID}?id = ${id}`,
    method: 'post',
  })
}

/**
 * 获取年级码值
 * @returns {AxiosPromise}
 */
export function getClazzType() {
  return request({
    url: `${CODETYPE}/NURSERY_GRADE_NAME`,
    method: 'get',
  })
}

/**
 * 获取称谓码值
 * @returns {AxiosPromise}
 */
export function getTitleType() {
  return request({
    url: `${CODETYPE}/NURSERY_EMPLOYEE_TITLE`,
    method: 'get',
  })
}

/**
 * 获取角色码值
 * @returns {AxiosPromise}
 */
export function getUserType() {
  return request({
    url: `${CODETYPE}/NURSERY_EMPLOYEE_ROLE`,
    method: 'get',
  })
}

/**
 * 上传图片数据
 * @returns {AxiosPromise}
 */
export function SendPicture(userType, data) {
  const formData = new FormData()
  formData.append('file', data)
  return request({
    url: `${SENDPICTURE}?bizType=article&userType=${userType}`,
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: formData,
  })
}
/**
 * 获取文件数据
 * @returns {AxiosPromise}
 */

export function GetFile(id) {
  return request({
    url: `${GETPICTURE}/${id}`,
    method: 'get',
  })
}

/**
 * 发布招生简章
 * @returns {AxiosPromise}
 */

export function SendEnrollment(data) {
  return request({
    url: '/schools/unAccess/admissions/update',
    method: 'post',
    data: data,
  })
}

/**
 * 获取招生简章
 * @returns {AxiosPromise}
 */

export function GetEnrollment(id) {
  return request({
    url: `/schools/unAccess/admissions/query?schoolId=${id}`,
    method: 'get',
  })
}
