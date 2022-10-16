import request from '@/utils/request';
import axios from 'axios'
import micell from 'micell'
import { getToken } from '@/utils/localToken';

// 上传文件
export function uploadFile(file: File): Promise<any> {
    const data = new FormData();
    data.append('file', file)
    return request({
        url: `/pay-mg/merchant/uploadImage`,
        method: 'post',
        data
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


// 导出文件
export async function exportFile(url: string, params?: any, name?: string): Promise<void> {
    const headerToken = await getToken();
    axios.get(import.meta.env.VITE_APP_APIHOST + url, {
        headers: {
            source: 1,
            token: headerToken
        },
        params,
        responseType: "blob",
    }).then((res) => {
        const blob = new Blob([res.data], {
            type: "application/vnd.ms-excel;charset=utf-8",
        });
        const downUrl = window.URL.createObjectURL(blob);
        micell.download(downUrl, name);
    });
}