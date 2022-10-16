import { validateDate } from "@/utils/regular";

export const staticData = {
  rules: {
    name: [{ required: true, message: "请输入计划名称", trigger: "blur" }],
    endTime: [
      {
        type: "date",
        required: true,
        message: "请选择报名截止日期",
        trigger: "change",
      },
      { validator: validateDate, trigger: "change" },
    ],
    pic: [
      {
        required: true,
        message: "请上传封面",
        trigger: "blur",
      },
    ],
    introduction: [
      { required: true, message: "请输入招生计划简介", trigger: "blur" },
    ],
  },
  topTypeList: [
    {
      label: "学员列表",
      value: 1,
    },
    {
      label: "班级列表",
      value: 2,
    },
    {
      label: "排课列表",
      value: 3,
    },
    {
      label: "补课管理",
      value: 4,
    },
  ],
  initSchedCourseTopTypeList: [
    {
      label: "智能排课",
      value: 1,
    },
    {
      label: "日历排课",
      value: 2,
    },
  ],
  sortList: [
    {
      label: "报名时间",
      value: 1,
    },
    {
      label: "年龄",
      value: 2,
    },
    {
      label: "性别",
      value: 3,
    },
  ],
  stuStatusList: [
    {
      label: "全部状态",
      value: "",
    },
    {
      label: "在读",
      value: 1,
    },
    {
      label: "结课",
      value: 2,
    },
    {
      label: "休学",
      value: 3,
    },
    {
      label: "转班",
      value: 4,
    },
    {
      label: "移出",
      value: 5,
    },
  ],
  editClassRules: {
    clazzName: [{ required: true, message: "请输入班级名称", trigger: "blur" }],
    classNum: [{ required: true, message: "请输入满班人数", trigger: "blur" }],
  },
  batchDivide: {
    selClass: [{ required: true, message: "请选择班级", trigger: "blur" }],
  },
  changeClass: {
    destClazzId: [
      { required: true, message: "请选择转入班级", trigger: "blur" },
    ],
  },
};

export interface SearchObj {
  planName: string;
  status: string;
}

export interface ListRow {
  [key: string]: any;
}

export interface ClassList {
  name: string;
  id: string;
  [key: string]: any;
}

// 获取直播状态
export function getLiveStatusStr(status: number): string | undefined {
  switch (status) {
    case 0:
      return "未上架";
    case 1:
      return "招生中";
  }
}

// 获取直播状态背景色
export function getLiveStatusBg(status: number): string | undefined {
  switch (status) {
    case 0:
      return "blue-bg";
    case 1:
      return "yellow-bg";
  }
}
