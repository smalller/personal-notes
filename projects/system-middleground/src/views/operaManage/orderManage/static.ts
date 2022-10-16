import { KeyValue } from '@/common/data'

// 审核状态
export const statusList: KeyValue[] = [
    {
        label: '已失效',
        value: 1
    },
    {
        label: '未失效',
        value: 2
    }
]

// 收费类型
export const projectTypeList: KeyValue[] = [
    {
        label: '全部',
        value: 4
    },
    {
        label: '扫码收费',
        value: 1
    },
    {
        label: '名单收费',
        value: 2
    }
]

// 支付状态
export const payStatusList: KeyValue[] = [
    {
        label: '全部',
        value: ''
    },
    {
        label: '未支付完成',
        value: 0
    },
    {
        label: '待支付',
        value: 1
    },
    {
        label: '已支付',
        value: 2
    },
    {
        label: '支付失败',
        value: 3
    },
    {
        label: '退款',
        value: 4
    }
]