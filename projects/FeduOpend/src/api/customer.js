//注册用户管理
import request from '@/utils/request'

//修改VIP状态
export function SetVipInfo(data, id) {
  return request({
    url: '/userserver/api/user/operateVip',
    method: 'post',
    data,
  })
}

//批量修改VIP状态
export function SetAllVip(data, id) {
  return request({
    url: '/userserver/api/user/operateVipBatch',
    method: 'post',
    data,
  })
}

//获取用户信息数据
export function GetUserInfo(id) {
  return request({
    url: `/userserver/api/user/selectUserById?id=${id}`,
    method: 'get',
  })
}

//修改监控状态
export function SetCameraInfo(data, id) {
  return request({
    url: `/schools/api/stuFamily/onCamera?schoolId=${id}&isOperator=false`,
    method: 'post',
    data,
  })
}
