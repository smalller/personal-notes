import {
  api_request,
  map_request,
  file_request,
  imgHead,
  rongyunKey
} from "@/router/ip";

export const getList = () => {
  return api_request({
    url: '/blade-system/config/sort/list',
    method: 'get',
    params: {}
  })
}

export const update = (row) => {
  return api_request({
    url: '/blade-system/config/sort/update',
    method: 'put',
    data: row
  })
}
export const fileUpload = (row) => {
  return api_request({
    url: '/blade-resource/oss/jz/put-file',
    method: 'post',
    data: row
  })
}
