import request from '@/utils/request'
export const YZMURL = '/userserver/regLogin/captcha.jpg' //获取验证码图片
const RESETPASS = '/userserver/regLogin/resetpwd' //重置密码
const GETPHONEMSG = '/userserver/regLogin/getForgotPwdMsg' //获取修改密码短信
const CHANGEPASS = '/userserver/regLogin/toRetrievePwd' //修改密码
/**
 * 重置密码
 * @param params
 * @param mobile
 * @returns {AxiosPromise}
 */
export function resetPass(params, mobile) {
  return request({
    url: `${RESETPASS}/${mobile}`,
    method: 'post',
    data: params,
  })
}

/**
 * 获取修改密码短信
 * @param phone
 * @returns {AxiosPromise}
 */
export function getPhoneMsg(phone) {
  return request({
    url: `${GETPHONEMSG}?phone=${phone}`,
    data: {},
    method: 'post',
  })
}

/**
 * 修改密码
 * @param data
 * @returns {AxiosPromise}
 */
export function changePassWord(data) {
  return request({
    url: CHANGEPASS,
    data,
    method: 'post',
  })
}
