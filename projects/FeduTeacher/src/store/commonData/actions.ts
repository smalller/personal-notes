import {
  getRoleList,
  getTitleList,
  getClassList,
  getGradeList,
  getNationList,
} from "@/api/common";

const actions = {
  getRoleList(cxt: any) {
    getRoleList().then((res) => {
      if (+res.code === 0) {
        cxt.commit("getRoleList", res.data.list);
      } else {
        cxt.commit("getRoleList", []);
      }
    });
  },
  getTitleList(cxt: any) {
    getTitleList().then((res) => {
      if (+res.code === 0) {
        cxt.commit("getTitleList", res.data.list);
      } else {
        cxt.commit("getTitleList", []);
      }
    });
  },
  getClassList(cxt: any) {
    getClassList().then((res) => {
      if (+res.code === 0) {
        cxt.commit("getClassList", res.data);
      } else {
        cxt.commit("getClassList", []);
      }
    });
  },
  getNewList(cxt: any) {
    getClassList().then((res) => {
      if (+res.code === 0) {
        cxt.commit("getNewList", res.data);
      } else {
        cxt.commit("getNewList", []);
      }
    });
  },
  getGradeList(cxt: any) {
    getGradeList().then((res) => {
      if (+res.code === 0) {
        cxt.commit("getGradeList", res.data.list);
      } else {
        cxt.commit("getGradeList", []);
      }
    });
  },
  getNationList(cxt: any) {
    getNationList().then((res) => {
      if (+res.code === 0) {
        cxt.commit("getNationList", res.data);
      } else {
        cxt.commit("getNationList", []);
      }
    });
  },
};

export default actions;
