import request from '@/base/request';

// 获取验证码
export const verrificationCode = (phone: string) =>
  request('/teacherLogin/getVerrificationCode', {
    method: 'GET',
    params: {
      phone,
    },
  });

/**
 * 获取微信信息
 */
export const getWechatInfo = () =>
  request('/teacherLogin/getAppId', {
    method: 'GET',
  });

/**
 * 微信登录
 * @param code
 */
export const wechatLogin = (code: string) =>
  request('/oauth2/getLifNumberAuth', {
    method: 'GET',
    params: {
      code: code,
    },
  });
