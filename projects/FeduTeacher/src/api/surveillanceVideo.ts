import request from "@/utils/request";
import { AxiosPromise } from "axios";
import string from "micell/string";

interface allVideoParams {
  sceneId?: string;
}

type pageForm = {
  pageNo?: number;
  pageSize?: number;
  sceneId?: string;
  ipcName?: string;
  sceneName?: string;
  clazzId?: string;
  deviceName?: string;
};

/**
 * 查询学校所有监控视频
 */
export function getSchoolAllVideo(params: allVideoParams): AxiosPromise {
  return request({
    url: "/facility/api/device/queryDeviceBySchool",
    method: "GET",
    params: params,
  });
}

interface DeviceInfo {
  id: string;
}

/**
 * 刷新设备
 */
export function refreshDevice(params: DeviceInfo): AxiosPromise {
  return request({
    url: "/facility/api/device/refreshDevice",
    method: "put",
    params: params,
  });
}

export interface QueryClassDevicePage {
  clazzName?: string;
  pageNo: number;
  pageSize: number;
}

/**
 * 班级摄像头分页查询
 * @param params
 */
export function queryClassDevicePage(
  params: QueryClassDevicePage
): AxiosPromise {
  return request({
    url: "/facility/api/device/queryClassDevicePage",
    method: "GET",
    params: params,
  });
}
/**
 * 班级摄像头分页查询
 * @param params
 */
export function queryClassEvDevicePage(
  params: QueryClassDevicePage
): AxiosPromise {
  return request({
    url: "/facility/api/ezviz/queryClassEzvizDevicePage",
    method: "GET",
    params: params,
  });
}

/**
 * 查询班级萤石云摄像头
 * @param classId
 */
export const queryClassDevice = (classId: string) =>
  request({
    url: "/facility/api/ezviz/queryEzvizDevicePage",
    method: "GET",
    params: {
      clazzId: classId,
    },
  });

interface postData {
  clazzIds: string;
  ipcIds: string[];
  ezvizIds?: string[];
}

/**
 * 班级绑定摄像头
 * @param data
 */
export function clazzBindDevice(data: postData): AxiosPromise {
  return request({
    url: "/facility/api/device/clazzBindDevice",
    method: "POST",
    data: data,
  });
}

/**
 * 班级绑定萤石摄像头
 * @param data
 */
export function clazzBindEvDevice(data: postData): AxiosPromise {
  return request({
    url: "/facility/api/ezviz/clazzBindEzvizDevice",
    method: "POST",
    data: data,
  });
}
/**
 *查询学校的所有场景
 */
export function queryAllScene(): AxiosPromise {
  return request({
    url: "/schools/api/scene/queryAllScene",
  });
}

/**
 *分页查询视频列表
 */
export function queryDevicePage(params: pageForm): AxiosPromise {
  return request({
    url: "/facility/api/device/queryDevicePage",
    method: "get",
    params: params,
  });
}

interface DeleteSceneParams {
  sceneIds: string;
}

/**
 * 删除场景
 * @param data
 */
export function deleteScene(data: DeleteSceneParams): AxiosPromise {
  return request({
    url: "/schools/api/scene/deleteScene",
    method: "delete",
    params: data,
  });
}

interface OpenSceneParams {
  sceneId: string;
}

/**
 * 开放场景
 * @param data
 */
export function openScene(data: OpenSceneParams): AxiosPromise {
  return request({
    url: "/schools/api/scene/openScene",
    method: "put",
    params: data,
  });
}

interface EditSceneData {
  sceneId: string;
  id?: string;
}
/**
 * 编辑摄像头信息
 */
export function editDevice(data: EditSceneData): AxiosPromise {
  return request({
    url: "/facility/api/device/editDevice",
    method: "put",
    data: data,
  });
}
/**
 * 编辑萤石摄像头
 * @param data
 */
export function editEvDevice(data: EditSceneData): AxiosPromise {
  return request({
    url: `/facility/api/ezviz/bindScene?id=${data.id}&sceneId=${data.sceneId}`,
    method: "put",
  });
}
interface openTimes {
  endTime: string;
  startTime: string;
}

interface PlaceData {
  id?: string;
  clazzIds?: string[];
  openDays?: string[];
  openTimes?: openTimes[];
  scene: string;
}

/**
 * 新增或编辑场景
 * @param data
 */
export function saveScene(data: PlaceData): AxiosPromise {
  return request({
    url: "/schools/api/scene/saveScene",
    method: "post",
    data: data,
  });
}

/**
 * 查询场景管理列表
 * @param params
 */
export function queryScenePage(params: pageForm): AxiosPromise {
  return request({
    url: "/schools/api/scene/queryScenePage",
    method: "get",
    params: params,
  });
}

/**
 * 查询学校摄像头状态
 * @param params
 */
export function queryCameraType(id: string): AxiosPromise {
  return request({
    url: `/schools/api/school/querybySchoolId/${id}`,
    method: "get",
  });
}

/**
 * 查询学校萤石摄像头
 * @param params
 */
export function queryEvCamera(params: pageForm): AxiosPromise {
  return request({
    url: `/facility/api/ezviz/queryEzvizDevicePage`,
    method: "get",
    params: params,
  });
}
