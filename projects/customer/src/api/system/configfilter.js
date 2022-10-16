import {
  api_request,
  map_request,
  file_request,
} from "@/router/ip";

export const getList = (current, size, params) => {
  return api_request({
    url: '/blade-system/config/filter/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}



export const update = (row) => {
  return api_request({
    url: '/blade-system/config/filter/update',
    method: 'put',
    data: row
  })
}

