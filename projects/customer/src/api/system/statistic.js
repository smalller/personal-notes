import {
    api_request,
    map_request,
    file_request,
} from "@/router/ip";

  
export const topCollect = (isDay)=>{
    return api_request({
        url: '/blade-system/statistic/total',
        method: 'get',
        params: {
            ...isDay
        }
    }) 
}
  
  
export const getChartList= (params) => {
    return api_request({
        url: '/blade-system/statistic/dynamic',
        method: 'get',
        params: {
            ...params,
        }
    })
}

export const getStoreVisit= (params) => {
    return api_request({
        url: '/blade-system/statistic/dynamic/hits',
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

export const storeList = (row) => {
    return api_request({
      url: '/blade-system/store/select',
      method: 'get',
      params: {...row}
    })
}
  