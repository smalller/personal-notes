export const validate = {
  rule: {
    name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
    class: [{ required: true, message: "请输入班级名称", trigger: "blur" }],
    createTime: [{ required: true, message: "请选择时间", trigger: "change" }],
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
