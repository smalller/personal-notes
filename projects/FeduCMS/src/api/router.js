import request from '@/utils/request'
import { MENU } from '@/cms/api/login'
import cookie from 'vue-cookie'
export function getRouterList(params) {
  return request({
    url: MENU + '?userid=' + cookie.get(`${firmId}_user_id`),
    method: 'get',
    params,
  })
}
