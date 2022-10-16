import request from "@/utils/request";
import { PageForm } from "@/api/interface";
import {
  CreateOrEditBusParams,
  QueryBusParams,
  QueryUserParams,
} from "@/views/bus/busManagement/interface";
import { AxiosPromise } from "axios";
import {
  QueryTripStudentListParams,
  QueryTripListParams,
  CreateOrEditTripParams,
} from "@/views/bus/tripManagement/interface";

/**
 * 获取校车列表
 * @param params
 */
export const getBusList = (params: PageForm & QueryBusParams): AxiosPromise =>
  request({
    url: "/schools/api/schoolBus/querySchoolBus",
    method: "GET",
    params: params,
  });

/**
 * 新增或修改校车
 * @param params
 */
export const createOrEditBus = (params: CreateOrEditBusParams): AxiosPromise =>
  request({
    url: "/schools/api/schoolBus/saveOrUpdateBus",
    method: "POST",
    data: params,
  });

/**
 * 删除校车
 * @param id
 */
export const delBus = (id: string): AxiosPromise =>
  request({
    url: `/schools/api/schoolBus/deleteSchoolBus/${id}`,
    method: "DELETE",
  });

/**
 * 选择教职工
 * @param pageNo
 * @param pageSize
 * @param params
 */
export const getEmpList = (
  params: PageForm & QueryUserParams
): AxiosPromise => {
  return request({
    url: "/schools/api/employee/queryEmp",
    method: "get",
    params: params,
  });
};

/**
 * 增加或编辑行程
 * @param params
 */
export const createOrEditTrip = (
  params: CreateOrEditTripParams
): AxiosPromise =>
  request({
    url: "/schools/api/schoolBus/saveOrUpdateTrip",
    method: "POST",
    data: params,
  });

/**
 * 查询行程列表
 * @param params
 */
export const queryTripList = (
  params: PageForm & QueryTripListParams
): AxiosPromise =>
  request({
    url: "/schools/api/schoolBus/queryTripList",
    method: "GET",
    params: params,
  });

/**
 * 批量删除行程
 * @param params
 */
export const deleteTripList = (params: string[]): AxiosPromise =>
  request({
    url: "/schools/api/schoolBus/deleteTrip",
    method: "delete",
    data: params,
  });

/**
 * 查询学生行程列表
 * @param params
 */
export const queryStudentTripList = (
  params: PageForm & QueryTripStudentListParams
): AxiosPromise =>
  request({
    url: "/schools/api/schoolBus/queryStuTripList",
    method: "GET",
    params: params,
  });

/**
 * 添加学生到行程
 * @param id
 * @param params
 */
export const addStudentToTrip = (id: string, params: any[]): AxiosPromise =>
  request({
    url: `/schools/api/schoolBus/saveStu/${id}`,
    method: "POST",
    data: params,
  });

/**
 * 删除行程中的学生
 * @param id
 * @param params
 */
export const deleteStudentToTrip = (
  id: string,
  params: string[]
): AxiosPromise =>
  request({
    url: `/schools/api/schoolBus/deleteStuTrip`,
    method: "DELETE",
    data: params,
  });

/**
 * 查询跟车记录
 * @param params
 */
export const queryBusRecord = (params: PageForm): AxiosPromise =>
  request({
    url: "/schools/api/schoolBus/queryBusRecord",
    method: "GET",
    params: params,
  });
