//动态管理
import request from '@/utils/request'
const UNPUBLISH = '/mamserver/api/dynamic/unpublish'
const PUBLISH = '/mamserver/api/dynamic/publish'
const DELETEACTIVITY = '/mamserver/api/dynamic/delete'
const MANSCHOOLACTIVITY = '/mamserver/api/dynamic/unpublish'
const UPACTIVITY = '/mamserver/api/dynamic/publish'

//新增运营动态数据
export function AddActivity(data) {
  return request({
    url: '/mamserver/api/dynamic/add',
    method: 'post',
    data,
  })
}
//修改运营动态数据
export function EditActivity(data) {
  return request({
    url: '/mamserver/api/dynamic/update',
    method: 'put',
    data,
  })
}

//上线动态
export function OnlineActivity(data) {
  return request({
    url: `${PUBLISH}/${data}`,
    method: 'put',
  })
}
//下线动态
export function OfflineActivity(data) {
  return request({
    url: `${UNPUBLISH}/${data}`,
    method: 'put',
  })
}

//删除动态
export function DeleteActivity(data) {
  return request({
    url: `${DELETEACTIVITY}/${data}`,
    method: 'delete',
  })
}

//园所动态下架
export function MamSchoolActivity(id) {
  return request({
    url: `${MANSCHOOLACTIVITY}/${id}`,
    method: 'put',
  })
}
//园所动态下架
export function UpSchoolActivity(id) {
  return request({
    url: `${UPACTIVITY}/${id}`,
    method: 'put',
  })
}

//园所动态批量删除
export function DelSchoolActivity(data) {
  return request({
    url: '/mamserver/api/dynamic/deleteBatch',
    method: 'delete',
    data,
  })
}

//园所动态批量下线
export function OffActivity(data) {
  return request({
    url: '/mamserver/api/dynamic/offLineBatch',
    method: 'put',
    data,
  })
}

// //园所员工查询
// export function getStaffLsit(data) {
//   return request({
//     url: '/mamserver/api/SchDynamic/offLineBatch',
//     method: 'put',
//     data,
//   })
// }
