import request from "@/utils/request";
import { QueryObj } from "./data";

// 商户列表
export function studentList(
  pageNum: number,
  pageSize: number,
  params: QueryObj
): Promise<any> {
  return request({
    url: "/pay-merchant/merchantStudent/pageList",
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


// 学校列表
export function merGradeList(gradeName?: string): Promise<any> {
  return request({
    url: `/pay-merchant/merchantGrade/list`,
    method: "get",
    params: {
      gradeName
    }
  });
}

// 班级列表
export function merClassList(params: any): Promise<any> {
  return request({
    url: `/pay-merchant/merchantClass/list`,
    method: "get",
    params
  });
}

// 新增学生
export function addMerStudent(data: any): Promise<any> {
  return request({
    url: `/pay-merchant/merchantStudent/add`,
    method: "post",
    data
  });
}

// 修改学生
export function setMerStudent(data: any): Promise<any> {
  return request({
    url: `/pay-merchant/merchantStudent/set`,
    method: "post",
    data
  });
}

// 批量删除学生
export function delBatch(data: number[]): Promise<any> {
  return request({
    url: `/pay-merchant/merchantStudent/delBatch`,
    method: "post",
    data
  });
}

// 删除学生
export function delStu(studentId: number): Promise<any> {
  return request({
    url: `/pay-merchant/merchantStudent/del/${studentId}`,
    method: "post",
  });
}

// 查询学生详情
export function selStu(studentId: number): Promise<any> {
  return request({
    url: `/pay-merchant/merchantStudent/${studentId}`,
    method: "get",
  });
}

// 导入学员
export function importStu(file: File): Promise<any> {
  const data = new FormData();
  data.append('file', file)
  return request({
    url: `/pay-merchant/template/importStudent`,
    method: 'post',
    data
  });
}

