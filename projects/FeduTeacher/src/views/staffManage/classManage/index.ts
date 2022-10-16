export const validate = {
  rule: {
    name: [{ required: true, message: "请输入班级名称", trigger: "blur" }],
    className: [{ required: true, message: "请输入班级名称", trigger: "blur" }],
    grade: [{ required: true, message: "请选择年级", trigger: "blur" }],
    gradeLabel: [{ required: true, message: "请选择年级", trigger: "blur" }],
    classGrade: [{ required: true, message: "请选择年级", trigger: "blur" }],
    mobile: [
      { required: true, message: "请输入手机号", trigger: "blur" },
      { min: 11, message: "长度为11位", trigger: "blur" },
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
    createTime: [
      {
        type: "date",
        required: true,
        message: "请选择建班时间",
        trigger: "change",
      },
      // {
      //   validator: (rule: any, value: any, callback: any) => {
      //     console.log(value, 1233);
      //   },
      //   trigger: "change",
      // },
    ],
  },
};

export const gradeColors = [
  {
    color: "#7673C1",
  },
  {
    color: "#4FA8F9",
  },
  {
    color: "#FF852A",
  },
  {
    color: "#FFB73B",
  },
  {
    color: "#42C7C6",
  },
];

export interface classItem {
  grade: number | string;
  gradeLabel: string;
  id: number | string;
  isGraduating: boolean | string;
  name: string;
  schoolId: number | string;
  studentNum: number | string;
  teacherNum: number | string;
  teachersName: Array<string>;
}

export interface isChecked {
  isEmpt: boolean; //未选择
  isStudent: boolean; //是否有学生
}

export interface pieList {
  clazzNum: number;
  grade: number;
  color: string;
}

export interface pieItem {
  value: number;
  name: string;
  color: string;
}

export interface ruleForm {
  clazzImg: string;
  name: string;
  grade: string;
  classImgUrl: string;
  uuid: string;
  gradeLabel: string;
  schoolId: string;
}

export const staticData = {
  delTips: ["删除后不可恢复", "留校幼儿请在【幼儿管理】页面先转班或加入新班级"],
  graduateTips: [
    "毕业后相关幼儿考勤卡将无法使用",
    "留校幼儿请在【幼儿管理】页面先转班或加入新班级",
  ],
  moveTips: ["老师删除后可在“添加老师”处恢复"],
};
