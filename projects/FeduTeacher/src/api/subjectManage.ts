import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { PageForm } from "@/api/interface";

/**
 * 获取课程类别数据
 * @returns
 */
export const getSubjectList = () => {
  return request({
    url: "/mamserver/api/course/courseSubTree",
    method: "get",
  });
};

/**
 * 获取课程数据
 * @param
 * @returns
 */
export const getSubjectInfo = (
  pageNo: number | string,
  pageSize: number | string,
  params?: any
) => {
  return request({
    url: `/mamserver/api/course/queryCourse`,
    method: "get",
    params: {
      pageNo,
      pageSize,
      ...params,
    },
  });
};

/**
 * 获取课程章节数据
 * @param
 * @returns
 */
export const getSubjectChapter = (id: string) => {
  return request({
    url: `/mamserver/api/course/queryCourseSection/${id}`,
    method: "get",
  });
};

/**
 * 新增课程数据
 * @param
 * @returns
 */
export const addSubject = (data: any) => {
  return request({
    url: "/mamserver/api/course/add",
    method: "post",
    data: data,
  });
};

/**
 * 新增课节数据
 * @param
 * @returns
 */
export const addCourseSection = (data: any) => {
  return request({
    url: "/mamserver/api/course/addCourseSection",
    method: "post",
    data: data,
  });
};

/**
 * 删除课节信息
 * @returns
 */
export const delSection = (id: string) => {
  return request({
    url: `/mamserver/api/course/deleteCourseSection/${id}`,
    method: "delete",
  });
};

/**
 * 删除课程信息
 * @returns
 */
export const delSubject = (id: string) => {
  return request({
    url: `/mamserver/api/course/deleteCourse/${id}`,
    method: "delete",
  });
};

/**
 * 查询课程信息
 * @returns
 */
export const getSubject = (id: string) => {
  return request({
    url: `/mamserver/api/course/queryOne/${id}`,
    method: "get",
  });
};
