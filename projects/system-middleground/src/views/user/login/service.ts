import request from '@/utils/request';
import { LoginParamsType } from './data.d';

export async function accountLogin(data: LoginParamsType): Promise<any> {
    return request({
        url: '/pay-mg/sysUser/login',
        method: 'post',
        data,
    });
}

// 发验证码
export async function sendSmsCode(account: string): Promise<any> {
    return request({
        url: '/pay-mg/sysUser/sendSysUserSmsCode',
        method: 'POST',
        data: {
            account
        },
    });
}

// 提交修改密码
export async function resetPassword(data: any): Promise<any> {
    return request({
        url: '/pay-mg/sysUser/resetSysUserPasswordByCode',
        method: 'POST',
        data
    });
}
