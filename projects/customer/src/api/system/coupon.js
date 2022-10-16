import {
  api_request,
  map_request,
  file_request,
} from "@/router/ip";
export const getList = (row) => {
  return api_request({
    url: '/blade-system/coupon/list',
    method: 'get',
    params: {
      ...row,
    }
  })
}

export const getDetail = (id) => {
  return api_request({
    url: '/blade-system/coupon/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return api_request({
    url: '/blade-system/coupon/del',
    method: 'delete',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return api_request({
    url: '/blade-system/coupon/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return api_request({
    url: '/blade-system/coupon/submit',
    method: 'post',
    data: row
  })
}

