import { validatePhone } from "@/utils/regular";

export interface IsEmptyDataFlag {
  isDimissionEmptyData: boolean;
  isDeleteEmptyData: boolean;
}

export interface StaffTableList {
  headPortraitUrl: string;
  name: string;
  mobile: string;
  title: string;
  roleNames: Array<string>;
  clazzes: Array<any>;
  allowLoginPC: number | string;
  noticeDynamicScope: string | number;
  noticeClazzScope: string | number;
  noticeScope: string | number;
  SettleApp: string | number;
  onboard: string;
  resignationTime: string;
  [key: string]: any;
}

export interface TitleList {
  codeInfoName: string;
  codeInfoId: string;
  [key: string]: any;
}

export interface TeachNumChartData {
  proportion: string;
  roleName: string;
  roleNum: number;
  totalNum: number;
  [key: string]: any;
}

export interface DataItem {
  allNum?: string | number | undefined;
  teacherNum?: string | number | undefined;
  otherNum?: string | number | undefined;
  resignationNum?: string | number | undefined;
  [key: string]: any;
}

export interface TitleListItem {
  codeInfoName: string;
  codeInfoId: string;
  [key: string]: any;
}

export const staticData = {
  logoutIdentityTextArr: [
    "离职后员工将无法登录园丁端APP",
    "并将解绑该员工的考勤卡",
  ],
  logoutDeleteTextArr: "删除后不可恢复，只能重新“新增员工”",
  topTypeList: [
    {
      label: "现有教职工",
      value: 1,
    },
    {
      label: "离职教职工",
      value: 9,
    },
  ],
  rules: {
    name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
    mobile: [
      { required: true, message: "请输入手机号", trigger: "blur" },
      { min: 11, message: "长度为11位", trigger: "blur" },
      { validator: validatePhone, trigger: "blur" },
    ],
    title: [
      {
        required: true,
        message: "请选择称谓",
        trigger: "change",
      },
    ],
    roleIds: [
      {
        type: "array",
        required: true,
        message: "请选择角色",
        trigger: "change",
      },
    ],
    onboard: [
      {
        type: "date",
        required: true,
        message: "请选择入职时间",
        trigger: "change",
      },
    ],
  },
};
