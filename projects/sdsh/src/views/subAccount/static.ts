
export const infoRules = {
    isIndividualMchnt: [
        { required: true, message: '请选择入账主体类型', trigger: 'change' },
        // { validator: validateStr, trigger: "blur" },
    ],
    insNameCn: [
        { required: true, message: '请输入入账方主体名称', trigger: 'blur' },
    ],
    settleTp: [
        { required: true, message: '请选择入账账户类型', trigger: 'change' },
    ],
    revenueTp: [
        { required: true, message: '请选择到账周期类型', trigger: 'change' },
    ],
    interBankNo: [
        { required: true, message: '请输入开户行行号', trigger: 'blur' },
    ],
    outAcntNm: [
        { required: true, message: '请输入户名', trigger: 'blur' },
    ],
    outAcntIdNo: [
        { required: true, message: '请输入身份证号', trigger: 'blur' },
    ],
    outAcntNo: [
        { required: true, message: '请输入银行账号', trigger: 'blur' },
    ],
    khxkjPic: [
        { required: true, message: '请上传开户许可证扫描照片', trigger: 'blur' },
    ],
    yhkzmPic: [
        { required: true, message: '请上传银行卡正面扫描照片', trigger: 'blur' },
    ],
    flagTp: [
        { required: true, message: '请选择证件类型', trigger: 'change' },
    ],
    certifiNm: [
        { required: true, message: '请输入证件名称', trigger: 'blur' },
    ],
    startUpCapital: [
        { required: true, message: '请输入开办资金', trigger: 'blur' },
    ],
    licNo: [
        { required: true, message: '请输入证件代码', trigger: 'blur' },
    ],
    licTov: [
        { required: true, message: '请选择有效期', trigger: 'blur' },
    ],
    licPic1: [
        { required: true, message: '请上传证件扫描照片', trigger: 'blur' },
    ],
    platNameCn: [
        { required: true, message: '请输入品牌名称', trigger: 'blur' },
    ],
    email: [
        { required: true, message: '请输入电子邮件', trigger: 'blur' },
    ],
    contactPerson: [
        { required: true, message: '请输入联系人', trigger: 'blur' },
    ],
    contactMobile: [
        { required: true, message: '请输入联系手机', trigger: 'blur' },
    ],
    zzjgdmzNo: [
        { required: true, message: '请输入组织机构代码证编号', trigger: 'blur' },
    ],
    zzjgdmzExpireDt: [
        { required: true, message: '请选择有效期到期日期', trigger: 'blur' },
    ],
    zzjgdmzPic1: [
        { required: true, message: '请上传组织机构代码证扫描照片', trigger: 'blur' },
    ],
    artifNm: [
        { required: true, message: '请输入法人姓名', trigger: 'blur' },
    ],
    certifId: [
        { required: true, message: '请输入身份证号', trigger: 'blur' },
    ],
    validDt: [
        { required: true, message: '请选择有效期至', trigger: 'blur' },
    ],
    contactPhone: [
        { required: true, message: '请输入联系手机', trigger: 'blur' },
    ],
    certifIdPic1: [
        { required: true, message: '请上传证件扫描照片正面', trigger: 'blur' },
    ],
    certifIdPic2: [
        { required: true, message: '请上传证件扫描照片反面', trigger: 'blur' },
    ],
}

export interface KeyValue {
    label: string,
    value: number | string
}

export const flagTpList: KeyValue[] = [
    {
        label: '营业执照',
        value: 0
    },
    {
        label: '(营业执照)三证合一',
        value: 1
    },
    {
        label: '医疗从业许可证',
        value: 2
    },
    {
        label: '民办非企业单位凭证登记证书',
        value: 3
    },
    {
        label: '其他',
        value: 9
    },
]

export const revenueTpList: KeyValue[] = [
    {
        label: 'T+1',
        value: '01'
    },
    {
        label: 'D+1',
        value: '02'
    },
    {
        label: '留存虚拟户(暂不支持)',
        value: '03'
    },
]

// 审核状态
export const statusList: KeyValue[] = [
    {
        label: '全部',
        value: ''
    },
    {
        label: '已拒绝',
        value: '00'
    },
    {
        label: '已创建待提交',
        value: '01'
    },
    {
        label: '已提交待审核',
        value: '02'
    },
    {
        label: '已审核待批准',
        value: '03'
    },
    {
        label: '已处理完成',
        value: '04'
    },
]

// 入账主体类型
export const inAccType: KeyValue[] = [
    {
        label: '全部',
        value: ''
    },
    {
        label: '企业',
        value: 0
    },
    {
        label: '个体',
        value: 8
    },
]