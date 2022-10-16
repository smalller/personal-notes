export interface QueryObj {
  projectName?: string;
  beginTime?: string;
  endTime?: string;
  isExpire?: string;
  times?: string[]
}

export interface QrCodeListItem {
  projectName: string;
  beginTime: string;
  endTime: string;
  isExpire: number;
  payNumber: string;
  createQrCode: string;
  id: number;
}

export interface BasicDetailInfo {
  chargeRate: string;
  contactsName: string;
  contactsPhone: string;
  mcName: string;
  refundMoney: string;
  serviceRate: string;
  subsidyRate: string;
  totalMoney: string;
}

// export interface MerchantDetailTableListItem {

// }

export interface QRCodeItem {
  registerName: string;
  remark: string;
  userFillInType: string;
  mccrId?: number;
}

export interface QRCodeProject {
  chargeMoney: number|string;
  chargeType: string;
  itemName: string;
  quantityLimit: number;
  required: string;
  mpId?: number;
}



export interface CreateQRCodeParams {
  attachmentUrl: string;
  beginTime: string;
  endTime: string;
  registerList?: QRCodeItem[];
  itemList?: QRCodeProject[];
  projectName: string;
  remark: string;
  status: string;
  times?: string[];
  id?: number;
}

export interface MergeQrCodeParams {
  ids: string;
  projectName: string;
}

export interface CreateQRCodeImgParams {
  content: string;
  height?: string;
  width?: string;
  logoUrl?: string;
}

export interface UpdateEndQrcode {
  endTime: string;
  mccId: number;
}
