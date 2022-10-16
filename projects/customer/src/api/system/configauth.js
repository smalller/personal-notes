import {
  api_request,
  map_request,
  file_request,
  imgHead,
  rongyunKey
} from "@/router/ip";

export const getList = (row) => {
  return api_request({
    url: '/blade-system/config/auth/list',
    method: 'get',
    params: {
      ...row,
    }
  })
}

export const getDetail = (id) => {
  return api_request({
    url: '/blade-system/config/auth/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return api_request({
    url: '/blade-system/config/auth/del',
    method: 'delete',
    params: {
      ...ids
    },
  })
}

export const add = (row) => {
  return api_request({
    url: '/blade-system/config/auth/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return api_request({
    url: '/blade-system/config/auth/submit',
    method: 'post',
    data: row
  })
}

