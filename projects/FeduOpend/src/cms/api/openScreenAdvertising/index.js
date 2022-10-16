import request from '@/utils/request'

/**
 * 获取开屏广告列表
 * @param params
 * @returns {*}
 */
export const getScreenAdvertising = (params) =>
  request({
    url: '/mamserver/api/screen/queryScreenPage',
    method: 'GET',
    params,
  })

/**
 * 删除开屏广告
 * @param id
 * @returns {*}
 */
export const delScreenAdvertising = (id) =>
  request({
    url: `/mamserver/api/screen/deleteImage/${id}`,
    method: 'DELETE',
  })

/**
 * 启用开屏广告
 * @param id
 * @returns {*}
 */
export const useScreenAdvertising = (id) =>
  request({
    url: `/mamserver/api/screen/useImage/${id}`,
    method: 'put',
  })

/**
 * 保存开屏广告
 * @param params
 * @returns {*}
 */
export const saveScreenAdvertising = (params) =>
  request({
    url: '/mamserver/api/screen/saveOrUpdate',
    method: 'POST',
    data: params,
  })
