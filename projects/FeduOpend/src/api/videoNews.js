//视频新闻管理
import request from '@/utils/request'
//视频下载接口
const GETVIDEO = '/mamserver/file/upload'
//新增代理商信息
export function GetVideo(id) {
  return request({
    url: `${GETVIDEO}/${id}`,
    method: 'get',
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
