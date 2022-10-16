/*
 * @Author: 吴同学
 * @Date: 2022-03-03 18:01:58
 * @Last Modified by: 吴同学
 * @Last Modified time: 2022-03-14 10:00:54
 */
import request from '@/utils/request'

// 首页在园师生
export function getHomePageNowBySchoolId() {
  return request({
    url: '/schools/api/employee/getHomePageNowBySchoolId',
    method: 'GET',
  })
}

// 查询首页人员趋势
export function getHomePageReport(params) {
  return request({
    url: '/schools/api/employee/getHomePageReport',
    method: 'get',
    params: params,
  })
}

//  获取现有班级数据
export function getClassList(pageNo, pageSize, params) {
  return request({
    url: '/schools/api/clazz/query',
    method: 'get',
    params: {
      pageNo,
      pageSize,
      ...params,
    },
  })
}

// 公告列表
export const getNoticeList = (pageNo, pageSize, params) => {
  return request({
    url: '/notice/api/notice/query',
    method: 'get',
    params: {
      pageNo,
      pageSize,
      ...params,
    },
  })
}

// 获取现有幼儿统计数据
export const getSchoolProportion = () => {
  return request({
    url: `/schools/api/student/getStudentProportion`,
    method: 'get',
  })
}
