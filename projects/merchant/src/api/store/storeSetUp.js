import {
  api_request,
  map_request,
  file_request,
} from "@/router/ip";


export const getFloorList = () => {
  return api_request({
    url: '/ns-store/storeseat/storeFloor/list',
    method: 'get',
    params: {

    }
  })
}


export const getFloorInfo = (params) => {
  return api_request({
    url: '/ns-store/storeSetUp/listSeatInfoByStoreFloorId',
    method: 'get',
    params: {
      ...params,
    }
  })
}

export const updateSeatStatus = (row) => {
  return api_request({
    url: '/ns-store/storeSetUp/updateSeatStatus',
    method: 'post',
    params: {
      ...row
    }
  })
}
