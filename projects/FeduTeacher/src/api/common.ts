import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { PageForm } from "@/api/interface";

/**
 * 上传图片数据
 * @param {*} data
 * @returns
 */
export function sendFile(data: any) {
  const formData = new FormData();
  formData.append("file", data);
  return request({
    url: "/mamserver/api/file/upload?bizType=Header",
    method: "post",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: formData,
  });
}

/**
 * 查询班级列表
 * @returns
 */
export const getClassList = () => {
  return request({
    url: `/schools/api/clazz/getClazz`,
    method: "get",
  });
};

/**
 * 获取称谓列表
 * @returns
 */
export const getTitleList = () => {
  return request({
    url: `/systemserver/sysCode/queryByType/NURSERY_EMPLOYEE_TITLE`,
    method: "get",
    params: {
      pageSize: 999,
    },
  });
};

/**
 * 获取角色列表
 * @returns
 */
export const getRoleList = () => {
  return request({
    url: `/systemserver/sysCode/queryByType/NURSERY_EMPLOYEE_ROLE`,
    method: "get",
    params: {
      pageSize: 999,
    },
  });
};

/**
 * 获取年级列表
 * @returns
 */
export const getGradeList = () => {
  return request({
    url: `/systemserver/sysCode/queryByType/NURSERY_GRADE_NAME`,
    method: "get",
  });
};

/**
 * 获取民族编码
 * @returns
 */
export const getNationList = () => {
  return request({
    url: `/systemserver/unAccess/sysCode/queryByType/nation`,
    method: "get",
  });
};

/**
 * 获取图片链接
 * @param id
 */
export function getImgUrl(id: string): AxiosPromise {
  return request({
    url: `/mamserver/file/upload/${id}`,
    method: "GET",
  });
}

/**
 * 获取招生信息
 * @param id
 */
export const GetEnrollment = (id: string) => {
  return request({
    url: `/schools/api/admissions/${id}`,
    method: "GET",
  });
};
/**
 * 保存招生信息
 * @param data
 * @returns
 */

export const SendEnrollment = (data: any) => {
  return request({
    url: "/schools/unAccess/admissions/update",
    method: "POST",
    data: data,
  });
};

/** 获取绑定的考勤卡列表
 * @param id
 * @returns
 */
export function getCardList(params: any): AxiosPromise {
  return request({
    url: `/facility/api/att/card/getCardList`,
    method: "GET",
    params,
  });
}

/** 挂失/恢复绑定考勤卡
 * @param data
 * @returns
 */
export function closeCard(data: any): AxiosPromise {
  return request({
    url: `/facility/api/att/card/closeCard`,
    method: "put",
    data,
  });
}

/**
 * 绑定考勤卡
 * @param outNumber
 * @returns
 */
export function bindUser(data: any): AxiosPromise {
  return request({
    url: `/facility/api/att/card/bindUser`,
    method: "post",
    data,
  });
}

interface FaceFeature {
  images: string[];
  identity: string;
  studentId: string;
  studentName: string;
  clazzName: string;
  clazzId: string;
}

/**
 * 录入人脸信息
 * @param data
 * @returns
 */
export function SaveFaceFeature(data: FaceFeature): AxiosPromise {
  return request({
    url: "/facility/api/att/face/saveFaceFeature",
    method: "post",
    data: data,
  });
}

/**
 *查询人脸录入状态
 * @param id
 * @constructor
 */
export function GetUserFaceStatus(id: string): AxiosPromise {
  return request({
    url: `/facility/api/att/face/getOne/${id}`,
    method: "get",
  });
}

/**
 *未知用户检测列表
 * @param params
 * @constructor
 */
export function AnonyuserList(params: PageForm): AxiosPromise {
  return request({
    url: "/facility/api/hiot/anonyuser/list",
    method: "get",
    params: params,
  });
}

/**
 *查询班徽列表
 * @param id
 * @constructor
 */
export function GetClassIcon(): AxiosPromise {
  return request({
    url: "/schools/api/clazz/clazzEmblems",
    method: "get",
  });
}
