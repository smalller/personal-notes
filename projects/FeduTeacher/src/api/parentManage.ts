import request from "@/utils/request";

/**
 * 获取家长列表
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
    url: "/schools/api/stuFamily/queryFamilies",
    method: "get",
    params: {
      pageNo,
      pageSize,
      ...params,
    },
  });
};

/**
 * 开关监控
 * @param data
 * @returns
 */
export const onCamera = (data: any) => {
  return request({
    url: "/schools/api/stuFamily/onCamera?isOperator=false",
    method: "post",
    data,
  });
};

/**
 * 查看家长详情
 * @param id
 * @returns
 */
export const selectUserById = (id: string) => {
  return request({
    url: "/userserver/api/user/selectUserById",
    method: "get",
    params: {
      id,
    },
  });
};

/**
 * 获取现有教职工统计数据
 * @returns
 */
export const getStatisticsNow = () => {
  return request({
    url: `/schools/api/stuFamily/statisticsNow`,
    method: "get",
  });
};

/**
 * 获取月度和筛选年份家长年份数据趋势数据
 * @param startDay
 * @param endDay
 * @returns
 */
export const getMonthReport = (startDay: string, endDay: string) => {
  return request({
    url: `/schools/api/stuFamily/statistics`,
    method: "get",
    params: {
      startDay,
      endDay,
    },
  });
};

/**
 * 获取年度家长监控趋势数据
 * @returns
 */
export const getYearReport = () => {
  return request({
    url: `/schools/api/stuFamily/statistics`,
    method: "get",
    params: {
      reportType: "year",
    },
  });
};
