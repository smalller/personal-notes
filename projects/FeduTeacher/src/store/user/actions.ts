import router from "@/router";
import { getUserSchools } from "@/api/userServer";
import { School, UserInfo, UserState } from "@/store/user/state";
import Message from "@/themes/message";
import bus from "@/Layout/bus";
import { querySchoolInfo } from "@/api/school";

interface Context {
  commit: <V>(key: string, value?: V) => void;
  dispatch: <V>(key: string, value?: V) => void;
  state: UserState;
}
const actions = {
  setUserInfo(context: Context, user: UserInfo): void {
    context.commit("setUserInfo", user);
    context.commit("setExpire", user.expire);
    context.commit("setUserId", user.userId || "");
  },
  setToken(context: Context, token: string): void {
    context.commit("setToken", token);
  },
  setSchoolList(context: Context, schoolList: School[]): void {
    context.commit("setSchoolList", schoolList);
  },
  getSchoolInfo(context: Context, schoolId: string): void {
    // context.commit('')
    querySchoolInfo(schoolId).then((res) => {
      if (+res.code === 0) {
        // console.log(123);
        context.commit("setSchoolInfo", res.data);
      }
    });
  },
  setSchoolId(context: Context, schoolId: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const school = context.state.schoolList.find(
        (school) => school.schoolId === schoolId
      );
      if (school) {
        //判断用户是否有这个学校的登陆权限
        if (school.sysAllow.indexOf("cms") > -1) {
          context.commit("setSchoolId", schoolId);
          context.dispatch("getSchoolInfo", schoolId);
          bus.$emit("schoolChanged", schoolId);
          context.dispatch("getClassList");
          context.dispatch("getRoleList");
          context.dispatch("getTitleList");
          context.dispatch("getNationList");
          context.dispatch("getGradeList");
          router.push("/").then();
        } else {
          Message.error("用户没有登录学校后管权限");
          reject(context.state.schoolId);
        }
      }
    });
  },
  loginOut(context: Context): void {
    context.commit("setUserInfo", {});
    context.commit("setUserId", "");
    context.commit("setToken", "");
    context.commit("setSchoolList", []);
    context.commit("setSchoolId", "");
    router.push("/login").then();
  },
  setExpire(context: Context, expire: number): void {
    context.commit("setExpire", expire);
  },
  /**
   * 获取用户详细信息
   */
  getUserDetails(context: Context): Promise<School[]> {
    return new Promise<School[]>((resolve) => {
      getUserSchools().then((res) => {
        const { data } = res;
        const { user, employees } = data;
        const userInfo: UserInfo = Object.assign(context.state.userInfo, user);
        context.dispatch("setUserInfo", userInfo);
        context.dispatch("setSchoolList", employees);
        resolve(employees);
      });
    });
  },
};

export default actions;
