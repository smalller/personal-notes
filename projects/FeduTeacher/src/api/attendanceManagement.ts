import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { PageForm } from "@/api/interface";

/**
 * 分页查询考勤记录
 * @param params
 */
export function attendanceInfoQuery(params: PageForm): AxiosPromise {
  return request({
    url: "/schools/api/attCensus/getStuAtts",
    method: "GET",
    params: params,
  });
}

/**
 * 分页查询考勤机
 * @param params
 * @returns {AxiosPromise}
 * @constructor
 */
export function QueryAttendanceMachine(params: PageForm): AxiosPromise {
  return request({
    url: "/facility/api/attMachine/query",
    method: "GET",
    params: params,
  });
}

type DeviceParams = {
  macAddr: string;
};
/**
 *人脸设备重启应用
 * @param data
 * @returns {AxiosPromise}
 */
export function reAppDevice(data: DeviceParams): AxiosPromise {
  return request({
    url: "/facility/api/hiot/device/reApp",
    method: "post",
    params: data,
  });
}

/**
 *人脸设备重启设备
 * @param data
 * @returns {AxiosPromise}
 */
export function reDevice(data: DeviceParams): AxiosPromise {
  return request({
    url: "/facility/api/hiot/device/reDevice",
    method: "post",
    params: data,
  });
}

/**
 *  人脸设备同步时间
 * @returns {AxiosPromise}
 */
export function deviceSynTime(data: DeviceParams): AxiosPromise {
  console.log(data);
  return request({
    url: "/facility/api/hiot/device/synTime",
    method: "post",
    params: data,
  });
}

/**
 * 人脸设备同步用户
 * @param data
 * @returns {AxiosPromise}
 */
export function syncDeviceUser(data: DeviceParams): AxiosPromise {
  return request({
    url: "/facility/api/hiot/user/sync",
    method: "post",
    params: data,
  });
}

interface StuInfo {
  studentId: string;
}

/**
 * 查询学生考勤人脸信息
 * @param params
 */
export function getOneByStu(params: StuInfo): AxiosPromise {
  return request({
    url: "/facility/api/att/face/getOneByStu",
    method: "get",
    params: params,
  });
}
