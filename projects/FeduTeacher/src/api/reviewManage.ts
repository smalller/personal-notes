import axios, { AxiosError, AxiosResponse } from "axios";
const mockServer = axios.create({
  timeout: 10000,
});
mockServer.interceptors.response.use(
  (response: AxiosResponse) => {
    return Promise.resolve(response.data);
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

const GETNOTICEINFO = "/notice/api/notice";
const READLIST = "/notice/api/receiver/queryRead";
const UNREAD = "/notice/api/receiver/queryUnRead";
import request from "@/utils/request";

/**
 * 获取评论列表
 * @param pageNo
 * @param pageSize
 * @param params
 * @returns
 */
export const getList = (
  pageNo: number | string,
  pageSize: number | string,
  params: any
) => {
  return request({
    url: "/community/api/comment/getSchoolCommentList",
    method: "get",
    params: {
      pageNo,
      pageSize,
      ...params,
    },
  });
};

/**
 * 删除评论
 * @param id
 * @returns
 */
export const delComment = (id: string) => {
  return request({
    url: "/community/api/comment/delComment",
    method: "get",
    params: {
      id,
    },
  });
};

/**
 * 获取动态详情里的评论列表
 */
export const getDynamic = (
  pageNo: number | string,
  pageSize: number | string,
  params: any
) => {
  return request({
    url: "/community/api/comment/queryComments",
    method: "get",
    params: {
      pageNo,
      pageSize,
      ...params,
    },
  });
};

/**
 * 获取点赞列表
 */
export const queryPraises = (
  pageNo: number | string,
  pageSize: number | string,
  params: any
) => {
  return request({
    url: "/community/api/praise/queryPraises",
    method: "get",
    params: {
      pageNo,
      pageSize,
      ...params,
    },
  });
};

/**
 * 获取食谱信息
 */
export const queryRecipes = (weekId: string) => {
  return request({
    url: "/schools/api/apprecipes/queryRecipes",
    method: "get",
    params: {
      weekId,
    },
  });
};

/**
 * 获取校园动态详情
 * @param relDataId
 * @returns
 */
export const queryAlbumsById = (relDataId: string) => {
  return request({
    url: "/mamserver/api/SchDynamic/queryAlbumsById",
    method: "get",
    params: {
      relDataId,
    },
  });
};

/**
 * 评论动态
 * @param relDataId
 * @returns
 */
export const addComment = (data: any) => {
  return request({
    url: "/community/api/comment/add",
    method: "post",
    data: {
      fromOperator: false,
      ...data,
    },
  });
};

/**
 * 获取校园通知列表详情
 * @param relDataId
 * @returns
 */
export const getNoticeList = (
  pageNo: number | string,
  pageSize: number | string,
  params: any
) => {
  return request({
    url: "/notice/api/notice/query",
    method: "get",
    params: {
      pageNo,
      pageSize,
      ...params,
    },
  });
};

/**
 * 获取通知详情
 * @returns
 */
export const getNoticeInfo = (id: string | number) => {
  return request({
    url: `${GETNOTICEINFO}/${id}`,
    method: "get",
  });
};

/**
 * 获取通知详情-已读列表
 * @returns
 */
export const getReadList = (id: string | number) => {
  return request({
    url: `${READLIST}/${id}`,
    method: "get",
  });
};

/**
 * 获取通知详情-未读列表
 * @returns
 */
export const getUnReadList = (id: string | number) => {
  return request({
    url: `${UNREAD}/${id}`,
    method: "get",
  });
};
