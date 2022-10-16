export interface QueryBusParams {
  driverName: string;
  status: string;
}

export interface CreateOrEditBusParams {
  adminMobile: string; //管理员电话
  adminName: string; //管理员名字
  busLogo: string; //校车图片
  busNo: string; //校车编号
  driverMobile: string; //司机电话
  driverName: string; //司机名字
  maxPerson: string; //核载人数
  plateNumber: string; //车牌号
  enableStatus: string; //车辆状态 1：正常  2：维护 3：删除
  id?: string;
  carStatus: string;
}

export interface QueryUserParams {
  name: string;
}
