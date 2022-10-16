import request from "@/utils/request";
const API = process.env.VUE_APP_BASE_LIVE_API;

/**
 * 查询直播列表
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
    url: `${API}/getAllLive`,
    method: "get",
    params: {
      pageNo,
      pageSize,
      ...params,
    },
  });
};

/**
 * 发布直播
 * @param data
 * @returns
 */
export const createCmsLive = (data: any) => {
  return request({
    url: `${API}/createCmsLive`,
    method: "post",
    data,
  });
};

/**
 * 开始直播
 * @param liveId
 * @returns
 */
export const startCmsLive = (liveId: string) => {
  return request({
    url: `${API}/startCmsLive`,
    method: "post",
    data: {
      liveId,
    },
  });
};

/**
 * 结束直播
 * @param liveId
 * @returns
 */
export const stopCmsLive = (liveId: string) => {
  return request({
    url: `${API}/stopCmsLive`,
    method: "post",
    data: {
      liveId,
    },
  });
};

/**
 * 修改直播
 * @param data
 * @returns
 */
export const updateCmsLive = (data: any) => {
  return request({
    url: `${API}/modifyCmsLive`,
    method: "post",
    data,
  });
};

/**
 * 删除直播
 * @param liveId
 * @returns
 */
export const deleteCmsLive = (liveIds: string[]) => {
  return request({
    url: `${API}/deleteCmsLive`,
    method: "post",
    data: {
      liveIds,
    },
  });
};

/**
 * 查看直播详情
 * @param liveId
 * @returns
 */
export const describeLive = (liveId: string) => {
  return request({
    url: `${API}/describeLive`,
    method: "get",
    params: {
      liveId,
    },
  });
};

/**
 * 获取当前学校教师列表
 * @returns
 */
export const getSchoolTeacher = () => {
  return request({
    url: "/schools/api/employee/query",
    method: "get",
    params: {
      pageSize: 999,
    },
  });
};

/**
 * 获取直播聊天列表
 * @param pageNo
 * @param pageSize
 * @param params
 * @returns
 */
export const getChatList = (
  pageNo: number | string,
  pageSize: number | string,
  params: any
) => {
  return request({
    url: `${API}/getChatList`,
    method: "get",
    params: {
      pageNo,
      pageSize,
      ...params,
    },
  });
};

/**
 * 直播发送评论
 * @param data
 * @returns
 */
export const sendChat = (data: any) => {
  return request({
    url: `${API}/msg/chat`,
    method: "post",
    data,
  });
};

/**
 * 删除直播评论
 * @param data
 * @returns
 */
export const delChat = (data: any) => {
  return request({
    url: `${API}/delChat`,
    method: "post",
    data,
  });
};

/**
 * 获取直播分享列表
 * @param pageNo
 * @param pageSize
 * @param params
 * @returns
 */
export const getShareRecord = (
  pageNo: number | string,
  pageSize: number | string,
  params: any
) => {
  return request({
    url: `/mamserver/api/liveVideo/getShareRecord`,
    method: "get",
    params: {
      pageNo,
      pageSize,
      ...params,
    },
  });
};

/**
 * 获取直播观看列表
 * @param pageNo
 * @param pageSize
 * @param params
 * @returns
 */
export const getViewRecord = (
  pageNo: number | string,
  pageSize: number | string,
  params: any
) => {
  return request({
    url: `/mamserver/api/liveVideo/getViewRecord`,
    method: "get",
    params: {
      pageNo,
      pageSize,
      ...params,
    },
  });
};
