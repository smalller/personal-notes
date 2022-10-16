import {
  api_request,
  map_request,
  file_request,
} from "@/router/ip";

export const getList = (params) => {
  return api_request({
    url: '/ns-store/comment/page',
    method: 'get',
    params: {
      ...params,
    }
  })
}

export const getDetail = (id) => {
  return api_request({
    url: '/ns-store/comment/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return api_request({
    url: '/ns-store/comment/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return api_request({
    url: '/ns-store/comment/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return api_request({
    url: '/ns-store/comment/submit',
    method: 'post',
    data: row
  })
}

export const reply = (row) => {
  return api_request({
    url: '/ns-store/comment/reply',
    method: 'post',
    data: row
  })
}
