import request from '@/utils/request';
import { QueryObj } from './data'

// 收支统计列表
export function statisticsList(
    pageNum: number,
    pageSize: number,
    params: QueryObj
): Promise<any> {
    return request({
        url: '/pay-merchant/settle/statistics',
        method: 'get',
        params: {
            pageNum,
            pageSize,
            ...params
        }
    });
}


// 收支统计查询明细列表
export function statisticsDetailList(
    pageNum: number,
    pageSize: number,
    payType: string,
    params: any
): Promise<any> {
    return request({
        url: '/pay-merchant/settle/statisticsDetail',
        method: 'get',
        params: {
            pageNum,
            pageSize,
            payType,
            ...params
        }
    });
}


// 交费详情
export function payDetail(
    moId: number,
    moddId: number,
): Promise<any> {
    return request({
        url: '/pay-merchant/merchantPayDetail/getPayDetail',
        method: 'get',
        params: {
            moId,
            moddId
        }
    });
}

// 明细中的统计数据
export function statisticsDetailTotal(
    pageNum: number,
    pageSize: number,
    payType: string,
    params: any
): Promise<any> {
    return request({
        url: '/pay-merchant/settle/statisticsDetailTotal',
        method: 'get',
        params: {
            pageNum,
            pageSize,
            payType,
            ...params
        }
    });
}