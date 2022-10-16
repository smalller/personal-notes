import {
  api_request,
  map_request,
  file_request,
} from "@/router/ip";

export const getList = (current, size, params) => {
  return api_request({
    url: '/blade-system/config/report/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getDetail = (id) => {
  return api_request({
    url: '/blade-system/config/report/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return api_request({
    url: '/blade-system/config/report/del',
    method: 'delete',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return api_request({
    url: '/blade-system/config/report/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return api_request({
    url: '/blade-system/config/report/update',
    method: 'post',
    data: row
  })
}


export const getReportList = (row) => {
  return api_request({
    url: '/blade-system/report/list',
    method: 'get',
    params: {
      ...row,
    }
  })
}

export const removeReportList = (ids) => {
  return api_request({
    url: '/blade-system/report/del',
    method: 'post',
    params: {
      ids,
    }
  })
}
export const fileUpload = (row) => {
  return api_request({
    url: '/blade-resource/oss/jz/put-file',
    method: 'post',
    data: row
  })
}
