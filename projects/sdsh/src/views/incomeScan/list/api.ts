import request from "@/utils/request";
// import { QueryObj } from "./data";

// 查询明细列表
export function list(
  pageNum: number,
  pageSize: number,
  params: any
): Promise<any> {
  return request({
    url: "/pay-merchant/merchantPayDetail/getPayDetailList",
    method: "get",
    params: {
      pageNum,
      pageSize,
      ...params,
    },
  });
}

// 商户收费明细金额
export function ListInfo(params: any): Promise<any> {
  return request({
    url: `/pay-merchant/merchantPayDetail/getPayDetailListCount`,
    method: "get",
    params: {
      ...params,
    },
  });
}


//导出明细列表

export const exportDetailList = (params) => request({
  url: '/pay-merchant/merchantPayDetail/downPayDetailTemp',
  method: "post",
  data: params,
  responseType: 'blob'

})

//查询详情
export const queryPayInfo = (id: number, moddId: number):Promise<any> => request({
  url: '/pay-merchant/merchantPayDetail/getPayDetail',
  method: 'GET',
  params: {
    moId: id,
    moddId: moddId
  }
})

//更新备注
export const updateRemark = (params: any):Promise<any> => request({
  url: '/pay-merchant/merchantCodeCharge/updateRemark',
  method: 'POST',
  data: params
})
