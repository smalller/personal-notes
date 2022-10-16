import request from '@/utils/request';
import {BillSetting} from "@/views/incomeReceipt/data";

//查询发票设置
export const getBillSetting = ():Promise<any> => request({
  url: '/pay-merchant/bill/select',
  method: 'GET',
})

//保存发票设置
export const saveBillSetting = (params: BillSetting):Promise<any> => request({
  url: '/pay-merchant/bill/update',
  method: 'POST',
  data: params
})

export const getBillUrl = (params: BillSetting): Promise<any> => request({
  method: 'GET',
  params: params,
  responseType: 'blob',
  url: '/pay-merchant/bill/getBill',
})
