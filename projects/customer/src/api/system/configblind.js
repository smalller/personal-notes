import {
  api_request,
  map_request,
  file_request,
} from "@/router/ip";

export const getList = (params) => {
  return api_request({
    url: '/blade-system/config/blind/list',
    method: 'get',
    params: {
      ...params,
    }
  })
}

export const getDetail = (id) => {
  return api_request({
    url: '/blade-system/configblind/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return api_request({
    url: '/blade-system/configblind/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return api_request({
    url: '/blade-system/config/blind/update',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return api_request({
    url: '/blade-system/config/blind/update',
    method: 'post',
    data: row
  })
}

