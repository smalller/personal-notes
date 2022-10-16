import request from "@/base/request";

export const getFileUrl = fileId => request(`/mamserver/file/${fileId}`, {
  method: 'GET',
})

export const getWeChatAppId = url => request('/pays/paycert/unAccess/getWXJsSDK', {
  method: 'GET',
  params: {
    url: url
  }
})
