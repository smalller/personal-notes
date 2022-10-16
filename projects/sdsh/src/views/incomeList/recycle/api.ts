import request from '@/utils/request';
import { QueryObj } from './data'

// 商户列表
export function getNameList(
    pageNum: number,
    pageSize: number,
    params: QueryObj
): Promise<any> {
    return request({
        url: '/pay-merchant/MerchantName/selectRecover',
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
