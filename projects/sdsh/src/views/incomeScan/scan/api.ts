import request from "@/utils/request";
import {CreateQRCodeImgParams, CreateQRCodeParams, MergeQrCodeParams, QueryObj, UpdateEndQrcode} from "./data";
import {CreateMergeQrCode} from "@/views/incomeScan/data";

// 查询收费二维码列表
export function queryQRCodeList(
  pageNum: number,
  pageSize: number,
  params: QueryObj
): Promise<any> {
  return request({
    url: "/pay-merchant/merchantCodeCharge/selectQrList",
    method: "get",
    params: {
      pageNum,
      pageSize,
      ...params,
    },
  });
}


// 新增二维码
export function createQRCode(params:CreateQRCodeParams): Promise<any> {
  return request({
    url: `/pay-merchant/merchantCodeCharge/insertQrCode`,
    method: "post",
    data: params
  });
}

//修改二维码
export function editQRCode(params:CreateQRCodeParams): Promise<any> {
  return request({
    url: `/pay-merchant/merchantCodeCharge/updateQrCodeDetail`,
    method: "post",
    data: params
  });
}

//删除二维码
export const deleteQrCode = (id: number): Promise<any> => request({
  url: '/pay-merchant/merchantCodeCharge/deleteQrCodeById',
  method: "post",
  data: {
    id: id
  }
})

//合并二维码
export const mergeQRCode = (params:CreateMergeQrCode):Promise<any> => request({
  url: '/pay-merchant/merchantCodeCharge/mergeQrCode',
  method: "post",
  data: params
})

//查询二维码详情
export const queryQrCodeDetail = (id: string) => request({
  url: `/pay-merchant/merchantCodeCharge/qrCodeDetailsById/${id}`,
  method: 'get'
})

//生成二维码
export const createQRCodeImg = (params:CreateQRCodeImgParams):Promise<any> => request({
  url: '/pay-merchant/qrcode/getQRCodeBase64',
  method: 'get',
  params: params
})

//截止二维码
export const updateEndQrcode = (params: UpdateEndQrcode):Promise<any> => request({
  url: '/pay-merchant/merchantCodeCharge/updateEndTime',
  method: 'POST',
  data: params
})
