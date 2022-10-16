import {
  api_request,
  map_request,
  file_request,
} from "@/router/ip";

export const getList = (params) => {
  return api_request({
    url: '/blade-system/config/business/list',
    method: 'get',
    params: {
      ...params,
    }
  })
}

export const getDetail = (id) => {
  return api_request({
    url: '/blade-system/config/business/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (districtCodes) => {
  return api_request({
    url: '/blade-system/config/business/del',
    method: 'delete',
    params: {
      districtCodes,
    }
  })
}

export const add = (row) => {
  return api_request({
    url: '/blade-system/config/business/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return api_request({
    url: '/blade-system/config/business/submit',
    method: 'post',
    data: row
  })
}

export const areas = (params) => {
  return api_request({
    url: '/blade-system/config/business/regions',
    method: 'get',
    params: {
      ...params,
    }
  })
}


