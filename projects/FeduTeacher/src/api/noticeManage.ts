import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { PageForm } from "@/api/interface";

/**
 * 获取通知模板
 * @returns
 */
export const getTempList = () => {
  return request({
    url: "/notice/template/query",
    method: "get",
  });
};

/**
 * 新增通知内容
 * @returns
 */
export const addNotice = (data: any) => {
  return request({
    url: "/notice/sender/send",
    method: "post",
    data,
  });
};

/**
 * 删除通知
 * @returns
 */
export const delNotice = (data: any) => {
  return request({
    url: "/notice/api/notice/batchDeleteNotice",
    method: "delete",
    data,
  });
};
