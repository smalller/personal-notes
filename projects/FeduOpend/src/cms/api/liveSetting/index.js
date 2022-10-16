import request from '@/utils/request'

const LIVE_VIDEO_QUERY = '/mamserver/api/liveVideo/query'
const LIVE_VIDEO_ADD = '/mamserver/api/liveVideo/add'
const LIVE_VIDEO_DELETE = '/mamserver/api/liveVideo/delete/'
const LIVE_VIDEO_PUBLISH = '/mamserver/api/liveVideo/publish'
const LIVE_VIDEO_UNPUBLISH = '/mamserver/api/liveVideo/unpublish'
const LIVE_VIDEO_UPDATE = '/mamserver/api/liveVideo/update'

export function LiveVideoQuery(params) {
  return request({
    url: LIVE_VIDEO_QUERY,
    method: 'get',
    params: params,
  })
}

export function LiveVideoAdd(params) {
  return request({
    url: LIVE_VIDEO_ADD,
    method: 'post',
    data: params,
  })
}

export function LiveVideoDelete(params) {
  return request({
    url: LIVE_VIDEO_DELETE + params.id,
    method: 'delete',
    data: params,
  })
}

export function LiveVideoPublish(params) {
  return request({
    url: LIVE_VIDEO_PUBLISH + '?id=' + params.id,
    method: 'put',
    data: params,
  })
}

export function LiveVideoUnPublish(params) {
  return request({
    url: LIVE_VIDEO_UNPUBLISH + '?id=' + params.id,
    method: 'put',
    data: params,
  })
}

export function LiveVideoUpdate(params) {
  return request({
    url: LIVE_VIDEO_UPDATE,
    method: 'put',
    data: params,
  })
}
