import {
  api_request,
  map_request,
  file_request,
  imgHead,
  rongyunKey
} from "@/router/ip";

export const getList = (data) => {
  return api_request({
    url: '/blade-system/search/recommend/list',
    method: 'get',
    params: {
      ...data,
    }
  })
}

export const remove = (ids) => {
  return api_request({
    url: '/blade-system/search/recommend/remove',
    method: 'delete',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return api_request({
    url: '/blade-system/search/recommend/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return api_request({
    url: '/blade-system/search/recommend/submit',
    method: 'post',
    data: row
  })
}

