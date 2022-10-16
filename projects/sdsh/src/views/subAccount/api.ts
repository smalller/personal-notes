import request from '@/utils/request';

// 提交分账
export function openFatspAccountIn(
    data: any,
): Promise<any> {
    return request({
        url: '/pay-merchant/funSplit/openFatspAccountIn',
        method: 'post',
        data
    });
}


// 分账列表
export function funSplitList(
    pageNum: number,
    pageSize: number,
    params: any
): Promise<any> {
    return request({
        url: '/pay-merchant/funSplit/funSplitList',
        method: 'get',
        params: {
            pageNum,
            pageSize,
            ...params
        }
    });
}

// 分账详情
export function funSplitListDetail(
    id: number,
): Promise<any> {
    return request({
        url: `/pay-merchant/funSplit/funSplitListDetail/${id}`,
        method: 'get',
    });
}

// 3.3分账签约提交
export function separateSubmit(
    data: any,
): Promise<any> {
    return request({
        url: '/pay-merchant/funSplit/separateSubmit',
        method: 'post',
        data
    });
}

// 3.4签约协议同意
export function signContract(
    data: any
): Promise<any> {
    return request({
        url: '/pay-merchant/funSplit/signContract',
        method: 'post',
        data
    });
}


// 上传图片
export function uploadFile(files: any): Promise<any> {
    const formData = new FormData();
    files.forEach(item => {
        formData.append('file', item)
    })
    return request({
        url: `/pay-merchant/funSplit/confirm`,
        method: 'post',
        data: formData
    });
}

// 查询是否存在签约
export function existSeparateSubmit(
): Promise<any> {
    return request({
        url: `/pay-merchant/funSplit/existSeparateSubmit`,
        method: 'get',
    });
}

// 删除
export function deleteFastpAccountIn(
    id: number | string,
): Promise<any> {
    return request({
        url: `/pay-merchant/funSplit/deleteFastpAccountIn/${id}`,
        method: 'post',
    });
}