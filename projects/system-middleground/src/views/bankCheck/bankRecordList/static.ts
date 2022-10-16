import { KeyValue } from '@/common/data'

// 审核类型
export const bankStatusList: KeyValue[] = [
    {
        label: '全部',
        value: ''
    },
    {
        label: '通过',
        value: 1
    },
    {
        label: '未通过',
        value: 0
    }
]

// 审核状态
export const statusList: KeyValue[] = [
    {
        label: '全部',
        value: ''
    },
    {
        label: '新商户审核',
        value: 1
    },
    {
        label: '添加银行卡审核',
        value: 2
    },
    {
        label: '变更体现银行审核',
        value: 3
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