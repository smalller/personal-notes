import request from '@/utils/request';
import {QueryObj, StatusParams} from './data'

// 查询待审核列表
export function getList(
    pageNum: number,
    pageSize: number,
    params: QueryObj
): Promise<any> {
    return request({
        url: '/pay-merchant/audit/selectAudits',
        method: 'get',
        params: {
            pageNum,
            pageSize,
            ...params
        }
    });
}

// 查询二维码收费详情
export function getQrCodeDetails(
    id: number
): Promise<any> {
    return request({
        url: `/pay-merchant/merchantCodeCharge/qrCodeDetailsById/${id}`,
        method: 'get',
    });
}

//审核作品
export const updateStatus = (params: StatusParams):Promise<any> => request({
    url: '/pay-merchant/audit/updateStatus',
    method: 'post',
    data: params
})
