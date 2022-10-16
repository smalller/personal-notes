import request from '@/utils/request'
import { encryptedData } from '@/utils/encrypt'
import { loginRSA, tokenName } from '@/config'
import { LOGIN, USERINFO } from '@/cms/api/login'
const GETSCHOOLID = '/schools/api/schoolEmpRel/getRels'

/**
 * 获取学校id
 * @returns {AxiosPromise}
 */
export function getSchoolId() {
  return request({ url: GETSCHOOLID, method: 'get' })
}

export async function login(data) {
  if (loginRSA) {
    data = await encryptedData(data)
  }
  console.log(LOGIN)
  return request({
    url: LOGIN,
    method: 'post',
    data,
  })
}

export async function socialLogin(data) {
  if (loginRSA) {
    data = await encryptedData(data)
  }
  return request({
    url: '/socialLogin',
    method: 'post',
    data,
  })
}

export function getUserInfo(userType) {
  //此处为了兼容mock.js使用data传递accessToken，如果使用mock可以走headers
  return request({
    url: USERINFO + '?userType=' + userType,
    method: 'get',
    data: {
      //userType: userType,
    },
  })
}

export function logout() {
  return request({
    url: '/userserver/regLogin/logOut',
    method: 'post',
  })
}

export function register() {
  return request({
    url: '/register',
    method: 'post',
  })
}
