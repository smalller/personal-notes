import request from '@/utils/request'

/**
 * 查询反馈列表
 * @param params
 */
export const getFeedBackList = (params) =>
  request({
    url: '/schools/api/feedback/queryFeedback',
    method: 'get',
    params: params,
  })

/**
 * 删除反馈
 * @param params
 * @returns {*}
 */
export const deleteFeedBack = (params) =>
  request({
    url: `/schools/api/feedback/deleteFeedback/${params.id}`,
    method: 'delete',
  })

/**
 * 处理反馈
 * @param params
 * @returns {*}
 */
export const handleFeedBack = (params) =>
  request({
    url: '/schools/api/feedback/handleFeedback',
    method: 'put',
    data: params,
  })
