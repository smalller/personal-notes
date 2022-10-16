import { KeyValue } from '@/common/data'

// 支付方式
export const paywayList: KeyValue[] = [
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

// 收费类型
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

// 证件类型列表
export const licenseTypeList: KeyValue[] = [
    // {
    //     label: '企业商户：营业执照',
    //     value: 0
    // },
    {
        label: '企业商户：三证合一',
        value: 1
    },
    // {
    //     label: '事业单位',
    //     value: 2
    // }
]

// 清算类型列表
export const settleTpList: KeyValue[] = [
    {
        label: '自动结算（T1）',
        value: 1
    },
    {
        label: '手动结算',
        value: 2
    },
    {
        label: '自动结算（D1）',
        value: 3
    },
    {
        label: '定时结算',
        value: 4
    }
]

// 法人入账标识
export const acntArtifFlagList: KeyValue[] = [
    {
        label: '非法人入账',
        value: 0
    },
    {
        label: '法人入账',
        value: 1
    }
]