import request from "@/utils/request";

/**
 * 获取现有教职工统计数据
 * @returns
 */
export const getSchoolProportion = () => {
  return request({
    url: `/schools/api/employee/getSchoolProportion`,
    method: "get",
  });
};

/**
 * 获取月度和筛选年份教职工数据趋势数据
 * @param startDay
 * @param endDay
 * @returns
 */
export const getMonthReport = (startDay: string, endDay: string) => {
  return request({
    url: `/schools/api/employee/getSchoolMonthReport`,
    method: "get",
    params: {
      startDay,
      endDay,
    },
  });
};

/**
 * 获取年度教职工数据趋势数据
 * @returns
 */
export const getYearReport = () => {
  return request({
    url: `/schools/api/employee/getSchoolMonthReport`,
    method: "get",
    params: {
      reportType: "year",
    },
  });
};

/**
 * 获取现有教职工表格数据
 * @param current
 * @param size
 * @param params
 * @returns
 */
export const getTableList = (
  pageNo: number | string,
  pageSize: number | string,
  params: any
) => {
  return request({
    url: "/schools/api/employee/queryEmp",
    method: "get",
    params: {
      pageNo,
      pageSize,
      ...params,
    },
  });
};

/**
 * 新增员工
 * @param data
 * @returns
 */
export const addStaff = (data: any) => {
  return request({
    url: `/schools/api/employee/add`,
    method: "post",
    data,
  });
};

/**
 * 修改员工
 * @param data
 * @returns
 */
export const updateStaff = (data: any) => {
  return request({
    url: `/schools/api/employee/${data.id}`,
    method: "put",
    data,
  });
};

/**
 * 员工离职
 * @param ids
 * @returns
 */
export const staffDimission = (ids: string) => {
  return request({
    url: `/schools/api/schoolEmpRel/quits`,
    method: "put",
    params: {
      enable: 9,
      ids,
    },
  });
};

/**
 * 删除员工
 * @param ids
 * @returns
 */
export const deleteStaff = (ids: string) => {
  return request({
    url: `/schools/api/schoolEmpRel/batchDel`,
    method: "put",
    params: {
      enable: 1,
      ids,
    },
  });
};

/**
 * 导入教职工表格
 * @param data
 * @returns
 */
export const uploadTeachers = (data: FormData) => {
  return request({
    url: `/schools/api/schoolEmpRel/importEmps`,
    method: "post",
    data,
  });
};
