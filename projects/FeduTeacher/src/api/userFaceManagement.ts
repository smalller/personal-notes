import request from "@/utils/request";
import { PageForm } from "@/api/interface";
import { AxiosPromise } from "axios";

export interface QueryFacesParams {
  clazzId?: string;
  gradeLabel?: string;
  name?: string;
  title?: string;
}

/**
 * 查询家长人脸入库
 * @param params
 */
export const queryUserFaces = (
  params: QueryFacesParams & PageForm
): AxiosPromise =>
  request({
    url: "/facility/api/hiot/anonyuser/queryUserFacePage",
    method: "GET",
    params: params,
  });

/**
 * 查询教师人脸入库
 * @param params
 */
export const queryEmpFaces = (
  params: QueryFacesParams & PageForm
): AxiosPromise =>
  request({
    url: "/facility/api/hiot/anonyuser/queryEmpFacePage",
    method: "GET",
    params: params,
  });
