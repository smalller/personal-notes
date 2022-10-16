import request from "@/utils/request";
import {QueryObj} from "@/views/incomeScan/scan/data";

// 查询带合并二维码列表
export function queryMergeQRCodeList(
    pageNum: number,
    pageSize: number,
    params: QueryObj
): Promise<any> {
    return request({
        url: "/pay-merchant/merchantCodeCharge/getQrCodelist",
        method: "get",
        params: {
            pageNum,
            pageSize,
            ...params,
        },
    });
}
