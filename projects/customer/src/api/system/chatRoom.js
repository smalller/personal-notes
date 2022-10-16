import {
    api_request,
    map_request,
    file_request,
} from "@/router/ip";
export const getUserInfo = (userId) => {
    return api_request({
        url: '/ns-app/client/im/userInfo',
        method: 'get',
        params: {
            userId,
        }
    })
}
export const fileUpload = (row) => {
    return api_request({
      url: '/blade-resource/oss/jz/put-file',
      method: 'post',
      data: row
    })
  }
  