import request from '@/utils/request'

/**
 * 添加科目或小类
 * @param data
 * @returns {AxiosPromise}
 */
export const addCourseSubject = (data) =>
  request({
    method: 'POST',
    url: '/mamserver/api/course/addCourseSubject',
    data: data,
  })

/**
 * 查询科目
 * @param params
 * @returns {AxiosPromise}
 */
export const querySubject = (params) =>
  request({
    method: 'get',
    url: '/mamserver/api/course/querySubject',
    params: params,
  })

/**
 * 根据科目id查询子类科目
 * @param params
 */
export const queryBySubjectId = (params) =>
  request({
    method: 'GET',
    url: `/mamserver/api/course/queryBySubjectId/${params.subjectId}`,
    params,
  })

/**
 * 上下移科目
 * @param data
 * @returns {AxiosPromise}
 */
export const upOrDownSubject = (data) =>
  request({
    method: 'POST',
    url: '/mamserver/api/course/upOrDown',
    data,
  })

/**
 * 禁用科目
 * @param data
 * @returns {AxiosPromise}
 */
export const forbiddenSubject = (data) =>
  request({
    method: 'put',
    url: `/mamserver/api/course/forbiddenSubject/${data.id}`,
  })

/**
 * 添加课程
 * @returns {AxiosPromise}
 */
export const addCourse = (data) =>
  request({
    method: 'POST',
    url: '/mamserver/api/course/add',
    data: data,
  })

/**
 * 新增课节
 * @param data
 * @returns {AxiosPromise}
 */
export const addCourseSection = (data) =>
  request({
    method: 'POST',
    url: '/mamserver/api/course/addCourseSection',
    data: data,
  })

/**
 * 查询课程
 * @param params
 * @returns {AxiosPromise}
 */
export const queryCourse = (params) =>
  request({
    method: 'get',
    url: '/mamserver/api/course/queryCourse',
    params,
  })

/**
 * 查询课节
 * @param params
 * @returns {AxiosPromise}
 */
export const queryCourseSection = (params) =>
  request({
    method: 'get',
    url: `/mamserver/api/course/queryCourseSection/${params.courseId}`,
    params,
  })

/**
 * 上/下架课程
 * @param data
 * @returns {AxiosPromise}
 */
export const upOrDownCourse = (data) =>
  request({
    method: 'post',
    url: '/mamserver/api/course/upOrDownCourse',
    params: data,
  })

/**
 * 删除课节
 * @param data
 * @returns {AxiosPromise}
 */
export const deleteCourseSection = (data) =>
  request({
    method: 'delete',
    url: `/mamserver/api/course/deleteCourseSection/${data.id}`,
    data,
  })
