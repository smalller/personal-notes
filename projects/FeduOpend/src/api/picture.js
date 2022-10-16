//图片管理
import request from '@/utils/request'
const DELETEPICTURE = '/mamserver/api/picture/delete'
const RECOVERPICTURE = '/mamserver/api/picture/recover'
const TRUEDELPICTURE = '/mamserver/api/picture/remove'
//删除图片信息
export function DeletePicture(id) {
  return request({
    url: `${DELETEPICTURE}/${id}`,
    method: 'put',
  })
}

//恢复图片信息
export function RecoverPicture(id) {
  return request({
    url: `${RECOVERPICTURE}/${id}`,
    method: 'put',
  })
}
//修改代理商信息
export function TrueDelPicture(id) {
  return request({
    url: `${TRUEDELPICTURE}/${id}`,
    method: 'delete',
  })
}
