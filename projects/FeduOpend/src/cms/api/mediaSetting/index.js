import request from '@/utils/request'
const GET_COLUMN = '/mamserver/api/column/query'
const ADD_MEDIA_ALBUM = '/mamserver/mediaAlbum/add'
const EDIT_MEDIA_ALBUM = '/mamserver/mediaAlbum/'
const DELETE_MEDIA_ALBUM = '/mamserver/mediaAlbum/'
const PUBLISH_MEDIA_ALBUM = '/mamserver/mediaAlbum/publish/'
const QUERY_MEDIA_ALBUM = '/mamserver/mediaAlbum/query'
const OFFLINE_MEDIA_ALBUM = '/mamserver/mediaAlbum/offLine/'
const EDIT_MEDIA_ALBUM_ITEM = '/mamserver/mediaAlbumItem/'
const DELETE_MEDIA_ALBUM_ITEM = '/mamserver/mediaAlbumItem/'
const ADD_MEDIA_ALBUM_ITEM = '/mamserver/mediaAlbumItem/add'
const QUERY_MEDIA_ALBUM_ITEM = '/mamserver/mediaAlbumItem/getItems/'
const POP_HOME_ALBUM = '/mamserver/mediaAlbum/popHome'
const TOP_PING_ALBUM = '/mamserver/mediaAlbum/topping'
const REFRESH_ALBUM = '/mamserver/mediaAlbum/refresh/'
const UN_TOPPING = '/mamserver/mediaAlbum/unTopping/'
const EDIT_POPULAR_MEDIA_ALBUM = '/mamserver/mediaAlbum/popular/'
const ARTICLE_LIST_QUERY = '/mamserver/api/article/query'
const UPDATE_ARTICLE_ITEM = '/mamserver/api/article/updatePopular'

/**
 * 添加专辑
 * @returns {AxiosPromise}
 */
export function subMediaAlbum(params) {
  return request({
    url: ADD_MEDIA_ALBUM,
    method: 'post',
    data: params,
  })
}

/**ou
 * 编辑专辑
 * @returns {AxiosPromise}
 */
export function EditMediaAlbum(params) {
  return request({
    url: `${EDIT_MEDIA_ALBUM}${params.id}`,
    method: 'put',
    data: params,
  })
}

/**
 * 不验证上线状态编辑接口
 * @param params
 * @returns {AxiosPromise}
 * @constructor
 */
export function EditMediaAlbumPopular(params) {
  return request({
    url: `${EDIT_POPULAR_MEDIA_ALBUM}${params.id}`,
    method: 'put',
    data: params,
  })
}

/**
 * 删除专辑
 * @returns {AxiosPromise}
 */
export function DeleteMediaAlbum(params) {
  return request({
    url: DELETE_MEDIA_ALBUM + params.id,
    method: 'delete',
    params: params,
  })
}

/**
 * 发布专辑
 * @returns {AxiosPromise}
 */
export function PublishMediaAlbum(params) {
  return request({
    url: PUBLISH_MEDIA_ALBUM + params.id,
    method: 'post',
    params: params,
  })
}

/**
 * 下架专辑
 * @param params
 * @returns {AxiosPromise}
 */
export function OffLineMediaAlbum(params) {
  return request({
    url: OFFLINE_MEDIA_ALBUM + params.id,
    method: 'post',
    params: params,
  })
}

/**
 * 查询专辑列表
 * @returns {AxiosPromise}
 */
export function QueryMediaAlbum(params) {
  return request({
    url: QUERY_MEDIA_ALBUM,
    method: 'get',
    params: params,
  })
}

/**
 * 图文新闻列表查询
 * @param params
 * @returns {AxiosPromise}
 * @constructor
 */
export function QueryTextList(params) {
  return request({
    url: ARTICLE_LIST_QUERY,
    method: 'get',
    params: params,
  })
}

/**
 * 更新图文
 * @param params
 * @returns {AxiosPromise}
 * @constructor
 */
export function EditArticleItem(params) {
  return request({
    url: UPDATE_ARTICLE_ITEM,
    method: 'put',
    data: params,
  })
}

/**
 * 编辑小节
 * @returns {AxiosPromise}
 */
export function EditMediaAlbumItem(params) {
  return request({
    url: EDIT_MEDIA_ALBUM_ITEM + params.id,
    method: 'put',
    data: params,
  })
}

/**
 * 删除小节
 * @returns {AxiosPromise}
 */
export function DeleteMediaAlbumItem(params) {
  return request({
    url: DELETE_MEDIA_ALBUM_ITEM + params.id,
    method: 'delete',
    params: params,
  })
}

/**
 * 添加小节
 * @returns {AxiosPromise}
 */
export function AddMediaAlbumItem(params) {
  return request({
    url: ADD_MEDIA_ALBUM_ITEM,
    method: 'post',
    data: params,
  })
}

/**
 * 查询小节
 * @returns {AxiosPromise}
 */
export function QueryMediaAlbumItem(params) {
  return request({
    url: QUERY_MEDIA_ALBUM_ITEM + params.id,
    method: 'get',
    params: params,
  })
}

/**
 * 获取可用栏目
 */
export function GetColumn() {
  return request({
    url: GET_COLUMN,
    method: 'get',
    params: {
      status: '1',
    },
  })
}

/**
 * 音视频推荐到首页
 * @param {Object} params
 */
export function PopHomeAlbum(params) {
  return request({
    url: POP_HOME_ALBUM,
    method: 'post',
    data: params,
  })
}

/**
 * 音视频推广到顶部
 * @param {Object} params
 */
export function ToppingAlbum(params) {
  return request({
    url: TOP_PING_ALBUM,
    method: 'post',
    data: params,
  })
}

/**
 * 音视频刷新
 * @param {Object} params
 */
export function RefreshAlbum(params) {
  return request({
    url: REFRESH_ALBUM + params.id,
    method: 'post',
    data: params,
  })
}

/**
 * 取消推广
 * @param params
 * @returns {AxiosPromise}
 * @constructor
 */
export function UnToppingAlbum(params) {
  return request({
    url: UN_TOPPING + params.id,
    method: 'post',
    data: params,
  })
}
