import request from "@/utils/request";
import { AxiosPromise } from "axios";

/**
 *首页在园师生
 */
export function getHomePageNowBySchoolId(): AxiosPromise {
  return request({
    url: "/schools/api/employee/getHomePageNowBySchoolId",
    method: "GET",
  });
}

interface PersonnelTrends {
  reportType?: string;
  startDay?: string;
  endDay?: string;
}

/**
 * 查询首页人员趋势
 * @param params
 */
export function getHomePageReport(params: PersonnelTrends): AxiosPromise {
  return request({
    url: "/schools/api/employee/getHomePageReport",
    method: "get",
    params: params,
  });
}
