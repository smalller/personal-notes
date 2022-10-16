import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { PageForm } from "@/api/interface";

/**
 * 获取招生简章列表
 * @returns
 */
export const getEnrollmentList = (data: string | number) => {
  return request({
    url: `schools/api/admissions/query?schoolId=${data}`,
    method: "get",
  });
};

/**
 * 获取招生数据
 * @param relDataId
 * @returns
 */
export const getStudentList = (
  id: string | number,
  pageNo: number | string,
  pageSize: number | string,
  params: any
) => {
  return request({
    url: `/schools/api/studentSign/query?admissionsId=${id}`,
    method: "get",
    params: {
      pageNo,
      pageSize,
      ...params,
    },
  });
};

/**
 * 获取招生line
 * @param relDataId
 * @returns
 */
export const getStudentLine = (id: string | number) => {
  return request({
    url: `/schools/api/studentSign/signNum?admissionsId=${id}`,
    method: "get",
  });
};

/**
 * 获取招生列表
 * @param relDataId
 * @returns
 */
export const getSchoolList = (
  pageNo: number | string,
  pageSize: number | string,
  params: any
) => {
  return request({
    url: "/schools/api/admissions/query",
    method: "get",
    params: {
      pageNo,
      pageSize,
      ...params,
    },
  });
};
/**
 * 删除招生数据
 * @returns
 */
export const delStudent = (data: any) => {
  return request({
    url: "/schools/api/studentSign/batchDelete",
    method: "delete",
    data,
  });
};
/**
 * 获取模板数据
 * @param relDataId
 * @returns
 */
export const getTempList = () => {
  return request({
    url: "/schools/api/schoolTemp/query",
    method: "get",
  });
};

/**
 * 新增招生简章
 * @param relDataId
 * @returns
 */
export const addSchoolEnrollment = (data: any) => {
  return request({
    url: "/schools/api/admissions/saveOrUpdate",
    method: "put",
    data,
  });
};

/**
 * 删除招生宣传
 * @returns
 */
export const delProject = (data: any) => {
  return request({
    url: "/schools/api/admissions/batchDelete",
    method: "delete",
    data,
  });
};
