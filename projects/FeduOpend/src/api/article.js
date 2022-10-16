//图文信息管理
import request from '@/utils/request'
//图文信息删除接口
const DELETEARTICLE = '/mamserver/api/article/delete'
//图文信息删除接口
const RECOVERARTICLE = '/mamserver/api/article/restore'
//图片上传接口
const SENDPICTURE = '/mamserver/file/uploadAndUserType'
//视频上传接口
const SENDVIDEO = '/mamserver/file/uploadPart'
//获取图文信息数据
const GETARTICLE = '/mamserver/api/article/queryById'
//获取栏目信息数据
const GETCATEGORY = '/mamserver/api/column/query'
//下线文章
const UNPUBLISH = '/mamserver/api/article/unpublish'
//上线文章
const PUBLISH = '/mamserver/api/article/publish'
//刷新文章
const UPDATEARITICLE = '/mamserver/article/refresh'
export function AddArticle(data) {
  return request({
    url: '/mamserver/api/article/add',
    method: 'post',
    data,
  })
}
//编辑文章
export function EditArticle(data) {
  return request({
    url: '/mamserver/api/article/update',
    method: 'put',
    data,
  })
}
//删除文章
export function DeleteArticle(id) {
  return request({
    url: `${DELETEARTICLE}/${id}`,
    method: 'delete',
  })
}
//恢复文章
export function RecoverArticle(id) {
  return request({
    url: `${RECOVERARTICLE}/${id}`,
    method: 'put',
  })
}
//上线文章
export function OnlineArticle(data) {
  return request({
    url: `${PUBLISH}/${data}`,
    method: 'get',
  })
}
//下线文章
export function OfflineArticle(data) {
  return request({
    url: `${UNPUBLISH}/${data}`,
    method: 'get',
  })
}
//获取图文数据
export function GetArticle(id) {
  return request({
    url: `${GETARTICLE}/${id}`,
    method: 'get',
  })
}

//获取栏目信息数据
export function GetCategory(status) {
  return request({
    url:
      status === undefined
        ? `${GETCATEGORY}`
        : `${GETCATEGORY}?status=${status}`,
    method: 'get',
  })
}
//上传图片数据
export function SendPicture(userType, data) {
  const formData = new FormData()
  formData.append('file', data)
  return request({
    url: `${SENDPICTURE}?bizType=article&userType=${userType}`,
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: formData,
  })
}
//上传影片
export function SendAllVideo(fileName, isComplete, data, partId) {
  const formData = new FormData()
  formData.append('file', data)
  return request({
    url:
      partId === undefined
        ? `${SENDVIDEO}?bizType=Video&fileName=${fileName}&isComplete=${isComplete}`
        : `${SENDVIDEO}?bizType=Video&fileName=${fileName}&isComplete=${isComplete}&partId=${partId}`,
    //url: `http://192.168.1.175:8081/mamserver/file/uploadPart?bizType=Video&fileName=${fileName}&isComplete=${isComplete}&partId=${partId}`,
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: formData,
    onUploadProgress: function (progressEvent) {
      let complete = ((progressEvent.loaded / progressEvent.total) * 100) | 0
      // console.log('上传 ' + complete)
    },
  })
}

//推荐文章
export function PopArticle(data) {
  return request({
    url: '/mamserver/article/popHome',
    method: 'post',
    data,
  })
}

//刷新文章
export function UpdateArticle(id) {
  return request({
    url: `${UPDATEARITICLE}/${id}`,
    method: 'post',
  })
}
