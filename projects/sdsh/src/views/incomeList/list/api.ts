import request from '@/utils/request';
import {QueryParams} from './data'

// 名单项目列表
export function getNameList(
    pageNum: number,
    pageSize: number,
    params: QueryParams
): Promise<any> {
    return request({
        url: '/pay-merchant/MerchantName/selectSelective',
        method: 'get',
        params: {
            pageNum,
            pageSize,
            ...params
        }
    });
}

/**
 * 查询项目详情
 * @param id
 */
export const queryProjectInfo = (id: number):Promise<any> => request({
    url: '/pay-merchant/MerchantName/selectRecoverId',
    method: 'get',
    params: {
        id: id
    }
})

// 分账签约成功列表
export function funSplitOkList(
    pageNum: number,
    pageSize: number,
    params: any
): Promise<any> {
    return request({
        url: '/pay-merchant/funSplit/funSplitListOK',
        method: 'get',
        params: {
            pageNum,
            pageSize,
            ...params
        }
    });
}
