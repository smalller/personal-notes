import request from '@/utils/request'

/**
 * 获取上传文件URL
 * @param id
 * @returns {AxiosPromise}
 */
export function getFileUrl(id) {
  return request({ url: `/mamserver/api/file/upload/${id}`, method: 'get' })
}
