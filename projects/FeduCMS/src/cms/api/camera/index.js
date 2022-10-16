//摄像头设备接口相关
import request from '@/utils/request'
export const CAMERALIST = '/facility/device/query' //查询摄像头列表

const CAMERADEL = '/facility/device' //删除摄像头
const CAMERAADD = '/facility/device/add' //添加摄像头设备
const CAMERAUPDATE = '/facility/device' //更新摄像头设备
const SPACELIST = '/facility/group/queryAli' //查询空间列表
const GETGBID = '/facility/device/getGbId' // 获取国际ID
/**
 * 获取国际ID
 * @returns {AxiosPromise}
 */
export function getGbId() {
  return request({ url: GETGBID, method: 'get' })
}

/**
 * 添加摄像头
 * @param params
 * @returns {AxiosPromise}
 */
export function camereAdd(params) {
  return request({ url: CAMERAADD, data: params, method: 'post' })
}

/**
 * 更新摄像头
 * @param params
 * @returns {AxiosPromise}
 */
export function camereUpdate(params, id) {
  return request({ url: `${CAMERAUPDATE}/${id}`, data: params, method: 'put' })
}

/**
 * 删除摄像头
 * @param params
 * @param id
 * @returns {AxiosPromise}
 */
export function cameraDelete(id) {
  return request({ url: `${CAMERADEL}/${id}`, method: 'delete' })
}

/**
 * 查询空间列表
 * @returns {AxiosPromise}
 */
export function getSpaceList(params) {
  return request({ url: `${SPACELIST}`, method: 'get', params })
}
