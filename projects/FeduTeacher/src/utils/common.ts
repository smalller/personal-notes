import request from "@/utils/request";
import micell from "micell";
import dayjs from "dayjs";
import { validateMoneyDuration } from "@/utils/regular";

export interface TopTypeListItem {
  label: string;
  value: number;
}

export interface MapDataObj {
  name: string;
  color: string;
  num: Array<string | number | undefined>;
  index?: number;
}

export interface MapData {
  date: string[];
  data: Array<MapDataObj>;
}

export interface YearsListItem {
  label: string | number;
  value: string | number;
}

export const validateData = {
  rules: {
    price: [
      { required: true, message: "请输入课程价格", trigger: "blur" },
      { validator: validateMoneyDuration, trigger: "blur" },
    ],
    teacherName: [
      { required: true, message: "请输入授课老师", trigger: "blur" },
    ],
    content: [{ required: true, message: "请输入上课时间", trigger: "blur" }],
    planId: [{ required: true, message: "请选择所属计划", trigger: "change" }],
  },
};

/**
 * 防抖函数
 */
export const throttle = (function () {
  let timer = 0;
  return function (callback: any, ms: number) {
    clearTimeout(timer);
    timer = setTimeout(callback, ms);
  };
})();

/**
 * 获取幼儿年龄
 * @param birth
 * @returns
 */
export const getAge = (birth: string): string => {
  const num = String(
    (micell.date.diff(birth, new Date(), "M") / 12).toFixed(1)
  );
  const res = num.indexOf(".");
  const year = num.slice(0, res);
  const month = num[res + 1];
  if (res !== -1) {
    if (+month === 0 && +year === 0) {
      return "1个月";
    } else if (+month === 0) {
      return `${year}岁`;
    } else if (+year === 0) {
      return `${month}个月`;
    } else {
      return `${year}岁${month}个月`;
    }
  } else {
    return `${year}岁`;
  }
};

/**
 * 自动生成最近5年年份选项
 * @returns
 */
export const createYears = (): Array<YearsListItem> => {
  const arr = [
    {
      label: dayjs().toDate().getFullYear(),
      value: dayjs().toDate().getFullYear(),
    },
  ];
  for (let i = 1; i < 5; i++) {
    const obj = {
      label: arr[arr.length - 1].label - 1,
      value: arr[arr.length - 1].value - 1,
    };
    arr.push(obj);
  }
  return arr;
};

/**
 * 筛选月度传递的参数
 * @returns
 */
export const monthDateArg = () => {
  const end = dayjs().toDate();
  const start = dayjs().toDate();
  start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
  return {
    start: micell.date.format(start, "YYYY-MM-DD"),
    end: micell.date.format(end, "YYYY-MM-DD"),
  };
};

// 时间戳转为多久前
export function getDateDiff(dateTimeStamp: number): string | undefined {
  const minute = 1000 * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const month = day * 30;
  const now = dayjs().toDate().getTime();
  const diffValue = now - dateTimeStamp;
  let result = "";
  if (diffValue < 0) {
    return;
  }
  const monthC = (diffValue / month) as string | number;
  const weekC = (diffValue / (7 * day)) as string | number;
  const dayC = (diffValue / day) as string | number;
  const hourC = (diffValue / hour) as string | number;
  const minC = (diffValue / minute) as string | number;
  if (monthC >= 1) {
    result = "" + parseInt(monthC as string) + "月前";
  } else if (weekC >= 1) {
    result = "" + parseInt(weekC as string) + "周前";
  } else if (dayC >= 1) {
    result = "" + parseInt(dayC as string) + "天前";
  } else if (hourC >= 1) {
    result = "" + parseInt(hourC as string) + "小时前";
  } else if (minC >= 1) {
    result = "" + parseInt(minC as string) + "分钟前";
  } else result = "刚刚";
  return result;
}

// 正常时间/时间戳转为时间戳
export function getDateTimeStamp(dateStr: string | number): number {
  if (typeof dateStr === "number") {
    return dateStr;
  }
  return Date.parse(dateStr.replace(/-/gi, "/"));
}

/**
 * 获取筛选表单数据
 */
export const setTableData = function (
  url: string,
  pageNo: number | string,
  pageSize: number | string,
  params: any
) {
  return request({
    url: url,
    method: "get",
    params: {
      pageNo,
      pageSize,
      ...params,
    },

    headers: {
      version: "1.2.0",
    },
  });
};

// 转换入职时间格式
export const selectEntryDate = (data: Date | string) => {
  if (data) {
    data = micell.date.format(data as Date | string, "YYYY-MM-DD");
    return data;
  }
};

//排序处理
export const compareData = (property: string) => {
  return (a: any, b: any) => {
    // console.log(a,b)
    const value1 = a[property];
    const value2 = b[property];
    // console.log(value1,value2)
    return +value1 - +value2; //升序,降序为value2 - value1
  };
};
