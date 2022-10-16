import request from "@/utils/request";

/**
 * 一键短信提醒
 * @param data
 * @returns
 */
export const remindRead = (str: string) => {
  return request({
    url: `/schools/api/schoolRoll/remindRead?${str}`,
    method: "get",
  });
};

/**
 * 单个短信提醒
 * @param schoolName
 * @param schoolId
 * @returns
 */
export const remindOne = (schoolName: string, studentId: Array<string>) => {
  return request({
    url: `/schools/api/schoolRoll/remindSms`,
    method: "post",
    data: {
      schoolName,
      studentId,
    },
  });
};
