export interface Rule {
  field: string;
  fullField: string;
  trigger: string;
  type: string;
  [key: string]: any;
}

// 判断是否是外链
export const isExternal = (path: string): boolean => {
  return /^(https?:|mailto:|tel:)/.test(path);
};

// 金额验证
export function checkMoney(value: string): boolean {
  const inMoney =
    /(?:^[1-9]([0-9]+)?(?:.[0-9]{1,2})?$)|(?:^(?:0)$)|(?:^[0-9].[0-9](?:[0-9])?$)/;
  if (inMoney.test(value)) {
    return true;
  } else {
    return false;
  }
}

// 不能有特殊字符，仅可包含汉字、数字、字母，括号
export const validateStr = (
  rule: Rule,
  value: string,
  callback: any
): void => {
  // eslint-disable-next-line no-useless-escape
  if (/^[\u4E00-\u9FA5A-Za-z0-9\()（）]+$/.test(value)) {
    callback();
  } else {
    callback(new Error("不能有特殊字符，仅可包含汉字、数字、字母"));
  }
};

// 中文姓名
export const validateName = (
  rule: Rule,
  value: string,
  callback: any
): void => {
  if (/^(?:[\u4e00-\u9fa5·]{2,16})$/.test(value)) {
    callback();
  } else {
    callback(new Error("请输入中文姓名"));
  }
};

// 纯数字
export const validateNum = (
  rule: Rule,
  value: string,
  callback: any
): void => {
  if (/^\d+$/.test(value)) {
    callback();
  } else {
    callback(new Error("请输入纯数字"));
  }
};

// 不能有中文
export const validateCh = (
  rule: Rule,
  value: string,
  callback: any
): void => {
  if (!/[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/g.test(value)) {
    callback();
  } else {
    callback(new Error("不能有中文"));
  }
};

// 邮箱
export const validateEmail = (
  rule: Rule,
  value: string,
  callback: any
): void => {
  if (/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value)) {
    callback();
  } else {
    callback(new Error("请输入正确格式的邮箱"));
  }
};

// 手机号
export const validatePhone = (
  rule: Rule,
  value: string,
  callback: any
): void => {
  if (/(^1[3|4|5|6|7|8|9][0-9]{9}$)/.test(value)) {
    callback();
  } else {
    callback(new Error("请输入正确格式的号码"));
  }
};

// 银行卡卡号
export const validateBankNumber = (
  rule: Rule,
  value: string,
  callback: any
): void => {
  if (/^([1-9]{1})(\d{15}|\d{16}|\d{17}|\d{18})$/.test(value)) {
    callback();
  } else {
    callback(new Error("请输入正确格式的银行卡卡号"));
  }
};

// 客服电话
export const validateServicePhone = (
  rule: Rule,
  value: string,
  callback: any
): void => {
  if (/^(1[3|4|5|6|7|8|9])\d{9}$|^0\d{2,3}-?\d{7,8}$|^400[016789]\d{6}$|^400-[016789]\d{2}-\d{4}$/.test(value)) {
    callback();
  } else {
    callback(new Error("请输入正确格式的号码"));
  }
};

// 利率
export const validateRate = (
  rule: Rule,
  value: string,
  callback: any
): void => {
  if (+value <= 1) {
    callback();
  } else {
    callback(new Error("利率不能大于1"));
  }
};

// 身份证号码
export const validateIdCard = (
  rule: Rule,
  value: string,
  callback: any
): void => {
  if (/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value)) {
    callback();
  } else {
    callback(new Error("请输入正确的身份证号"));
  }
};





