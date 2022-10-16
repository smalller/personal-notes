//栏目管理
import request from '@/utils/request'
//管理栏目启用禁用
const MANAGECATEGORY = '/mamserver/api/column/isAble'
//新增栏目数据
export function AddCategory(data) {
  return request({
    url: '/mamserver/api/column/add',
    method: 'post',
    data,
  })
}

//禁止或启用栏目
export function DisableCategory(id) {
  return request({
    url: `${MANAGECATEGORY}/${id}`,
    method: 'put',
  })
}

//修改栏目
export function EditCategory(data) {
  return request({
    url: '/mamserver/api/column/update',
    method: 'put',
    data,
  })
}
