// import request from '@/router/axios';
import {
  api_request,
  map_request,
  file_request,
  imgHead,
  rongyunKey
} from "@/router/ip";

export const getList = (params) => {
  return api_request({
    url: '/ns-store/coupon/page',
    method: 'get',
    params: {
      ...params,
    }
  })
}

export const getDetail = (id) => {
  return api_request({
    url: '/ns-store/coupon/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return api_request({
    url: '/ns-store/coupon/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return api_request({
    url: '/ns-store/coupon/save',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return api_request({
    url: '/ns-store/coupon/update',
    method: 'post',
    data: row
  })
}

export const enableFun = (row) => {
  return api_request({
    url: '/ns-store/coupon/updateStatus',
    method: 'post',
    params: {
      ...row
    }
  })
}

