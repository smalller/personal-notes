import request from '@/utils/request';
import { QueryObj } from './data'

// 退款列表
export function selectRefundDetailsList(
    pageNum: number,
    pageSize: number,
    params: QueryObj
): Promise<any> {
    return request({
        url: '/pay-merchant/refund/selectRefundDetails',
        method: 'get',
        params: {
            pageNum,
            pageSize,
            ...params
        }
    });
}

// 退款详情
export function selectRefundDetail(
    id: number
): Promise<any> {
    return request({
        url: `/pay-merchant/refund/selectRefundDetail`,
        method: 'get',
        params: {
            id
        }
    });
}