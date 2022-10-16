/*
 * @Author: 吴同学
 * @Date: 2022-01-25 14:54:05
 * @Last Modified by:   吴同学
 * @Last Modified time: 2022-01-25 14:54:05
 */
export interface Rule {
  field: string;
  fullField: string;
  trigger: string;
  type: string;
  [key: string]: any;
}

// 手机号码验证
export function checkPhone(value: string, callback: any): void {
  if (!/(^1[3|4|5|6|7|8|9][0-9]{9}$)/.test(value)) {
    callback(false);
  } else {
    callback(true);
  }
}
export const validatePhone = (
  rule: Rule,
  value: string,
  callback: any
): void => {
  checkPhone(value, function (res: boolean) {
    if (!res) {
      callback(new Error("请输入正确格式的手机号"));
    } else {
      callback();
    }
  });
};

// 预计时长验证
export function checkLiveDuration(value: string, callback: any): void {
  if (+value > 0) {
    callback(true);
  } else {
    callback(false);
  }
}
export const validateLiveDuration = (
  rule: Rule,
  value: string,
  callback: any
): void => {
  checkLiveDuration(value, function (res: boolean) {
    if (!res) {
      callback(new Error("请输入正确的预计时长"));
    } else {
      callback();
    }
  });
};

// 金额验证
export function checkMoneyDuration(value: string, callback: any): void {
  const inMoney =
    /(?:^[1-9]([0-9]+)?(?:.[0-9]{1,2})?$)|(?:^(?:0)$)|(?:^[0-9].[0-9](?:[0-9])?$)/;
  if (inMoney.test(value)) {
    callback(true);
  } else {
    callback(false);
  }
}
export const validateMoneyDuration = (
  rule: Rule,
  value: string,
  callback: any
): void => {
  checkMoneyDuration(value, function (res: boolean) {
    if (!res) {
      callback(new Error("请输入正确的金额"));
    } else {
      callback();
    }
  });
};

// 选择的日期不能早于当前日期
export function checkDate(value: string, callback: any): void {
  if (new Date().getTime() < new Date(value).getTime()) {
    callback(true);
  } else {
    callback(false);
  }
}
export const validateDate = (
  rule: Rule,
  value: string,
  callback: any
): void => {
  checkDate(value, function (res: boolean) {
    if (!res) {
      callback(new Error("所选日期不能早于当前日期"));
    } else {
      callback();
    }
  });
};

// 输入的人数得为正整数
export function checkIntNum(value: string, callback: any): void {
  if (/(^[1-9]\d*$)/.test(value)) {
    callback(true);
  } else {
    callback(false);
  }
}
export const validateIntNum = (
  rule: Rule,
  value: string,
  callback: any
): void => {
  checkIntNum(value, function (res: boolean) {
    if (!res) {
      callback(new Error("请输入正确的容纳人数"));
    } else {
      callback();
    }
  });
};
