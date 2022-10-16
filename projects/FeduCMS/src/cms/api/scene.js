//创建园所相关
import request from '@/utils/request'
const DISABLEDSCENE = '/schools/api/scene/enable' //启用场景
const OPENEDSCENE = '/schools/api/scene/forbidden' //禁用场景

/**
 * 启用场景
 * @param params
 * @param id 场景ID
 * @returns {AxiosPromise}
 */
export function disableScene(schoolId, id) {
  return request({
    url: `${OPENEDSCENE}/${id}`,
    method: 'put',
    headers: {
      schoolId: schoolId,
    },
  })
}

/**
 * 禁用场景
 * @param params
 * @param id 场景ID
 * @returns {AxiosPromise}
 */
export function openScene(schoolId, id) {
  return request({
    url: `${DISABLEDSCENE}/${id}`,
    method: 'put',
    headers: {
      schoolId: schoolId,
    },
  })
}
