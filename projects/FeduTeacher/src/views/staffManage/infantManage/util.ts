import { validatePhone } from "@/utils/regular";

export interface IsEmptyDataFlag {
  isDropOutEmptyData: boolean;
  isChangeClassEmptyData: boolean;
  isDeleteStudentsEmptyData: boolean;
}

export interface InfantTableList {
  headerImgUrl: string;
  name: string;
  contacts: string;
  sex: number;
  birthTime: string;
  clazzName: string;
  SettleApp: string | number;
  createTime: string;
  graduateTime: string;
  retreatTime: string;
  setSchoolRoll: string;
  [key: string]: any;
}

export interface ClassList {
  name: string;
  id: string;
  [key: string]: any;
}

export interface InfantNumChartData {
  num: number;
  rate: string;
  sex: number;
  total: number;
  [key: string]: any;
}

export interface DataItem {
  total?: string | number | undefined;
  beforeNum?: string | number | undefined;
  addNum?: string | number | undefined;
  graduate?: string | number | undefined;
  [key: string]: any;
}

export interface SelectOption {
  label: string;
  value: string;
}

export const staticData = {
  logoutGradenTextArr: [
    "退园后幼儿将会被移出本园，家长将不能查看班级及幼儿园的信息",
    "如果幼儿信息录错，请在【幼儿管理】的幼儿信息后面点击”修改“",
    "幼儿毕业，请在【班级管理】处毕业该幼儿所在的班级",
  ],
  changeClassText: "转班后幼儿相关信息将转入新的班级",
  deleteStudentsText: "删除后不可恢复，只能重新“新增幼儿”，请谨慎操作！",
  topTypeList: [
    {
      label: "现有幼儿",
      value: 1,
    },
    {
      label: "毕业幼儿",
      value: 2,
    },
    {
      label: "退园幼儿",
      value: 3,
    },
  ],
  parentManagePageTopType: [
    {
      label: "学籍信息",
      value: 1,
    },
    {
      label: "家长列表",
      value: 2,
    },
  ],
  schoolRollFilterList: [
    {
      label: "全部",
      value: "",
    },
    {
      label: "未提交",
      value: 0,
    },
    {
      label: "已提交",
      value: 1,
    },
  ],
  rules: {
    name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
    zhengyin: [{ required: true, message: "请输入正音姓名", trigger: "blur" }],
    birthTime: [
      {
        type: "date",
        required: true,
        message: "请选择出生年月",
        trigger: "blur",
      },
    ],
    createTime: [
      {
        type: "date",
        required: true,
        message: "请选择入园时间",
        trigger: "change",
      },
    ],
    clazzId: [
      { required: true, message: "请选择选择所在班级", trigger: "change" },
    ],

    contacts: [
      { min: 11, message: "长度为11位", trigger: "blur" },
      { required: true, message: "请输入手机号码", trigger: "blur" },
      { validator: validatePhone, trigger: "blur" },
    ],
    familyRels: [
      { required: true, message: "请选择亲属关系", trigger: "blur" },
    ],
  },
  kindredList: [
    {
      label: "爸爸",
      value: "FATHER",
    },
    {
      label: "妈妈",
      value: "MOTHER",
    },
    {
      label: "爷爷",
      value: "YEYE",
    },
    {
      label: "奶奶",
      value: "NAINAI",
    },
    {
      label: "外公",
      value: "WAIGN",
    },
    {
      label: "外婆",
      value: "WAIPO",
    },
    {
      label: "哥哥",
      value: "BROTHER",
    },
    {
      label: "姐姐",
      value: "SISTER",
    },
    {
      label: "舅舅",
      value: "JIUJIU",
    },
  ],
  filterList: [
    {
      label: "全部",
      value: "",
    },
    // {
    //   label: "未绑定考勤卡",
    //   value: 1,
    // },
    // {
    //   label: "已绑定考勤卡",
    //   value: 2,
    // },
    // {
    //   label: "未录入人脸",
    //   value: 3,
    // },
    // {
    //   label: "已录入人脸",
    //   value: 4,
    // },
    {
      label: "已入驻App",
      value: 1,
    },
    {
      label: "未入驻App",
      value: 0,
    },
  ],
};
