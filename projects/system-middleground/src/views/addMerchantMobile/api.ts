import request from '@/utils/request';

// 提交申请
export function merchantApply(
    data: any,
): Promise<any> {
    return request({
        url: '/pay-mg/merchant/merchantApply',
        method: 'post',
        data
    });
}
