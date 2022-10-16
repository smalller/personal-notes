import request from '@/utils/request';
import axios from 'axios'
import micell from 'micell'
import { getToken } from '@/utils/localToken';

// 上传文件
export function uploadFile(file: File): Promise<any> {
    const data = new FormData();
    data.append('file', file)
    return request({
        url: `/pay-merchant/merchantUpload/uploadImage`,
        method: 'post',
        data
    });
}

// 分账上传文件
export function subAccUploadFile(file: File): Promise<any> {
    const data = new FormData();
    data.append('file', file)
    return request({
        url: `/pay-merchant/merchantUpload/uploadImage`,
        method: 'post',
        data
    });
}

// 导出/下载文件
export async function exportFile(url: string, params?: any, name?: string): Promise<void> {
    const headerToken = await getToken();
    axios.get(process.env.VUE_APP_APIHOST + url, {
        headers: {
            source: 2,
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

// 查询订单详情
export function selectOrderById(id: string | number): Promise<any> {
    return request({
        url: `/pay-merchant/MerchantName/selectOrderById`,
        method: 'get',
        params: {
            id
        }
    });
}