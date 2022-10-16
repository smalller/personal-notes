//版本管理
import request from '@/utils/request'
const DELETEVERSION = '/mamserver/api/version/delete'
//新增版本信息
export function AddVersion(data) {
  return request({
    url: '/mamserver/api/version/add',
    method: 'post',
    data,
  })
}

//修改版本信息
export function EditVersion(data) {
  return request({
    url: '/mamserver/api/version/update',
    method: 'put',
    data,
  })
}
//删除版本信息
export function DeleteVersion(id) {
  return request({
    url: `${DELETEVERSION}/${id}`,
    method: 'delete',
  })
}
