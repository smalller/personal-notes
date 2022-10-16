import request from '@/router/axios';

export const detail = () => {
  return request({
    url: '/api/ns-store/receivingAccount/detail',
    method: 'get',
    params: {

    }
  })
}

export const update = (row) => {
  return request({
    url: '/api/ns-store/receivingAccount/update',
    method: 'post',
    data: row
  })
}

export const resetPwd = (row) => {
  let formData = new FormData();
  for (let key in row) {
    formData.append(key, row[key]);
  }
  return request({
    url: '/api/ns-store/receivingAccount/resetPwd',
    method: 'post',
    data: formData
  })
}

export const getAuthCode = (telephone) => {
  return request({
    url: '/api/ns-store/receivingAccount/getSmsCode',
    method: 'get',
    params: {
      telephone
    }
  })
}
