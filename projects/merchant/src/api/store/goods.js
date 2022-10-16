import request from '@/router/axios';

export const getList = (row) => {
  return request({
    url: '/api/ns-store/goods/page',
    method: 'get',
    params: {
      ...row
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/ns-store/goods/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const getListStoreGoodsType = (row) => {
  return request({
    url: '/api/ns-store/goods/listStoreGoodsType',
    method: 'get',
    params: {
      ...row
    }
  })
}

export const updateStoreGoodsType = (row) => {
  return request({
    url: '/api/ns-store/goods/updateStoreGoodsType',
    method: 'post',
    params: {
      ...row
    }
  })
}

export const getDetail = (goodsId) => {
  return request({
    url: '/api/ns-store/goods/detail',
    method: 'get',
    params: {
      goodsId
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/ns-store/goods/save',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/ns-store/goods/update',
    method: 'post',
    data: row
  })
}

export const getAllListStoreGoodsType = () => {
  return request({
    url: '/api/ns-store/goods/getAll',
    method: 'get',
    params: {

    }
  })
}

export const sellOutGoods = (row) => {
  return request({
    url: '/api/ns-store/goods/goods/sellOut',
    method: 'post',
    params: {
      ...row
    }
  })
}
