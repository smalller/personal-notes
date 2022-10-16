import request from "@/utils/request";
import { QueryObj } from "./data";

// 角色列表
export function userList(
  pageNum: number,
  pageSize: number,
  params: QueryObj
): Promise<any> {
  return request({
    url: "/pay-merchant/smRole/pageList",
    method: "get",
    params: {
      pageNum,
      pageSize,
      ...params,
    },
  });
}

// 角色权限
export function getRole(id: string): Promise<any> {
  return request({
    url: `/pay-merchant/smUserResource/tree/${id}`,
    method: "get",
  });
}

// 修改角色权限
export async function setRole(params: any): Promise<any> {
  return request({
    url: "/pay-merchant/smUserResource/set",
    method: "POST",
    data: params,
  });
}

// 修改角色权限
export async function updateName(params: any): Promise<any> {
  return request({
    url: "/pay-merchant/smRole/add",
    method: "POST",
    data: params,
  });
}

// 删除角色
export async function delRoles(data: number[]): Promise<any> {
  return request({
    url: "/pay-merchant/smRole/del",
    method: "POST",
    data,
  });
}

