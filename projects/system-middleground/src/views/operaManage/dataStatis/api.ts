import request from '@/utils/request';

// 数据统计
export function getList(day: number | string
): Promise<any> {
    return request({
        url: `/pay-mg/operate/survey/${day}`,
        method: 'get',
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