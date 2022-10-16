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

export const getGoodsList = (row) => {
  return request({
    url: '/api/ns-store/goods/getGoodsList',
    method: 'get',
    params: {
      ...row
    }
  })
}

export const getVipPhoto = (row) => {
  return request({
    url: '/api/ns-store/goods/getVipPhoto',
    method: 'get',
    params: {
      ...row
    }
  })
}
