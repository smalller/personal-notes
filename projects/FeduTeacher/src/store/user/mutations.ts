import { School, SchoolInfo, UserState } from "@/store/user/state";

interface userInfo {
  userName: string;
  userId: string;
}

const mutations = {
  setUserInfo(state: UserState, user: userInfo): void {
    state.userInfo = user;
    // sessionStorage.setItem('userInfo',JSON.stringify(state.userInfo));
  },
  setUserId(state: UserState, userId: string): void {
    state.userId = userId;
    sessionStorage.setItem("userId", userId);
  },
  setToken(state: UserState, token: string): void {
    state.token = token;
    sessionStorage.setItem("token", token);
  },
  setSchoolId(state: UserState, schoolId: string): void {
    state.schoolId = schoolId;
    sessionStorage.setItem("schoolId", schoolId);
  },
  setSchoolList(state: UserState, schoolList: School[]): void {
    state.schoolList = schoolList;
    // sessionStorage.setItem("schoolList", JSON.stringify(schoolList));
  },
  setExpire(state: UserState, expire: number): void {
    state.expire = expire;
  },
  setSchoolInfo(state: UserState, schoolInfo: SchoolInfo): void {
    state.schoolInfo = schoolInfo;
  },
};

export default mutations;
