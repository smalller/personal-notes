import request from '@/utils/request'

//const serverURL = "https://vab-unicloud-3a9da9.service.tcloudbase.com";
//const apiURL = "/remixIcon/getList";

export function getIconList(params) {
  return request({
    url: '/remixIcon/getList',
    method: 'get',
    params,
  })
}
