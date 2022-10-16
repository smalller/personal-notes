import request from "@/utils/request";
import {QueryItemParams, QueryObj} from "./data";
import {PageForm} from "@/common/types.ts";


// 统计列表
export function List(
  pageNum: number,
  pageSize: number,
  params: QueryObj
): Promise<any> {
  return request({
    url: "/pay-merchant/CodeStatistic/selectCodeStatistic",
    method: "get",
    params: {
      pageNum,
      pageSize,
      ...params,
    },
  });
}

//按收费项查询列表
export const getItemList = (params: QueryItemParams&PageForm): Promise<any> => request({
  url: '/pay-merchant/CodeStatistic/selectItemStatistic',
  method: "get",
  params: params,
})


//导出统计列表
export const exportTotalList = (pageNum: number,
                                pageSize: number,
                                params: QueryObj):Promise<any> => request({
  url: '/pay-merchant/CodeStatistic/exportitemStatistic',
  method: "get",
  params: {
    pageNum,
    pageSize,
    ...params,
  },
  responseType: 'blob'

})
