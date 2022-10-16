import {
    api_request,
} from "@/router/ip";

export const getList = (row) => {
    return api_request({
        url: '/blade-system/finance/list',
        method: 'get',
        params: {
            ...row,
        }
    })
}

export const getDetail = (id) => {
    return api_request({
        url: '/blade-system/config/auth/detail',
        method: 'get',
        params: {
        id
        }
    })
}

export const remove = (ids) => {
    return api_request({
        url: '/blade-system/config/auth/del',
        method: 'delete',
        params: {
        ...ids
        },
    })
}


// 查询财务统计数据
export const statistics = (row) => {
    return api_request({
        url: '/blade-system/finance/statistics',
        method: 'get',
        params: {
            ...row,
        }
    })
}

// 财务收入列表
export const getFinanceRecevoirList = (row) => {
    return api_request({
        url: '/blade-system/finance/income/list',
        method: 'get',
        params: {
            ...row,
        }
    })
}
export const storeList = (row) => {
    return api_request({
      url: '/blade-system/store/select',
      method: 'get',
      params: {...row}
    })
}


// 订单详情
export const orderDetail = (row) => {
    return api_request({
      url: '/blade-system/order/detail',
      method: 'get',
      params: {...row}
    })
}

// 通过/拒绝审核
export const orderStatusAudit = (row) => {
    return api_request({
        url: '/blade-system/finance/audit',
        method: 'post',
        data: row
    })
}

// 通过审核时  查询商家的打款信息
export const storeInfo = (row) => {
    return api_request({
        url: '/blade-system/finance/accounts',
        method: 'get',
        params: {...row}
    })
}