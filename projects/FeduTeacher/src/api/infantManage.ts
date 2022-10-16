import request from "@/utils/request";

/**
 * 获取现有幼儿统计数据
 * @returns
 */
export const getSchoolProportion = () => {
  return request({
    url: `/schools/api/student/getStudentProportion`,
    method: "get",
  });
};

/**
 * 获取幼儿数据趋势数据
 * @param startDay
 * @param endDay
 * @returns
 */
export const getMonthReport = (startDay: string, endDay: string) => {
  return request({
    url: `/schools/api/student/getStudentMonthReport`,
    method: "get",
    params: {
      startDay,
      endDay,
    },
  });
};

/**
 * 获取年度幼儿数据趋势数据
 * @returns
 */
export const getYearReport = () => {
  return request({
    url: `/schools/api/student/getStudentMonthReport`,
    method: "get",
    params: {
      reportType: "year",
    },
  });
};

/**
 * 获取现有幼儿列表数据
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
    url: "/schools/api/student/getStudentList",
    method: "get",
    params: {
      pageNo,
      pageSize,
      ...params,
    },
  });
};

/**
 * 新增幼儿
 * @param data
 * @returns
 */
export const addInfant = (data: any) => {
  return request({
    url: `/schools/api/student/add`,
    method: "post",
    data,
  });
};

/**
 * 修改幼儿
 * @param data
 * @returns
 */
export const updateInfant = (data: any) => {
  return request({
    url: `/schools/api/student/${data.id}`,
    method: "put",
    data,
  });
};

/**
 * 幼儿退园
 * @param studentIds
 * @returns
 */
export const infantDropOut = (studentIds: string) => {
  return request({
    url: `/schools/api/student/retreat`,
    method: "get",
    params: {
      studentIds,
    },
  });
};

/**
 * 家长管理列表信息
 * @param studentId
 * @returns
 */
export const parentListInfo = (studentId: string) => {
  return request({
    url: `/schools/api/student/queryFamilyRel`,
    method: "get",
    params: {
      studentId,
    },
  });
};

/**
 * 幼儿毕业
 * @param studentIds
 * @returns
 */
export const infantGraduate = (studentIds: string) => {
  return request({
    url: `/schools/api/student/graduateById`,
    method: "get",
    params: {
      studentIds,
    },
  });
};

/**
 * 幼儿转班
 * @param clazzId
 * @param studentIds
 * @returns
 */
export const infantChangeClass = (clazzId: string, studentIds: string) => {
  return request({
    url: `/schools/api/student/changeClasses`,
    method: "get",
    params: {
      clazzId,
      studentIds,
    },
  });
};

/**
 * 导入幼儿表格
 * @param data
 * @returns
 */
export const uploadStudents = (classId: string, data: FormData) => {
  return request({
    url: `/schools/api/student/import?classId=${classId}`,
    method: "post",
    data,
  });
};

/**
 * 获取学籍信息
 * @param stuId
 * @returns
 */
export const getSchoolRollDetail = (stuId: string) => {
  return request({
    url: `/schools/api/schoolRoll/queryByStuId/${stuId}`,
    method: "get",
  });
};

/**
 * 删除幼儿
 * @param data
 * @returns
 */
export const deleteStudents = (data: string[]) => {
  return request({
    url: `/schools/api/student/deleteStu`,
    method: "delete",
    data,
  });
};

/**
 * 恢复入园
 * @param id
 * @returns
 */
export const recoveryStu = (id: string) => {
  return request({
    url: `/schools/api/student/recoveryStu?id=${id}`,
    method: "put",
  });
};
