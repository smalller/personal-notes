import {
  CreateQRCodeParams,
  QRCodeItem,
  QRCodeProject,
} from "@/views/incomeScan/scan/data";

export interface CreateMergeQrCode extends CreateQRCodeParams {
  ids: number[];
  registerList: QRCodeItem[];
  regis: number[];
  itemList: QRCodeProject[];
  items: number[];
}
