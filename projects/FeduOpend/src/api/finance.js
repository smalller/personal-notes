//订单信息管理
import request from '@/utils/request'
const REPAY = 'orders/agent/sendReturn/'
//重新打款
export function getRePay(id) {
  return request({
    url: `${REPAY}${id}`,
    method: 'get',
  })
}
