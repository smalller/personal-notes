import request from "@/base/request";

export const getFileUrl = fileId => request(`/mamserver/file/${fileId}`, {
  method: 'GET',
})
