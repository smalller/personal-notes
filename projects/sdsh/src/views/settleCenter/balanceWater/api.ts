import request from '@/utils/request';
import { QueryObj } from './data'

// 收支流水列表
export function waterList(
    pageNum: number,
    pageSize: number,
    params: QueryObj
): Promise<any> {
    return request({
        url: '/pay-merchant/settle/list',
        method: 'get',
        params: {
            pageNum,
            pageSize,
            ...params
        }
    });
}