import {
    api_request,
    map_request,
    file_request,
    imgHead,
    rongyunKey
} from "@/router/ip";

  
export const getFloorList = (storeFloorId)=>{
    return api_request({
        url: '/ns-store/storeSetUp/getSeatListByStoreFloorId',
        method: 'get',
        params: {
            storeFloorId
        }
    }) 
}
  
  
  // export const getList = (current, size, params) => {
  //   return request({
  //     url: '/api/blade-desk/notice/list',
  //     method: 'get',
  //     params: {
  //       ...params,
  //       current,
  //       size,
  //     }
  //   })
  // }
  
  // export const remove = (ids) => {
  //   return request({
  //     url: '/api/blade-desk/notice/remove',
  //     method: 'post',
  //     params: {
  //       ids,
  //     }
  //   })
  // }
  