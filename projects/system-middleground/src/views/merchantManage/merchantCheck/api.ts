import request from '@/utils/request';
import { QueryObj } from './data'

// 商户列表
export function merchantExaminePageInfo(
    pageNum: number,
    pageSize: number,
    params: QueryObj
): Promise<any> {
    return request({
        url: '/pay-mg/merchant/getMerchantExaminePageInfo',
        method: 'get',
        params: {
            pageNum,
            pageSize,
            ...params
        }
    });
}

// 商户审核详情
export function merchantExamine(
    bankId: number,
    merchantId: number
): Promise<any> {
    return request({
        url: `/pay-mg/merchant/getMerchantExamine`,
        method: 'get',
        params: {
            bankId,
            merchantId
        }
    });
}

// 审核通过
export function updateMerchantExamine(
    data: any
): Promise<any> {
    return request({
        url: `/pay-mg/merchant/updateMerchantExamine`,
        method: 'post',
        data
    });
}

// 审核拒绝
export function updateModifyMerchant(
    merchantId: number | string
): Promise<any> {
    return request({
        url: `/pay-mg/merchant/updateModifyMerchant/${merchantId}`,
        method: 'post',
    });
}

//电子协议生成
export function elecContractGenerate(
    data: any
): Promise<any> {
    return request({
        url: `/pay-mg/merchant/elecContractGenerate`,
        method: 'post',
        data
    });
}

// 电子协议签署
export function elecContractSign(
    data: any
): Promise<any> {
    return request({
        url: `/pay-mg/merchant/elecContractSign`,
        method: 'post',
        data
    });
}

// 商户图片上传
export function merchantPicUpload(
    data: any
): Promise<any> {
    return request({
        url: `/pay-mg/merchant/merchantPicUpload`,
        method: 'post',
        data
    });
}

// 附件提交完成接口
export function attachConfirm(
    data: any
): Promise<any> {
    return request({
        url: `/pay-mg/merchant/attachConfirm`,
        method: 'post',
        data
    });
}


// 上传图片
export function uploadFile(files: any, MchntCd: string): Promise<any> {
    const formData = new FormData();
    formData.append('MchntCd', MchntCd)
    files.forEach(item => {
        formData.append('file', item)
    })
    return request({
        url: `/pay-mg/merchant/merchantPicUpload`,
        method: 'post',
        data: formData
    });
}