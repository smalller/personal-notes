import request from '@/utils/request';


// 新增商户
export function addMerchant(
    data: any
): Promise<any> {
    return request({
        url: `/pay-merchant/merchantPayDetail/addMerchantDetail`,
        method: 'post',
        data
    });
}

// 查询商户信息
export function currentMerchant(
): Promise<any> {
    return request({
        url: `/pay-merchant/smUser/currentMerchant`,
        method: 'get',
    });
}

// 上传商户文件
export function uploadFile(files: File[]): Promise<any> {
    const formData = new FormData();
    files.forEach(item => {
        formData.append('file', item)
    })
    return request({
        url: `/pay-merchant/merchantPayDetail/merchantPicUpload`,
        method: 'post',
        data: formData
    });
}