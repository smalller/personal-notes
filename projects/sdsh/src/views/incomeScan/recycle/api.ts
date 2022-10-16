import request from '@/utils/request';
import { QueryObj } from './data'

// 二维码回收站：列表
export function merchantList(
    pageNum: number,
    pageSize: number,
    params: QueryObj
): Promise<any> {
    return request({
        url: '/pay-merchant/merchantCodeCharge/merchantRevokeQrCodeList',
        method: 'get',
        params: {
            pageNum,
            pageSize,
            ...params
        }
    });
}

//回退被删除的二维码
export const merchantQrCode = (id: number): Promise<any> => request({
    url: '/pay-merchant/merchantCodeCharge/merchantQrCodeRevoke',
    method: 'post',
    data: {
        id: id
    }
})
