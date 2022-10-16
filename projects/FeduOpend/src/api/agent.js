//代理商管理
import request from '@/utils/request'

//新增代理商信息
export function newAddAgent(data) {
  return request({
    url: '/userserver/api/agent/insert',
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

//禁用代理商
export function DisbleAgent(data) {
  return request({
    url: '/userserver/api/agent/disable',
    method: 'post',
    data,
  })
}

//启用代理商
export function OpenAgent(data) {
  return request({
    url: '/userserver/api/agent/enable',
    method: 'post',
    data,
  })
}
