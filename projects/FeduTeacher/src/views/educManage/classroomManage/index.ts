import { validateIntNum } from "@/utils/regular";

export interface ListRow {
  [key: string]: any;
}

export interface SelectOption {
  label: string;
  value: string;
}

export const staticData = {
  rules: {
    number: [{ required: true, message: "请输入教室编号", trigger: "blur" }],
    name: [
      {
        required: true,
        message: "请输入教室名称",
        trigger: "blur",
      },
    ],
    capacity: [
      { required: true, message: "请输入容纳人数", trigger: "blur" },
      { validator: validateIntNum, trigger: "change" },
    ],
  },
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
  statusFilterList: [
    {
      label: "全部",
      value: "",
    },
    {
      label: "启用中",
      value: 1,
    },
    {
      label: "停用中",
      value: 0,
    },
  ],
};
