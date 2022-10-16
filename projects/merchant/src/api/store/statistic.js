import {
    api_request,
    map_request,
    file_request,
} from "@/router/ip";

  
export const topCollect = (isDay)=>{
    return api_request({
        url: '/ns-store/statistic/total',
        method: 'get',
        params: {
            ...isDay
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


export const getChartList= (params) => {
    return api_request({
        url: '/ns-store/statistic/dynamic',
        method: 'get',
        params: {
            ...params,
        }
    })
}