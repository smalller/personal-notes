import request from '@/base/request';

export interface LoginForm {
  userPhone: string;
  verificationCode: string;
  openId?: string;
}

export interface ThacherUserInfo {
  buyId: string;
  id: string;
  identityStatus: number; //身份
  loginType: string; //登录用户类型 1：中台 ，2：商户，3：h5
  loginUser: string; //登录用户
  merchantId: string; //学校id
  token: string;
  userPhone: string;
}

/**
 * 验证码登录
 * @param params
 */
export const userLogin = (params: LoginForm) =>
  request('/teacherLogin/login', {
    method: 'post',
    data: params,
  });

/**
 * 用户退出登录
 */
export const userLoginOut = () =>
  request('/teacherLogin/logout', {
    method: 'post',
  });

/**
 * 获取用户信息
 */
export const getUserInfo = () =>
  request('/teacherLogin/getCurrent', {
    method: 'get',
    params: {
      identityStatus:
        sessionStorage.getItem('userType') === 'parent' ? '2' : '1',
    },
  });
