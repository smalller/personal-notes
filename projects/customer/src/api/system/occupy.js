import {
    api_request,
    map_request,
    file_request,
} from "@/router/ip";

export const getList = (params) => {
    return api_request({
        url: '/blade-system/occupy/config/list',
        method: 'get',
        params: {
            ...params,
        }
    })
}
export const remove = (ids) => {
    return api_request({
        url: '/blade-system/occupy/config/remove',
        method: 'delete',
        params: {
            ids,
        }
    })
}

export const add = (row) => {
    return api_request({
        url: '/blade-system/occupy/config/submit',
        method: 'post',
        data: row
    })
}

export const update = (row) => {
    return api_request({
        url: '/blade-system/occupy/config/submit',
        method: 'post',
        data: row
    })
}


export const getOccupyOrder = (params) => {
    return api_request({
        url: '/blade-system/occupy/order/list',
        method: 'get',
        params: {
            ...params,
        }
    })
}
//接单
export const getOccupyOrderTake = (params) => {
    return api_request({
        url: '/blade-system/occupy/order/take',
        method: 'post',
        data: params
    })
}
// 离店
export const getOccupyOrderLeave = (params) => {
    return api_request({
        url: '/blade-system/occupy/order/leave',
        method: 'post',
        data: params
    })
}