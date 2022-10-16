import request from "@/utils/request";
import { AxiosPromise } from "axios";

const LOGIN = "/userserver/regLogin/login";
// const GET_USER_INFO = "/userserver/api/user/selectByUserType";
const GET_USER_SCHOOL = "/schools/api/portrait/info";

type LoginData = {
  mobile: string;
  password: string;
  loginType: string;
  sysType: string;
  userType: string;
  captcha: string;
  uuid: number;
};

/**
 * 用户登陆
 * @param {LoginData} data
 */
export function login(data: LoginData): AxiosPromise {
  return request({
    url: LOGIN,
    method: "post",
    data,
  });
}
/**
 * 获取用户信息
 * @returns
 */
// export function getUserDetails(): AxiosPromise {
//   return request({
//     url: GET_USER_INFO,
//     method: "get",
//   });
// }

/**
 * 查询用户相关的学校信息
 */
export function getUserSchools(): AxiosPromise {
  return request({
    url: GET_USER_SCHOOL,
    method: "get",
  });
}
