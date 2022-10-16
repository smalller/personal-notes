import request from '@/utils/request'

const RESET_ATT_CARD = '/facility/api/att/card/reset/'

/**
 * 解绑考勤卡
 * @param params
 * @returns {AxiosPromise}
 * @constructor
 */
export function ResetAttCard(params) {
  return request({
    url: RESET_ATT_CARD + params.id,
    method: 'put',
    params: params,
  })
}
