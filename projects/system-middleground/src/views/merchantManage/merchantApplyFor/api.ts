import request from '@/utils/request';
import { QueryObj } from './data'

// 商户列表
export function merchantApplyList(
    pageNum: number,
    pageSize: number,
    params: QueryObj
): Promise<any> {
    return request({
        url: '/pay-mg/merchant/getMerchantApplyPageInfo',
        method: 'get',
        params: {
            pageNum,
            pageSize,
            ...params
        }
    });
}

// 商户详情
export function applyDetail(
    bankId: number,
    merchantId: number
): Promise<any> {
    return request({
        url: `/pay-mg/merchant/getApplyDetail`,
        method: 'get',
        params: {
            bankId,
            merchantId
        }
    });
}