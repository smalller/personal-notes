import {
  api_request,
  map_request,
  file_request,
} from "@/router/ip";


export const getList = (params) => {
  return api_request({
    url: '/blade-system/config/agreement/list/text',
    method: 'get',
    params: {
      ...params,
    }
  })
}

export const getOtherList = (params) => {
  return api_request({
    url: '/blade-system/config/agreement/list/protocol',
    method: 'get',
    params: {
      ...params,
    }
  })
}

export const getDetail = (id) => {
  return api_request({
    url: '/blade-system/config/agreement/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return api_request({
    url: '/blade-system/config/agreement/del',
    method: 'delete',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return api_request({
    url: '/blade-system/config/agreement/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return api_request({
    url: '/blade-system/config/agreement/submit',
    method: 'post',
    data: row
  })
}


export const getAgreementDatail = (params) => {
  return api_request({
    url: '/blade-system/config/agreement/detail',
    method: 'get',
    params: {
      ...params,
    }
  })
}

