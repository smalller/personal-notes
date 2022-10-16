// import request from '@/router/axios';
import {
  api_request,
  map_request,
  file_request,
} from "@/router/ip";

export const getList = (params) => {
  return api_request({
    url: '/ns-store/activity/page',
    method: 'get',
    params: {
      ...params,
    }
  })
}

export const getDetail = (id) => {
  return api_request({
    url: '/ns-store/activity/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return api_request({
    url: '/ns-store/activity/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return api_request({
    url: '/ns-store/activity/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return api_request({
    url: '/ns-store/activity/submit',
    method: 'post',
    data: row
  })
}

// 提交申请

export const fileUpload = (row) => {
  return api_request({
    url: '/blade-resource/oss/jz/put-file',
    method: 'post',
    data: row
  })
}

export const audit = (id) => {
  return api_request({
    url: '/ns-store/activity/apply',
    method: 'post',
    params: {
      id,
    }
  })
}