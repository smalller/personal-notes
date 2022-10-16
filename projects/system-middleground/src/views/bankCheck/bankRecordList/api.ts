import request from '@/utils/request';
import { QueryObj } from './data'

// 商户列表
export function checkList(
    pageNum: number,
    pageSize: number,
    params: any
): Promise<any> {
    return request({
        url: '/pay-mg/bank/selectBankAuditReviews',
        method: 'get',
        params: {
            pageNum,
            pageSize,
            ...params
        }
    });
}
// 审核详情
export function checkInfo(
    id: string,
): Promise<any> {
    return request({
        url: '/pay-mg/bank/selectBankAuditReview',
        method: 'get',
        params: {
            id
        }
    });
}

// 商户详情-基本信息
export function merchantDetailBasicInfo(
    merchantId: number
): Promise<any> {
    return request({
        url: `/pay-mg/settlement/getDetail/${merchantId}`,
        method: 'get',
    });
}