import request from '@/utils/request'

const pageSize = {
  pageSize: 999,
  pageNo: 1,
}

/**
 * 广告位配置管理列表
 * @param params
 * @returns {AxiosPromise}
 * @constructor
 */
export function GetAdsPosConfigList(params = pageSize) {
  return request({
    url: '/community/api/adsPos/config/getAdsPosConfigList',
    method: 'GET',
    params,
  })
}

const orgParams = {
  module: '',
  area: '',
  relDataId: '',
}
/**
 * 根据内容ID查询内容详情
 * @param params
 * @returns {AxiosPromise}
 * @constructor
 */
export function GetOrgContent(params = orgParams) {
  return request({
    url: '/community/api/adsPos/getOrgContent',
    method: 'GET',
    params: params,
  })
}

const deleteConfig = {
  adsPosConfigIds: [],
}
/**
 * 广告位配置删除
 * @param params
 * @returns {AxiosPromise}
 * @constructor
 */
export function DeleteAdsPosConfig(params = deleteConfig) {
  return request({
    url: '/community/api/adsPos/config/deleteAdsPosConfig',
    method: 'DELETE',
    data: params,
  })
}

const formData = {
  adsCount: 0,
  adsKey: '',
  area: '',
  height: 0,
  dataType: [],
  id: '',
  module: '',
  portType: '',
  width: 0,
}

/**
 * 广告位配置新增编辑
 * @param data
 * @returns {AxiosPromise}
 * @constructor
 */
export function SaveAdsPosConfig(data = formData) {
  return request({
    url: '/community/api/adsPos/config/saveAdsPosConfig',
    method: 'post',
    data: data,
  })
}

/**
 * 查询所有模块
 * @returns {AxiosPromise}
 * @constructor
 */
export function QueryAllModule() {
  return request({
    url: '/community/api/adsPos/config/queryAllModule',
    method: 'get',
    params: {},
  })
}

const moduleConfig = {
  module: '',
}

/**
 * 根据模块名获取区域
 * @param params
 * @returns {AxiosPromise}
 * @constructor
 */
export function QueryAreaByModule(params = moduleConfig) {
  return request({
    url: '/community/api/adsPos/config/queryAreaByModule',
    method: 'get',
    params: params,
  })
}

/**
 * 获取广告位数据类型
 * @returns {AxiosPromise}
 * @constructor
 */
export function GetdataType() {
  return request({
    url: '/community/home/getHotspotDataType',
    method: 'get',
  })
}

const AdsPosListParams = {
  area: '',
  module: '',
  pageSize: 999,
  pageNo: 1,
  relDataName: '',
}
/**
 * 广告条件查询列表
 * @returns {AxiosPromise}
 * @constructor
 */
export function GetAdsPosList(params = AdsPosListParams) {
  return request({
    url: '/community/api/adsPos/getAdsPosList',
    method: 'get',
    params: params,
  })
}

const deleteAds = {
  adsPosIds: [],
}

/**
 * 广告删除
 * @param params
 * @returns {AxiosPromise}
 * @constructor
 */
export function DeleteAds(params = deleteAds) {
  return request({
    url: '/community/api/adsPos/deleteAdsPos',
    method: 'delete',
    data: params,
  })
}

/**
 * 保存广告
 * @param data
 * @returns {AxiosPromise}
 * @constructor
 */
export function SaveAdsPos(data) {
  return request({
    url: '/community/api/adsPos/saveAdsPos',
    method: 'post',
    data: data,
  })
}

const statusData = {
  adsId: '',
  status: true,
}

/**
 * 广告位上架/下架
 * @param data
 * @returns {AxiosPromise}
 * @constructor
 */
export function ChangeAdsStatus(data = statusData) {
  // const form = new FormData()
  // form.append('status', data.status)
  return request({
    url: `/community/api/adsPos/upOrDownAds/${data.adsId}?status=${data.status}`,
    method: 'post',
  })
}
