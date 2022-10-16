import request from '@/utils/request';
import { QueryObj } from './data'

// 商户列表
export function merchantList(
    pageNum: number,
    pageSize: number,
    params: QueryObj
): Promise<any> {
    return request({
        url: '/pay-mg/merchant/getMerchantAdminInfoList',
        method: 'get',
        params: {
            pageNum,
            pageSize,
            ...params
        }
    });
}

// 商户详情-列表信息
export function merchantDetailTableList(
    pageNum: number,
    pageSize: number,
    params: QueryObj
): Promise<any> {
    return request({
        url: `/pay-mg/settlement/getMerchantDetail`,
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

// 商户收支统计
export function merchantStatistics(
    params: QueryObj
): Promise<any> {
    return request({
        url: `/pay-mg/settlement/getMerchantStatistics`,
        method: 'get',
        params
    });
}

// 商户收支统计查看明细
export function settlementDetail(
    params: QueryObj
): Promise<any> {
    return request({
        url: `/pay-mg/settlement/getSettlementDetail`,
        method: 'get',
        params
    });
}

// 商户已结算查询
export function merchantSettledList(
    pageNum: number,
    pageSize: number,
    params: QueryObj
): Promise<any> {
    return request({
        url: `/pay-mg/settlement/select`,
        method: 'get',
        params: {
            pageNum,
            pageSize,
            ...params
        }
    });
}


// 新增商户
export function addMerchant(
    data: any
): Promise<any> {
    return request({
        url: `/pay-mg/merchant/addMerchant`,
        method: 'post',
        data
    });
}

// 商户设置详情信息
export function merchantSettingDetail(
    merchantId: number
): Promise<any> {
    return request({
        url: `/pay-mg/merchant/getMerchantSettingDetail/${merchantId}`,
        method: 'get',
    });
}


// 收支统计里查看明细里的查看按钮
export function seDetail(
    params: any
): Promise<any> {
    return request({
        url: `/pay-mg/settlement/getSeDetail`,
        method: 'get',
        params
    });
}

// 商户设置保存按钮
export function updateMerchantSetting(
    data: any
): Promise<any> {
    return request({
        url: `/pay-mg/merchant/updateMerchantSetting`,
        method: 'post',
        data
    });
}

// 商户设置详情里的查看银行卡信息
export function bankExamine(
    merchantBankId: number
): Promise<any> {
    return request({
        url: `/pay-mg/merchant/getBankExamine/${merchantBankId}`,
        method: 'get',
    });
}


// 经营范围代码列表



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

// 收费扣率列表
export function chargeRate(
): Promise<any> {
    return request({
        url: `/pay-mg/merchant/chargeRate`,
        method: 'get',
    });
}

