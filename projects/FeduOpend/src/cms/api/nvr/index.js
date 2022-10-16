// nvr相关
import request from '@/utils/request'
export const QUERYNVRDEVICE = '/facility/api/device/queryNvrDevice' // 查询nvr列表
export const DEVICEDELETE = '/facility/device/' // 删除代理商nvr列表
export const INSERTDEVICE = '/facility/device/applyDevice' // 代理商申请设备
export const INSERTCHANNEL = '/facility/device/applyAddChannel' // 代理商增加通道
export const STOPDEVICE = '/facility/device/batchStopDevices' // 代理商批量停用设备
export const STARTDEVICE = '/facility/device/batchStartDevices' // 代理商批量启用设备
export const CAREMALIST = '/facility/device/query' // 列表查询摄像头

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
