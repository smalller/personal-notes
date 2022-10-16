// nvr相关
import request from '@/utils/request'
export const QUERYNVRDEVICE = '/facility/api/device/queryNvrDevice' // 查询代理商nvr列表
export const DEVICEDELETE = '/facility/device/' // 删除代理商nvr列表
export const INSERTDEVICE = '/facility/device/applyDevice' // 代理商申请设备
export const INSERTCHANNEL = '/facility/device/applyAddChannel' // 代理商增加通道
export const STOPDEVICE = '/facility/api/device/batchStopDevices' // 代理商批量停用设备
export const STARTDEVICE = '/facility/api/device/batchStartDevices' // 代理商批量启用设备
export const CAREMALIST = '/facility/device/query' // 列表查询摄像头
export const ADDCAREMA = '/facility/api/device/applyOneDevice' // 添加摄像头
export const ADDEV = '/facility/api/ezviz/add' //添加萤石摄像头
export const EDITEV = '/facility/api/ezviz/updateName' //修改萤石摄像头名称
export const DELEV = '/facility/api/ezviz/delete' //删除萤石摄像头
export const EVLIST = '/facility/api/ezviz/queryEzvizDeviceBySchool'
/**
 * 查询支付方式
 * @returns {AxiosPromise}
 */
export function getGatewayType() {
  return request({
    url: GETGATEWAYTYPE,
    method: 'get',
  })
}

/**
 * 查询订单状态
 * @returns {AxiosPromise}
 */
export function getOrderStatus() {
  return request({
    url: GETORDERSTATUS,
    method: 'get',
  })
}

/**
 * 添加摄像头
 * @returns {AxiosPromise}
 */
export function addCamera() {
  return request({
    url: ADDCAREMA,
    method: 'post',
  })
}

/**
 * 添加萤石摄像头
 * @returns {AxiosPromise}
 */
export function addEv() {
  return request({
    url: ADDEV,
    method: 'post',
  })
}
