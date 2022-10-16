import request from "@/utils/request";
import { LoginParamsType } from "./data.d";

export async function accountLogin(params: LoginParamsType): Promise<any> {
    return request({
        url: '/pay-merchant/smUser/login',
        method: 'POST',
        data: params,
    });
}

// 查询商户列表
export async function merchantList(account?: string): Promise<any> {
    return request({
        url: '/pay-merchant/smUser/merchantList',
        method: 'get',
        params: {
            account
        }
    });
}

// 发验证码
export async function sendSmsCode(account: string): Promise<any> {
    return request({
        url: '/pay-merchant/smUser/sendSmsCode',
        method: 'POST',
        data: {
            account
        },
    });
}

// 提交修改密码
export async function resetPassword(data: any): Promise<any> {
    return request({
        url: '/pay-merchant/smUser/resetPassword',
        method: 'POST',
        data
    });
}
