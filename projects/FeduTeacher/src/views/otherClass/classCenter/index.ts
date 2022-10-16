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
    courseName: [{ required: true, message: "请输入课程名称", trigger: "blur" }],
    pic: [
      {
        required: true,
        message: "请上传课程封面",
        trigger: "blur",
      },
    ],
    content: [
      { required: true, message: "请输入课程详情", trigger: "blur" },
    ],
  },
  section: {
    sectionName: [{ required: true, message: "请输入课节名称", trigger: "blur" }],
    videoPath: [
      { required: true, message: "请上传课节视频", trigger: "blur" },
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
