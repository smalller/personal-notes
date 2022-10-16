import request from '@/utils/request'
import { encryptedData } from '@/utils/encrypt'
import { loginRSA, tokenName } from '@/config'
import { LOGIN, USERINFO } from '@/cms/api/login'
const GETSCHOOLID = '/schools/schoolEmpRel/query'

/**
 * 获取学校id
 * @returns {AxiosPromise}
 */
export function getSchoolId() {
  return request({
    url: GETSCHOOLID,
    method: 'get',
  })
}

export async function login(data) {
  if (loginRSA) {
    data = await encryptedData(data)
  }
  console.log(data, LOGIN, loginRSA, 100)
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

export function getUserInfo(userId, userType) {
  //此处为了兼容mock.js使用data传递accessToken，如果使用mock可以走headers
  return request({
    url: USERINFO + `?userType=${userType}`,
    method: 'get',
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

//新增
export function newAddUser(data) {
  return request({
    url: `/userserver/api/operate/insert`,
    method: 'post',
    data,
  })
}

//修改
export function changeUser(data) {
  return request({
    url: `/userserver/api/operate/update`,
    method: 'post',
    data,
  })
}
