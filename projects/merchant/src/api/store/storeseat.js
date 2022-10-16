import request from '@/router/axios';

export const getStoreFloorList = () => {
  return request({
    url: '/api/ns-store/storeseat/storeFloor/list',
    method: 'get',
    params: {

    }
  })
}

export const setStoreFloor = (data) => {
  return request({
    url: '/api/ns-store/storeseat/storeFloor/submit',
    method: 'post',
    data
  })
}

export const removeStoreFloor = (storeFloorId) => {
  return request({
    url: '/api/ns-store/storeseat/storeFloor/remove',
    method: 'post',
    params: {
      storeFloorId
    }
  })
}

export const getSeatListByStoreFloorId = (storeFloorId) => {
  return request({
    url: '/api/ns-store/storeseat/getSeatListByStoreFloorId',
    method: 'get',
    params: {
      storeFloorId
    }
  })
}

export const saveOrUpdateBatch = (row) => {
  return request({
    url: '/api/ns-store/storeseat/saveOrUpdateBatch',
    method: 'post',
    data: row
  })
}

export const getSotreSeatDetail = (storeSeatId) => {
  return request({
    url: '/api/ns-store/storeseat/detail',
    method: 'get',
    params: {
      storeSeatId
    }
  })
}

export const updateSotreSeatDetail = (row) => {
  return request({
    url: '/api/ns-store/storeseat/update',
    method: 'post',
    data: row
  })
}

export const removeSotreSeat = (ids) => {
  return request({
    url: '/api/ns-store/storeseat/remove',
    method: 'post',
    params: {
      ids
    }
  })
}

export const addSeatLayOut = (row) => {
  return request({
    url: '/api/ns-store/storeseat/addSeatLayOut',
    method: 'post',
    data: row
  })
}

export const delSeatLayOut = (row) => {
  return request({
    url: '/api/ns-store/storeseat/delSeatLayOut',
    method: 'post',
    data: row
  })
}
