import request from "@/utils/request";
import { AxiosPromise } from "axios";

interface query {
  clazzIds: string;
  attDay: string;
}

/**
 * 查询班级考勤记录
 * @param params
 */
export function getSumClazzAttByDay(params: query): AxiosPromise {
  return request({
    url: "/schools/api/attCensus/sumClazzAttByDay",
    method: "GET",
    params: params,
  });
}
