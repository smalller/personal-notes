//公用接口管理
import request from '@/utils/request'

//文件下载接口
const GETPICTURE = '/mamserver/file'

//评论数据获取
const GETCOMMENT = '/community/comment/queryComments'

//删除评论数据
const DELETECOMMENT = '/community/comment'

//获取文件数据
export function GetFile(id) {
  return request({
    url: `${GETPICTURE}/${id}`,
    method: 'get',
  })
}

//获取评论信息
export function GetComment(id) {
  return request({
    url: `${GETCOMMENT}?hasRec=true&relatedId=${id}`,
    method: 'get',
  })
}

//删除评论数据
export function DelComment(id) {
  return request({
    url: `${DELETECOMMENT}/${id}`,
    method: 'delete',
  })
}

//新增评论数据
export function AddComment(data) {
  return request({
    url: '/community/comment/add',
    method: 'post',
    data,
  })
}

//批量禁言用户
export function MuteUser(data) {
  return request({
    url: '/userserver/api/banTalk/operateBanTalk?status=1',
    method: 'post',
    data,
  })
}

//批量解禁用户
export function UnMuteUser(data) {
  return request({
    url: '/userserver/api/banTalk/operateBanTalk?status=0',
    method: 'post',
    data,
  })
}

/**
 * 新增学校信息
 * @param params
 * @returns {*}
 */
export const addSchool = (data) =>
  request({
    url: '/schools/api/Applet/add',
    method: 'post',
    data,
  })
