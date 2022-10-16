import request from "@/utils/request";

/**
 * 获取招生计划列表
 * @param pageNo
 * @param pageSize
 * @param params
 * @returns
 */
export const queryPlan = (
  pageNo: number | string,
  pageSize: number | string,
  params?: any
) => {
  return request({
    url: `/mamserver/api/admissionPlan/queryPlan`,
    method: "get",
    params: {
      pageNo,
      pageSize,
      ...params,
    },
  });
};

/**
 * 查询单个计划
 */
export const queryOnePlan = (id: string) => {
  return request({
    url: `/mamserver/api/admissionPlan/queryOne/${id}`,
    method: "get",
  });
};

/**
 * 新增招生计划
 * @param data
 * @returns
 */
export const addPlan = (data: any) => {
  return request({
    url: `/mamserver/api/admissionPlan/addPlan`,
    method: "post",
    data,
  });
};

/**
 * 上下架招生计划
 * @param data
 * @returns
 */
export const upOrDownCourse = (data: any) => {
  return request({
    url: `/mamserver/api/admissionPlan/upOrDownCourse`,
    method: "post",
    params: data,
  });
};

/**
 * 查询当前招生计划中的课程列表
 * @param planId
 * @returns
 */
export const queryCourses = (
  pageNo: number | string,
  pageSize: number | string,
  planId: string
) => {
  return request({
    url: `/mamserver/api/admissionPlan/queryCourses/${planId}`,
    method: "get",
    params: {
      pageNo,
      pageSize,
    },
  });
};

/**
 * 移除课程
 * @param id
 * @returns
 */
export const deleteAdsCourse = (id: string) => {
  return request({
    url: `/mamserver/api/admissionPlan/deleteAdsCourse/${id}`,
    method: "delete",
  });
};

/**
 * 新增招生计划中的课程
 * @param data
 * @returns
 */
export const addCourse = (data: any) => {
  return request({
    url: `/mamserver/api/admissionPlan/addCourse`,
    method: "post",
    data,
  });
};

/**
 * 获取已经报名的学员列表
 * @param pageNo
 * @param pageSize
 * @param params
 * @returns
 */
export const querySignList = (params?: any) => {
  return request({
    url: `/schools/api/interestClass/getClassDetail`,
    method: "get",
    params: {
      ...params,
    },
  });
};

/**
 * 添加学生到课程（报名）
 * @param data
 * @returns
 */
export const courseSign = (data: any) => {
  return request({
    url: `/schools/api/courseSign/studentsSign`,
    method: "post",
    data,
  });
};

/**
 * 获取哪些人已经报了名
 * @param pid
 * @param planId
 * @returns
 */
export const selectStuSign = (pid: string, planId: string) => {
  return request({
    url: `/schools/api/courseSign/selectStuSign/${pid}/${planId}`,
    method: "get",
  });
};

/**
 * 移出学员（取消报名）
 * @param data
 * @returns
 */
export const cancelSign = (data: any) => {
  return request({
    url: `/schools/api/courseSign/cancelSign`,
    method: "post",
    data,
  });
};

/**
 * 创建班级
 * @param data
 * @returns
 */
export const addClass = (data: any) => {
  return request({
    url: `/schools/api/interestClass/addClass`,
    method: "post",
    data,
  });
};

// 获取学生列表
export const selectStuListApi = (
  pageNo: number | string,
  pageSize: number | string,
  params: any
) => {
  return request({
    url: "/schools/api/courseSign/querySignList",
    method: "get",
    params: {
      pageNo,
      pageSize,
      ...params,
    },
  });
};

// 获取学校列表
export const selectClassListApi = (
  pageNo: number | string,
  pageSize: number | string,
  params: any
) => {
  return request({
    url: "/schools/api/interestClass/getCourseClassList",
    method: "get",
    params: {
      pageNo,
      pageSize,
      ...params,
    },
  });
};

// 删除班级
export const deleteClass = (params: any) => {
  return request({
    url: `/schools/api/interestClass/deleteClass`,
    method: "delete",
    params,
  });
};

// 获取班级学员中的学员列表
export const getStudentsInClass = (
  pageNo: number | string,
  pageSize: number | string,
  params: any
) => {
  return request({
    url: "/schools/api/interestClass/getStudentsInClass",
    method: "get",
    params: {
      pageNo,
      pageSize,
      ...params,
    },
  });
};

// 获取批量分班中的班级列表
export const getSelectClassInCourse = (params: any) => {
  return request({
    url: `/schools/api/interestClass/getSelectClassInCourse`,
    method: "get",
    params,
  });
};

// 批量分班
export const addStudentsToClass = (data: any) => {
  return request({
    url: `/schools/api/interestClass/addStudentsToClass`,
    method: "post",
    data,
  });
};

// 批量移出
export const removeStudentsFromClass = (data: any) => {
  return request({
    url: `/schools/api/interestClass/removeStudentsFromClass`,
    method: "post",
    data,
  });
};

// 批量转班
export const transferStudentsToClass = (data: any) => {
  return request({
    url: `/schools/api/interestClass/transferStudentsToClass`,
    method: "post",
    data,
  });
};

// 结课
export const finishClassInClass = (data: any) => {
  return request({
    url: `/schools/api/interestClass/finishClassInClass`,
    method: "post",
    data,
  });
};

// 休学
export const suspensionClassInClass = (data: any) => {
  return request({
    url: "/schools/api/interestClass/suspensionClassInClass",
    method: "post",
    data,
  });
};

// 恢复在读
export const recoverReadingForStudents = (data: any) => {
  return request({
    url: "/schools/api/interestClass/recoverReadingForStudents",
    method: "post",
    data,
  });
};

// 批量取消报名
export const studentsUnSign = (data: any) => {
  return request({
    url: "/schools/api/courseSign/studentsUnSign",
    method: "post",
    data,
  });
};
