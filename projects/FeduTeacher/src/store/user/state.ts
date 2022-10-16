export interface UserInfo {
  userName?: string;
  userId?: string;
  expire?: number;
  lastLoginTime?: string;
  userPortait?: string;
}

export interface School {
  schoolId: string;
  sysAllow: string[];
}

export interface SchoolInfo {
  address?: string;
  agentCompanyId?: string;
  areaId?: string;
  beginDate?: string;
  cameraNum?: number;
  cameraType?: string;
  contactMobile?: string;
  contactName?: string;
  createTime?: string;
  enableStatus?: string;
  endDate?: string;
  forbid?: string;
  id?: string;
  name?: string;
}

export interface UserState {
  userInfo: UserInfo;
  userId: string;
  token: string;
  schoolId: string;
  schoolList: School[];
  expire: number;
  schoolInfo: SchoolInfo;
}
const state: UserState = {
  userInfo: {},
  userId: "",
  token: "",
  schoolId: "",
  schoolList: [],
  expire: 0,
  schoolInfo: {},
};

export default state;
