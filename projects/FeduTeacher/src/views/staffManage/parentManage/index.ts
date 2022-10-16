export interface IsEmptyDataFlag {
  isOpenMonEmptyData: boolean;
  isCloseMonEmptyData: boolean;
}

export interface ClassList {
  name: string;
  id: string;
  [key: string]: any;
}

export interface TeachNumChartData {
  proportion: string;
  roleName: string;
  roleNum: number;
  totalNum: number;
  [key: string]: any;
}

export interface DataItem {
  allNum?: string | number | undefined;
  teacherNum?: string | number | undefined;
  otherNum?: string | number | undefined;
  resignationNum?: string | number | undefined;
  [key: string]: any;
}

export interface parentTableList {
  [key: string]: any;
}

export interface OnCamera {
  cameraStatus: boolean;
  expireTime: Date | string;
  userId: string;
}

export interface RowInfo {
  cameraStatus: boolean;
  expireTime: Date | string | null;
  userId: string;
  [key: string]: any;
}
