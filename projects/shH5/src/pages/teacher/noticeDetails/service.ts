import request from '@/base/request';

interface ReadNoticeParams {
  id: string;
}

/**
 * 阅读通知详情
 * @param params
 */
export const readNotice = (params: ReadNoticeParams) =>
  request('/teacher/selectById', {
    method: 'GET',
    params: params,
  });
