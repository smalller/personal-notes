import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/ns-store/userstock/page',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getDrinksList = (userStockId) => {
  return request({
    url: '/api/ns-store/userstock/detail',
    method: 'get',
    params: {
      userStockId
    }
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

export const takeWine = (userStockId) => {
  return request({
    url: '/api/ns-store/userstock/takeWine',
    method: 'post',
    params: {
      userStockId,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/ns-store/userstock/save',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/ns-store/userstock/update',
    method: 'post',
    data: row
  })
}
