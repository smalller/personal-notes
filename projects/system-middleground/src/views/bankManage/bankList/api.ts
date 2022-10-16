import request from '@/utils/request';
import { QueryObj } from './data'

// 银行列表
export function bankList(
    pageNum: number,
    pageSize: number,
    params: any
): Promise<any> {
    return request({
        url: '/pay-mg/bank/manageList',
        method: 'get',
        params: {
            pageNum,
            pageSize,
            ...params
        }
    });
}

// 添加银行
export function addManage(
    data: any
): Promise<any> {
    return request({
        url: `/pay-mg/bank/addManage`,
        method: 'post',
        data
    });
}

// 修改银行
export function setManage(
    data: any
): Promise<any> {
    return request({
        url: `/pay-mg/bank/setManage`,
        method: 'post',
        data
    });
}


// 银行列表
export function listInfo(): Promise<any> {
    return request({
        url: '/pay-mg/sysDict/dictList',
        method: 'get',
        params: {
            dictType: 'sys_bank_list'
        }
    });
}

// 银行详情
export function bankDetail(id: number): Promise<any> {
    return request({
        url: `/pay-mg/bank/manage/${id}`,
        method: 'get',
    });
}

// 修改银行状态
export function setManageStatus(
    data: any
): Promise<any> {
    return request({
        url: `/pay-mg/bank/setManageStatus`,
        method: 'post',
        data
    });
}

