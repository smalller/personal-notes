import request from '@/utils/request';
import { QueryObj } from './data'

// 已结算列表
export function closeCountList(
    pageNum: number,
    pageSize: number,
    params: QueryObj
): Promise<any> {
    return request({
        url: '/pay-merchant/FundTransferInquiry/select',
        method: 'get',
        params: {
            pageNum,
            pageSize,
            ...params
        }
    });
}