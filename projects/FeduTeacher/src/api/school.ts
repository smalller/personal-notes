import { AxiosPromise } from "axios";
import request from "@/utils/request";

/**
 * 查询学校详情
 * @param schoolId
 */
export function querySchoolInfo(schoolId: string): AxiosPromise {
  return request({
    url: `/schools/api/school/querybySchoolId/${schoolId}`,
    method: "get",
  });
}
