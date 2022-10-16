import request from '@/utils/request';

// 父导航名称
export function PNavigationList(
): Promise<any> {
    return request({
        url: `/pay-mg/business/getPNavigationList`,
        method: 'get',
    });
}

// 导航名称
export function navigationList(
    pNavigation: string
): Promise<any> {
    return request({
        url: `/pay-mg/business/getNavigationList`,
        method: 'get',
        params: {
            pNavigation
        }
    });
}

// 品类名称
export function productSystem(
    navigation: string
): Promise<any> {
    return request({
        url: `/pay-mg/business/getProductSystem`,
        method: 'get',
        params: {
            navigation
        }
    });
}

// 商户经营地市代码
export function cityList(
): Promise<any> {
    return request({
        url: `/pay-mg/city/getCityList`,
        method: 'get',
    });
}

// 商户经营区县代码
export function areaList(
    name?: string
): Promise<any> {
    return request({
        url: `/pay-mg/city/getAreaList`,
        method: 'get',
        params: {
            name
        }
    });
}

// 银行卡列表
export function bankList(): Promise<any> {
    return request({
        url: `/pay-mg/bank/manageListFilter`,
        method: 'get',
    });
}

// 银行对应的支行列表
export function subBankList(
    dictLabel?: string
): Promise<any> {
    return request({
        url: `/pay-mg/bank/manageList`,
        method: 'get',
        params: {
            dictLabel
        }
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

// 收费扣率列表
export function chargeRate(
): Promise<any> {
    return request({
        url: `/pay-merchant/merchantPayDetail/chargeRate`,
        method: 'get',
    });
}
