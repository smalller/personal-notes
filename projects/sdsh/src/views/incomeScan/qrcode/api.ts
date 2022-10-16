import request from '@/utils/request';
import { QueryObj } from './data'

// 合并二维码列表
export function merchantList(
    pageNum: number,
    pageSize: number,
    params: QueryObj
): Promise<any> {
    return request({
        url: '/pay-merchant/merchantCodeCharge/selectMergeCodeList',
        method: 'get',
        params: {
            pageNum,
            pageSize,
            ...params
        }
    });
}

// 商户详情-基本信息
export function delQrCode(
    id: number
): Promise<any> {
    return request({
        url: `/pay-merchant/merchantCodeCharge/deleteQrCodeById`,
        method: 'post',
        data: {
            id: id
        }
    });
}
