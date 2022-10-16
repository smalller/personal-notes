import request from "@/utils/request";
import { QueryObj } from "./data";

// 商户列表
export function merchantList(
  pageNum: number,
  pageSize: number,
  params: QueryObj
): Promise<any> {
  return request({
    url: "/pay-merchant/staffMember/pageList",
    method: "get",
    params: {
      pageNum,
      pageSize,
      ...params,
    },
  });
}

// 商户详情-基本信息
export function merchantDetailBasicInfo(merchantId: number): Promise<any> {
  return request({
    url: `/pay-mg/settlement/getDetail/${merchantId}`,
    method: "get",
  });
}

// 删除员工
export function delMerStaff(data: number[]): Promise<any> {
  return request({
    url: `/pay-merchant/staffMember/del`,
    method: "post",
    data
  });
}

// 角色列表
export function roleList(): Promise<any> {
  return request({
    url: `/pay-merchant/smRole/list`,
    method: "get",
  });
}

// 新增角色
export function addStaff(data: any): Promise<any> {
  return request({
    url: `/pay-merchant/staffMember/add`,
    method: "post",
    data
  });
}

// 角色详情
export function staffDetail(memberId: number): Promise<any> {
  return request({
    url: `/pay-merchant/staffMember/${memberId}`,
    method: "get",
  });
}

// 修改角色
export function updateStaff(data: any): Promise<any> {
  return request({
    url: `/pay-merchant/staffMember/set`,
    method: "post",
    data
  });
}

// 导入员工
export function importStaffs(file: File): Promise<any> {
  const data = new FormData();
  data.append('file', file)
  return request({
    url: `/pay-merchant/template/importStaff`,
    method: 'post',
    data
  });
}

// 查询年级树
export function gradeTree(): Promise<any> {
  return request({
    url: `/pay-merchant/merchantGrade/tree`,
    method: "get",
  });
}