import request from "@/utils/request";
import { QueryObj } from "./data";

// 商户列表
export function merchantList(
  pageNum: number,
  pageSize: number,
  params: QueryObj
): Promise<any> {
  return request({
    url: "/pay-merchant/merchantClass/list",
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

// 新增班级
export function addMerClass(data: any): Promise<any> {
  return request({
    url: `/pay-merchant/merchantClass/add`,
    method: "post",
    data
  });
}

// 查询班级详情
export function merClassDetail(classId: number): Promise<any> {
  return request({
    url: `/pay-merchant/merchantClass/${classId}`,
    method: "get",
  });
}

// 修改班级
export function setMerClass(data: any): Promise<any> {
  return request({
    url: `/pay-merchant/merchantClass/set`,
    method: "post",
    data
  });
}

// 删除班级
export function delmerClass(classId: number): Promise<any> {
  return request({
    url: `/pay-merchant/merchantClass/del/${classId}`,
    method: "post",
  });
}

// 导入班级
export function importClass(file: File): Promise<any> {
  const data = new FormData();
  data.append('file', file)
  return request({
    url: `/pay-merchant/template/importClass`,
    method: 'post',
    data
  });
}