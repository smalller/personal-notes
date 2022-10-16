import request from '@/utils/request'

//const serverURL = "https://vab-unicloud-3a9da9.service.tcloudbase.com";
//const apiURL = "/colorfulIcon/getList";

export function getIconList(params) {
  return request({
    url: '/colorfulIcon/getList',
    method: 'get',
    params,
  })
}
