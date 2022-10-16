import {
  api_request,
  map_request,
  file_request,
} from "@/router/ip";

export const getList = (params) => {
  return api_request({
    url: '/blade-system/microblog/list',
    method: 'get',
    params: {
      ...params,
    }
  })
}

export const getDetail = (id) => {
  return api_request({
    url: '/blade-system/microblog/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return api_request({
    url: '/blade-system/microblog/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return api_request({
    url: '/blade-system/microblog/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return api_request({
    url: '/blade-system/microblog/submit',
    method: 'post',
    data: row
  })
}


// 获取所有评论
export const allComment = (row) => {
  return api_request({
    url: '/blade-system/comment/list',
    method: 'get',
    params: {...row}
  })
}

// 批量删除评论
export const delComment = (ids) => {
  return api_request({
    url: '/blade-system/comment/del',
    method: 'delete',
    params: {ids}
  })
}