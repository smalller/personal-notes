/*
 * @Author: 吴同学
 * @Date: 2022-02-11 14:22:14
 * @Last Modified by: 吴同学
 * @Last Modified time: 2022-02-14 10:20:17
 */

import request from "@/utils/request";

/**
 * 获取教室列表
 * @param pageNo
 * @param pageSize
 * @param params
 * @returns
 */
export const queryClazzRoom = (
  pageNo?: number | string,
  pageSize?: number | string,
  params?: any
) => {
  return request({
    url: `schools/api/clazzRoom/queryClazzRoom`,
    method: "get",
    params: {
      pageNo,
      pageSize,
      ...params,
    },
  });
};

/**
 * 新增/修改教室
 * @param data
 * @returns
 */
export const editRoom = (data: any) => {
  return request({
    url: `schools/api/clazzRoom/add`,
    method: "post",
    data,
  });
};

/**
 * 删除教室
 * @param id
 * @returns
 */
export const deleteClazzRoom = (ids: string[]) => {
  return request({
    url: `schools/api/clazzRoom/deleteClazzRoom`,
    method: "delete",
    data: ids,
  });
};

/**
 * 停用/启用
 * @param id
 * @returns
 */
export const forbidden = (id: string) => {
  return request({
    url: `schools/api/clazzRoom/forbidden/${id}`,
    method: "put",
  });
};
