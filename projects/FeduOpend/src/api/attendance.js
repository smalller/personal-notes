//考勤管理
import request from '@/utils/request'

//新增考勤卡数据
export function AddUser(data) {
  return request({
    url: '/facility/attendanceInfo/importCard',
    method: 'post',
    data,
  })
}

//修改代理商信息
export function EditAgent(data) {
  return request({
    url: '/userserver/api/agent/update',
    method: 'post',
    data,
  })
}
