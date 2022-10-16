import request from '@/utils/request'

/**
 * 分页查询考勤机
 * @param params
 * @returns {AxiosPromise}
 * @constructor
 */
export function QueryAttendanceMachine(params) {
  return request({
    url: '/facility/attendanceMachine/query',
    method: 'GET',
    params: params,
  })
}

/**
 *修改考勤机参数
 * @param data
 * @returns {AxiosPromise}
 * @constructor
 */
export function ChangeAttendanceMachine(data) {
  return request({
    url: `/facility/api/attMachine/${data.id}`,
    method: 'PUT',
    data: data,
  })
}

/**
 *人脸设备重启应用
 * @param data
 * @returns {AxiosPromise}
 */
export function reAppDevice(data) {
  return request({
    url: '/facility/api/hiot/device/reApp',
    method: 'post',
    params: data,
  })
}

/**
 *人脸设备重启设备
 * @param data
 * @returns {AxiosPromise}
 */
export function reDevice(data) {
  return request({
    url: '/facility/api/hiot/device/reDevice',
    method: 'post',
    params: data,
  })
}

/**
 *  人脸设备同步时间
 * @returns {AxiosPromise}
 */
export function deviceSynTime(data) {
  return request({
    url: '/facility/api/hiot/device/synTime',
    method: 'post',
    params: data,
  })
}

/**
 * 人脸设备同步用户
 * @param data
 * @returns {AxiosPromise}
 */
export function syncDeviceUser(data) {
  return request({
    url: '/facility/api/hiot/user/sync',
    method: 'post',
    params: data,
  })
}
