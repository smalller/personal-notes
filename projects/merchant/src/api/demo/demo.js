// import request from '@/router/axios';

// import request from '@/router/axios';

import {
  api_request,
  map_request,
  file_request,
  imgHead,
  rongyunKey
} from "@/router/ip";


export const init = (data)=>{
  return api_request({
    url: '/admin/statistics/platformList',
    method: 'post',
    data: data
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
