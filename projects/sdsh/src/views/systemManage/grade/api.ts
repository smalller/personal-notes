import request from "@/utils/request";

// 年级列表
export function gradeList(
  params: any
): Promise<any> {
  return request({
    url: "/pay-merchant/merchantGrade/list",
    method: "get",
    params: {
      ...params,
    },
  });
}

// 删除年级
export function delGrade(
  gradeId: number
): Promise<any> {
  return request({
    url: `/pay-merchant/merchantGrade/del/${gradeId}`,
    method: "post",
  });
}

// 添加年级
export function addGrade(
  gradeName: string
): Promise<any> {
  return request({
    url: `/pay-merchant/merchantGrade/add`,
    method: "post",
    data: {
      gradeName
    }
  });
}

// 修改年级
export function updateGrade(
  gradeName: string,
  id: number
): Promise<any> {
  return request({
    url: `/pay-merchant/merchantGrade/set`,
    method: "post",
    data: {
      gradeName,
      id
    }
  });
}

// 导入年级
export function importGrade(file: File): Promise<any> {
  const data = new FormData();
  data.append('file', file)
  return request({
    url: `/pay-merchant/template/importGrade`,
    method: 'post',
    data
  });
}
