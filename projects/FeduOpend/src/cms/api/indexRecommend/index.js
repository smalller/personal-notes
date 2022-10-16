import request from '@/utils/request'

// 分页查询推荐列表
export const getRecommendList = (params) => {
  return request({
    url: '/mamserver/homePop/query',
    method: 'get',
    params,
  })
}

// 移除推荐
export const deleteRecommend = (params) => {
  return request({
    url: '/mamserver/homePop/deletePop',
    method: 'post',
    params,
  })
}

// 刷新推荐
export const flushRecommend = (params) => {
  return request({
    url: '/mamserver/homePop/refreshPop',
    method: 'get',
    params,
  })
}

// 通过小节id获取专辑id
export const sourceIdToMediaDetail = (params) => {
  return request({
    url: '/mamserver/mediaAlbum/unAccess/getMediaAlbumByItemId',
    method: 'get',
    params,
  })
}
