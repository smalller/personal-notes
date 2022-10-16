import { KeyValue } from '@/common/data'

// 审核状态
export const statusList: KeyValue[] = [
    {
        label: '全部',
        value: ''
    },
    {
        label: '未通过',
        value: 0
    },
    {
        label: '通过',
        value: 1
    },
    {
        label: '审核中',
        value: 2
    },
    {
        label: '拒绝/失败',
        value: 3
    },
    {
        label: '待审核',
        value: 4
    },
    {
        label: '待提交资料',
        value: 5
    },
]

// 银行卡状态
export const bankStatusList: KeyValue[] = [
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
    },
]

// 上传说明
export const uploadListen = [
    {
        imgType: '营业执照照片',
        remark: '对公必填',
        cnName: '营业执照照片.jpg'
    },
    {
        imgType: '法人身份证正面照片',
        remark: '对公必填',
        cnName: '法人身份证正面照片.jpg'
    },
    {
        imgType: '法人身份证反面照片',
        remark: '对公必填',
        cnName: '法人身份证反面照片.jpg'
    },
    {
        imgType: '门脸照片',
        remark: '对公必填',
        cnName: '门脸照片.jpg'
    },
    {
        imgType: '门头照片',
        remark: '对公必填',
        cnName: '门头照片.jpg'
    },
    {
        imgType: '开户许可证照片',
        remark: '营业执照或营业执照（三证合一）入网的必填，其他非必填',
        cnName: '开户许可证.jpg'
    },
]