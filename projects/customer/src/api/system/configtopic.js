import {
  api_request,
  map_request,
  file_request,
} from "@/router/ip";

export const getList = (row) => {
  return api_request({
    url: '/blade-system/config/topic/list',
    method: 'get',
    params: {
      ...row,
    }
  })
}

export const getDetail = (id) => {
  return api_request({
    url: '/blade-system/config/topic/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return api_request({
    url: '/blade-system/config/topic/del',
    method: 'delete',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return api_request({
    url: '/blade-system/config/topic/save',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return api_request({
    url: '/blade-system/config/topic/update',
    method: 'post',
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

