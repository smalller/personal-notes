import request from "@/utils/request";
import { AxiosPromise } from "axios";

/**
 * 查询学校logo
 * @returns AxiosPromise
 */
export const QueryLogo = (): AxiosPromise =>
  request({
    url: "/schools/api/school/queryLogo",
    method: "GET",
  });

interface LogoParams {
  logo: string;
}
/**
 * 修改学校logo
 * @param logo string
 * @returns AxiosPromise
 */
export const UpdateLogo = (params: LogoParams): AxiosPromise =>
  request({
    url: "/schools/api/school/updateLogo",
    method: "PUT",
    params: params,
  });
