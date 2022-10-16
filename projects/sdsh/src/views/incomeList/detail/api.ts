import request from '@/utils/request';
import {CreateUserPay, QueryListParams} from './data'

// 交易明细展示
export function getInfoList(
    pageNum: number,
    pageSize: number,
    params: QueryListParams
): Promise<any> {
    return request({
        url: '/pay-merchant/MerchantName/selectOrder',
        method: 'get',
        params: {
            pageNum,
            pageSize,
            ...params
        }
    });
}

// 商户详情-基本信息
export function merchantDetailBasicInfo(
    merchantId: number
): Promise<any> {
    return request({
        url: `/pay-mg/settlement/getDetail/${merchantId}`,
        method: 'get',
    });
}

//查询年级列表
export const getGradeList = ():Promise<any> => request({
    url: '/pay-merchant/merchantGrade/list',
    method: 'get'
})

//查询班级列表
export const getClassList = (gradeId: number):Promise<any> => request({
    url: '/pay-merchant/merchantClass/list',
    method: 'get',
    params: {
        gradeId,
        pageSize: 999
    }
})

//添加按名单收费
export const createPay = (params: CreateUserPay): Promise<any> => request({
    url: '/pay-merchant/MerchantName/InsertCharge',
    method: 'POST',
    data: params
})

//修改按名单收费
export const editPay = (params: CreateUserPay): Promise<any> => request({
    url: '/pay-merchant/MerchantName/InsertCharge',
    method: 'POST',
    data: params
})

//查询收费明细详情
export const queryPayInfo = (id: number): Promise<any> => request({
    url: '/pay-merchant/MerchantName/selectOrderById',
    method: 'GET',
    params: {
        id: id
    }
})

//导出excel
export const exExcel = (pageNum: number,
                        pageSize: number,
                        params: QueryListParams):Promise<any> => request({
    url: '/pay-merchant/MerchantName/uploadOrder',
    method: 'get',
    params: {
        pageNum,
        pageSize,
        ...params
    },
    responseType: 'blob'
})

//导出名单收据
export const exNameBill = (pageNum: number,
                           pageSize: number,
                           params: QueryListParams):Promise<any> => request({
    url: '/pay-merchant/MerchantName/selectBillUrl',
    method: 'get',
    responseType: 'blob',
    params: {
        pageNum,
        pageSize,
        ...params
    },
})
