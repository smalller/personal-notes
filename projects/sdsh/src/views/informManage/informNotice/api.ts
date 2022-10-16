import request from '@/utils/request';
import { QueryObj } from './data'

// 公告列表
export function informList(
    pageNum: number,
    pageSize: number,
    params: QueryObj
): Promise<any> {
    return request({
        url: '/pay-merchant/notice/selects',
        method: 'get',
        params: {
            pageNum,
            pageSize,
            ...params
        }
    });
}

// 查询年级列表
export function merchantGradeList(
    gradeName?: string
): Promise<any> {
    return request({
        url: `/pay-merchant/merchantGrade/list`,
        method: 'get',
        params: {
            gradeName
        }
    });
}

// 查询班级列表
export function merchantClassList(
    params?: QueryObj
): Promise<any> {
    return request({
        url: '/pay-merchant/merchantClass/list',
        method: 'get',
        params: {
            pageNum: 1,
            pageSize: 999,
            ...params
        }
    });
}


// 新增公告
export function insertNotice(
    data: any
): Promise<any> {
    return request({
        url: `/pay-merchant/notice/insert`,
        method: 'post',
        data
    });
}

// 公告详情
export function selectNotice(
    id: number
): Promise<any> {
    return request({
        url: `/pay-merchant/notice/selectId`,
        method: 'get',
        params: {
            id
        }
    });
}