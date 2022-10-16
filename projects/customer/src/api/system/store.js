import request from '@/router/axios';

export const uploadFile = (file) => {
  let formData = new FormData();
  formData.append("file", file.file);
  return request({
    url: '/api/blade-resource/oss/jz/put-file',
    method: 'post',
    data: formData
  })
}

export const getList = (current, size, params) => {
  return request({
    url: '/api/blade-system/store/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getDetail = (id) => {
  return request({
    url: '/api/blade-system/store/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (id) => {
  return request({
    url: '/api/blade-system/store/del',
    method: 'delete',
    params: {
      id,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/blade-system/store/save/basic',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/blade-system/store/update',
    method: 'post',
    data: row
  })
}
