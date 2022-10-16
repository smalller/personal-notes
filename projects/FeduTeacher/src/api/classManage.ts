import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { ruleForm } from "@/views/staffManage/classManage/index";
//获取班级信息
const GETCLASSINFO = "/schools/api/clazz";
//查询班级教师数据
const GETTEACHERINFO = "/schools/api/employee/query";

type pageForm = {
  pageNo?: number;
  pageSize?: number;
  sceneIds?: string;
  ipcName?: string;
  sceneName?: string;
  clazzId?: string;
};

/**
 * 获取现有班级数据
 * @returns
 * @param current
 * @param size
 * @param params
 */
export const getClassList = (
  pageNo: number | string,
  pageSize: number | string,
  params: any
) => {
  return request({
    url: "/schools/api/clazz/query",
    method: "get",
    params: {
      pageNo,
      pageSize,
      ...params,
    },
  });
};

/**
 * 获取班级数据信息
 * @returns
 */
export const getClassInfo = (id: string | number) => {
  return request({
    url: `${GETCLASSINFO}/${id}`,
    method: "get",
  });
};

/**
 * 获取班级教师信息
 * @returns
 */
export const getTeacherInfo = (id: string | number) => {
  return request({
    url: "/schools/api/employee/query?clazzId=" + id,
    method: "get",
  });
};

/**
 * 获取学校教师信息
 * @returns
 */
export const getSchoolTeacher = () => {
  return request({
    url: "/schools/api/employee/query",
    method: "get",
  });
};

/**
 * 增加班级信息
 * @returns
 */
export const addClassInfo = (data: any) => {
  return request({
    url: "/schools/api/clazz/add",
    method: "post",
    data,
  });
};

/**
 * 绑定和解绑 教师到班级
 * @returnsid
 */
export const addClassTeacher = (data: any) => {
  return request({
    url:
      "/schools/api/employee/bind/" +
      data.value.employeeId +
      "/" +
      data.value.clazzId,
    method: "put",
    data: data.value,
  });
};

/**
 * 获取现有班级幼儿信息
 * @returns
 * @param current
 * @param size
 * @param params
 */
export const getStudentList = (
  pageNo: number | string,
  pageSize: number | string,
  params: any
) => {
  return request({
    url: "/schools/api/clazz/query",
    method: "get",
    params: {
      pageNo,
      pageSize,
      ...params,
    },
  });
};

/**
 * 获取班级统计信息
 * @returns
 */
export const getClassListPie = (data: string | number) => {
  return request({
    url: "/schools/api/school/queryClazzStatistics?now=true&year=" + data,
    method: "get",
  });
};

/**
 * 批量添加班级信息
 * @returns
 */
export const AddClassList = (data: Array<ruleForm>) => {
  return request({
    url: "/schools/api/clazz/addClazzBatch",
    method: "post",
    data: data,
  });
};

/**
 * 批量删除班级信息
 * @returns
 */
export const DelClassList = (data: Array<string>) => {
  return request({
    url: "/schools/api/clazz/deleteClazzBatch",
    method: "delete",
    data: data,
  });
};

/**
 * 班级毕业
 * @returns
 */
export const graduateClass = (id: string | number) => {
  return request({
    url: "/schools/api/clazz/graduateById?clazzId=" + id,
    method: "put",
  });
};

/**
 * 编辑班级信息
 * @returns
 */
export const editClassInfo = (id: string | number, data: any) => {
  return request({
    url: "/schools/api/clazz/" + id,
    method: "put",
    data,
  });
};

/**
 * 获取班级统计信息 LINE
 * @returns
 */
export const getClassListLine = (
  month?: number | string,
  year?: number | string
) => {
  console.log(month, year);
  return request({
    url:
      `/schools/api/school/queryClazzStatistics?now=false&month=` +
      month +
      "&year=" +
      year,
    method: "get",
  });
};

/**
 *查询班级视频列表
 */
export function queryDevicePage(params: pageForm): AxiosPromise {
  return request({
    url: "/schools/api/scene/queryDevicePage",
    method: "get",
    params: params,
  });
}

/**
 *查询学校的所有场景
 */
export function queryAllScene(params: pageForm): AxiosPromise {
  return request({
    url: "/schools/api/scene/queryAllScene",
    params: params,
  });
}
