import { KeyValue } from '@/common/types'

// 审核状态
export const payTypeList: KeyValue[] = [
    {
        label: '全部',
        value: ''
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

// 支付场景
export const projectTypeList: KeyValue[] = [
    {
        label: '全部',
        value: ''
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

// 交易类型
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
