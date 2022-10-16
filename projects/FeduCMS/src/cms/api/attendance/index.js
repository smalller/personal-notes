import request from '@/utils/request'

//图片下载接口
const GETPICTURE = '/mamserver/file/upload'
//下载图片
export function GetPicture(id) {
  return request({
    url: `${GETPICTURE}/${id}`,
    method: 'get',
  })
}
