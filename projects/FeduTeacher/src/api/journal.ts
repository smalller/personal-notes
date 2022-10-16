import request from "@/utils/request";
import { AxiosPromise } from "axios";

interface QueryJournal {
  pageNo: number;
  pageSize: number;
}
/**
 * 查询操作日志
 */
export function getJournal(params: QueryJournal): AxiosPromise {
  return request({
    url: "/schools/api/employee/getOperationRecord",
    method: "GET",
    params,
  });
}
