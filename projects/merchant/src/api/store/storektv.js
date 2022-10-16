import request from '@/router/axios';

export const getList = (row) => {
  return request({
    url: '/api/ns-store/storektv/page',
    method: 'get',
    params: {
      ...row,
      size: 20,
      current: 1
    }
  })
}

export const getDetail = (ktvRoomId) => {
  return request({
    url: '/api/ns-store/storektv/detail',
    method: 'get',
    params: {
      ktvRoomId
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/ns-store/storektv/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/ns-store/storektv/save',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/ns-store/storektv/update',
    method: 'post',
    data: row
  })
}

export const uploadFile = (file) => {
  let formData = new FormData();
  formData.append("file", file.file);
  return request({
    url: '/api/blade-resource/oss/jz/put-file',
    method: 'post',
    data: formData
  })
}

export const getGoodsList = (row) => {
  return request({
    url: '/api/ns-store/goods/getGoodsList',
    method: 'get',
    params: {
      ...row
    }
  })
}
