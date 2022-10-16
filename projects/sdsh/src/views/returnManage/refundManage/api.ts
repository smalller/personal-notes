import request from '@/utils/request';
import { QueryObj } from './data'

// 退费列表
export function selectRefund(
    pageNum: number,
    pageSize: number,
    params: QueryObj
): Promise<any> {
    return request({
        url: '/pay-merchant/refund/selectRefund',
        method: 'get',
        params: {
            pageNum,
            pageSize,
            ...params
        }
    });
}

// 新增退款
export function insertRefund(
    data: any
): Promise<any> {
    return request({
        url: `/pay-merchant/Merchant/RefundRequest`,
        method: 'post',
        data
    });
}