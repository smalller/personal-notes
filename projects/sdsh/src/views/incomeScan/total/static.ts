import { KeyValue } from '@/common/types'

// 支付方式
export const paywayList: KeyValue[] = [
    {
        label: '全部',
        value: 4
    },
    {
        label: '支付宝',
        value: 1
    },
    {
        label: '微信',
        value: 2
    },
    {
        label: '其他',
        value: 3
    },
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
