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
};
