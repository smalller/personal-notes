import {
  api_request,
  map_request,
  file_request,
} from "@/router/ip";

export const getList = (data) => {
  return api_request({
    url: '/blade-system/auth/list',
    method: 'get',
    params: {
      ...data,
    }
  })
}

export const getDetail = (id) => {
  return api_request({
    url: '/blade-system/auth/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return api_request({
    url: '/blade-system/auth/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return api_request({
    url: '/blade-system/auth/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return api_request({
    url: '/blade-system/auth/audit',
    method: 'post',
    params: {...row}
  })
}

