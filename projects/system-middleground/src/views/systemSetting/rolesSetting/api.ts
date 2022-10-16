import request from '@/utils/request';
import { QueryObj, RoleItem } from './data'

// 商户列表
export function merchantList(
    pageNum: number,
    pageSize: number,
    params: QueryObj
): Promise<any> {
    return request({
        url: '/pay-mg/merchant/getMerchantAdminInfoList',
        method: 'get',
        params: {
            pageNum,
            pageSize,
            ...params
        }
    });
}

// 人员角色
export function roleList(
    name: string,
): Promise<any> {
    return request({
        url: '/pay-mg/sysRole/getSysRoleList',
        method: 'get',
        params: {
            name
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
// 添加角色
export async function addUser(params: RoleItem): Promise<any> {
    return request({
        url: '/pay-mg/sysRole/addSysRole',
        method: 'POST',
        data: params,
    });
}
// 获取角色权限
export function getUserRole(
    id: number | string
): Promise<any> {
    return request({
        url: `/pay-mg/sysRoleResource/getSysResourceTree/${id}`,
        method: 'get',
    });
}
// 修改角色权限
export function fixUserRole(
    params: any
): Promise<any> {
    return request({
        url: `/pay-mg/sysRoleResource/updateSysRoleResource`,
        method: 'POST',
        data: params,
    });
}

// 批量删除角色
export function deleteSysRoleByBatchId(
    data: number[]
): Promise<any> {
    return request({
        url: `/pay-mg/sysRole/deleteSysRoleByBatchId`,
        method: 'POST',
        data,
    });
}