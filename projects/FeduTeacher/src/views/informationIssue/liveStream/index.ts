import { validateLiveDuration } from "@/utils/regular";

export const staticData = {
  topTypeList: [
    // {
    //   label: "手机直播",
    //   value: 1,
    // },
    {
      label: "推流直播",
      value: 1, //这里到时候要改为2
    },
  ],
  rules: {
    liveName: [{ required: true, message: "请输入直播主题", trigger: "blur" }],
    releaseScope: [
      {
        type: "array",
        required: true,
        message: "请选择发布范围",
        trigger: "blur",
      },
    ],
    publishUserId: [
      {
        required: true,
        message: "请选择主播老师",
        trigger: "change",
      },
    ],
    liveType: [
      {
        required: true,
        message: "请选择直播模式",
        trigger: "change",
      },
    ],
    coverImg: [
      {
        required: true,
        message: "请上传封面",
        trigger: "blur",
      },
    ],
    publishTime: [
      {
        type: "date",
        required: true,
        message: "请选择预计开播时间",
        trigger: "change",
      },
    ],
    liveDuration: [
      {
        required: true,
        message: "请输入预计时长",
        trigger: "blur",
      },
      { validator: validateLiveDuration, trigger: "blur" },
    ],
    description: [
      { required: true, message: "请输入直播详情", trigger: "blur" },
    ],
  },
};

export interface SearchObj {
  searchIssuer: string;
  searchAnchor: string;
  searchTheme: string;
  selectedStatus: string;
}

export interface LiveListRow {
  [key: string]: any;
}

// 获取直播状态
export function getLiveStatusStr(status: number): string | undefined {
  switch (status) {
    case 0:
      return "未开播";
    case 1:
      return "已结束";
    case 2:
      return "直播中";
  }
}

// 获取直播状态背景色
export function getLiveStatusBg(status: number): string | undefined {
  switch (status) {
    case 0:
      return "blue-bg";
    case 1:
      return "gray-bg";
    case 2:
      return "yellow-bg";
  }
}
