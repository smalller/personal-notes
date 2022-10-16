import request from '@/utils/request';
import { QueryObj,UserItem } from './data'
//添加用户
export async function addUser(params: UserItem): Promise<any> {
  return request({
    url: '/pay-mg/sysUser/addSysUser',
    method: 'POST',
    data: params,
  });
}
//修改用户
export async function fixUser(params: any): Promise<any> {
    return request({
      url: '/pay-mg/sysUser/updateSysUserById',
      method: 'POST',
      data: params,
    });
  }
//修改用户状态
export async function freUser(params: any): Promise<any> {
    return request({
      url: '/pay-mg/sysUser/updateSysUserStatus',
      method: 'POST',
      data: params,
    });
  }
// 人员列表
export function peopleList(
    pageNum: number,
    pageSize: number,
    params: QueryObj
): Promise<any> {
    return request({
        url: '/pay-mg/sysUser/getSysUserPageList',
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
    pageNum: number,
    pageSize: number,
): Promise<any> {
    return request({
        url: '/pay-mg/sysRole/getSysRoleList',
        method: 'get',
        params: {
            pageNum,
            pageSize,
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