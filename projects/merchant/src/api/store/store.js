import request from '@/router/axios';

export const getDetail = () => {
  return request({
    url: '/api/ns-store/store/detail',
    method: 'get',
    params: {

    }
  })
}

export const update = (row) => {
  return request({
    url: '/api/ns-store/store/update',
    method: 'post',
    data: row
  })
}

export const updateBusinessStatus = (row) => {
  return request({
    url: '/api/ns-store/store/updateBusinessStatus',
    method: 'post',
    data: row
  })
}

export const getLabelList = () => {
  return request({
    url: '/api/ns-store/store/getLabelList',
    method: 'get',
    params: {

    }
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
