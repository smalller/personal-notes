//幼儿管理
import request from '@/utils/request'
const EDITCHILD = '/schools/student'
//修改幼儿信息
export function EditChildren(data, id) {
  return request({
    url: `${EDITCHILD}/${id}`,
    method: 'put',
    data,
  })
}

//获取幼儿管理家长信息
export function GetParentInfo(schoolId, id) {
  return request({
    url: `/schools/stuFamily/query?pageNo=1&pageSize=15&schoolId=${schoolId}&studentId=${id}`,
    method: 'get',
  })
}
