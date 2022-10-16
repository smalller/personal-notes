import { compareData } from "@/utils/common";

const mutations = {
  getRoleList(state: any, list: any) {
    state.roleList = list;
  },
  getTitleList(state: any, list: any) {
    state.titleList = list;
  },
  getClassList(state: any, list: any) {
    state.classList = list;
  },
  getGradeList(state: any, list: any) {
    state.gradeList = list.sort(compareData("codeInfoValue"));
  },
  getNationList(state: any, list: any) {
    state.nationList = list;
  },
  setTouchBottomFlag(state: any) {
    state.touchBottomFlag = new Date();
  },
  setStudentsListGrid(state: any, flag: boolean) {
    state.isStudentsListGrid = flag;
  },
};

export default mutations;
