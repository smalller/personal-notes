import request from '@/utils/request';
import { QueryObj } from './data'

// 审核列表
export function checkList(
    pageNum: number,
    pageSize: number,
    params: QueryObj
): Promise<any> {
    return request({
        url: '/pay-mg/bank/selectAudits',
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
        url: '/pay-mg/bank/selectBankAudit',
        method: 'get',
        params: {
            id,
        }
    });
}

// 审核操作
export function updateBankAudit(
    data: any,
): Promise<any> {
    return request({
        url: '/pay-mg/bank/updateBankAudit',
        method: 'post',
        data
    });
}

