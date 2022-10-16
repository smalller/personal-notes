import request from '@/router/axios';

export const changeStore = (storeId) => {
  return request({
    url: '/api/ns-store/loginStore/change',
    method: 'get',
    params: {
      storeId
    }
  })
}
