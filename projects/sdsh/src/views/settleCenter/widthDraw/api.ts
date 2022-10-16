import request from '@/utils/request';
import { QueryObj } from './data'

// 商户列表
export function merchantList(
    pageNum: number,
    pageSize: number,
    params: QueryObj
): Promise<any> {
    return request({
        url: '/pay-mg/merchant/getMerchantAdminInfoList',
        method: 'get',
        params: {
            pageNum,
            pageSize,
            ...params
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