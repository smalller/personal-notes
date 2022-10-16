import {
    validatePhone,
    validateServicePhone,
    validateRate,
    validateIdCard,
    validateCh,
    validateEmail,
    validateBankNumber,
    validateStr,
    validateName,
    validateNum
} from '@/utils/validate'

export const basicInfoRules = {
    mName: [
        { required: true, message: '请输入商户名称', trigger: 'blur' },
        { validator: validateStr, trigger: "blur" },
    ],
    mchntShortname: [
        { required: true, message: '请输入商户简称', trigger: 'blur' },
        { validator: validateStr, trigger: "blur" },
    ],
    contactName: [
        { required: true, message: '请输入联系人', trigger: 'blur' },
        { validator: validateName, trigger: "blur" },
    ],
    contactPhone: [
        { required: true, message: '请输入联系人手机号', trigger: 'blur' },
        { validator: validateServicePhone, trigger: "blur" },
    ],
    contactMobile: [
        { required: true, message: '请输入客服电话', trigger: 'blur' },
        { validator: validatePhone, trigger: "blur" },
    ],
    mAccount: [
        { required: true, message: '请输入登录账号', trigger: 'blur' },
        { validator: validateNum, trigger: "blur" },
    ],
    mPassword: [
        { required: true, message: '请输入登录密码', trigger: 'blur' },
        { validator: validateCh, trigger: "blur" },
    ],
    chargeRate: [
        { required: true, message: '请选择收费扣率', trigger: 'blur' },
    ],
    subsidyRate: [
        { required: true, message: '请输入补贴扣率', trigger: 'blur' },
        { validator: validateRate, trigger: "blur" },
    ],
    licenseType: [
        { required: true, message: '请选择证件类型', trigger: 'change' },
    ],
    contactAddr: [
        { required: true, message: '请输入商户经营地联系地址', trigger: 'blur' },
    ],
    contactEmail: [
        { required: true, message: '请输入联系邮箱', trigger: 'blur' },
        { validator: validateEmail, trigger: "blur" },
    ],
    business: [
        { required: true, message: '请选择经营范围代码', trigger: 'change' },
    ],
    cityCd: [
        { required: true, message: '请选择商户经营地市代码', trigger: 'change' },
    ],
    countyCd: [
        { required: true, message: '请选择商户经营地区县代码', trigger: 'change' },
    ],
    settleTp: [
        { required: true, message: '请选择清算类型', trigger: 'change' },
    ],
    artifNm: [
        { required: true, message: '请输入法人姓名', trigger: 'blur' },
        { validator: validateName, trigger: "blur" },
    ],
    acntArtifFlag: [
        { required: true, message: '请选择法人入账标识', trigger: 'change' },
    ],
    acntCertifExpireDt: [
        { required: true, message: '请选择入账证件到期日期', trigger: 'blur' },
    ],
    acntCertifTp: [
        { required: true, message: '请选择入账证件类型', trigger: 'blur' },
    ],
    acntCertifId: [
        { required: true, message: '请输入入账卡证件号', trigger: 'blur' },
        { validator: validateIdCard, trigger: "blur" },
    ],
    acntType: [
        { required: true, message: '请选择入账卡类型', trigger: 'blur' },
    ],
    acntNm: [
        { required: true, message: '请输入入账卡户名', trigger: 'blur' },
        { validator: validateStr, trigger: "blur" },
    ],
    settleTpCd: [
        { required: true, message: '请选择清算类型扣率套餐代码', trigger: 'blur' },
    ],
}

export const idCardInfoRules = {
    idcardFrontImg: [
        { required: true, message: '请上传身份证正面', trigger: 'blur' },
    ],
    idcardBackImg: [
        { required: true, message: '请上传身份证反面', trigger: 'blur' },
    ],
    idcardNumber: [
        { required: true, message: '请输入证件号', trigger: 'blur' },
        { validator: validateIdCard, trigger: "blur" },
    ],
    certifName: [
        { required: true, message: '请输入姓名', trigger: 'blur' },
        { validator: validateName, trigger: "blur" },
    ],
    certifId: [
        { required: true, message: '请输入法人身份证号', trigger: 'blur' },
        { validator: validateIdCard, trigger: "blur" },
    ],
    cardStartDt: [
        { required: true, message: '请选择法人身份证开始日期', trigger: 'blur' },
    ],
    certifIdExpireDt: [
        { required: true, message: '请选择法人身份证到期日期', trigger: 'blur' },
    ],
    businessLicenseImg: [
        { required: true, message: '请上传营业执照复印件', trigger: 'change' },
    ],
    businessName: [
        { required: true, message: '请输入营业执照名称', trigger: 'blur' },
        { validator: validateStr, trigger: "blur" },
    ],
    businessType: [
        { required: true, message: '请选择营业执照类型', trigger: 'change' },
    ],
    businessCode: [
        { required: true, message: '请输入营业执照编码', trigger: 'blur' },
        { validator: validateCh, trigger: "blur" },
        { min: 15, message: '最小长度为15位', trigger: "blur" },
    ],
    licenseStartDt: [
        { required: true, message: '请选择营业执照开始日期', trigger: 'blur' },
    ],
    licenseExpireDt: [
        { required: true, message: '请选择营业执照到期日期', trigger: 'blur' },
    ],
    licRegisAddr: [
        { required: true, message: '请输入营业执照注册地址', trigger: 'blur' },
    ],
}

export const bankCardInfoRules = {
    bankCardName: [
        { required: true, message: '请输入银行卡户名', trigger: 'blur' },
        { validator: validateStr, trigger: "blur" },
    ],
    bankName: [
        { required: true, message: '请选择开户银行', trigger: 'change' },
    ],
    bId: [
        { required: true, message: '请选择开户支行', trigger: 'change' },
    ],
    interBankNo: [
        { required: true, message: '请输入入账卡开户行联行号', trigger: 'blur' },
        { validator: validateNum, trigger: "blur" },
    ],
    acntNo: [
        { required: true, message: '请输入入账卡号', trigger: 'blur' },
        { validator: validateNum, trigger: "blur" },
    ],
    issBankNm: [
        { required: true, message: '请输入入账开户行名称', trigger: 'blur' },
        { validator: validateStr, trigger: "blur" },
    ],
    bankFrontImg: [
        { required: true, message: '请上传银行卡正面复印件图片', trigger: 'blur' },
    ],
    bankBackImg: [
        { required: true, message: '请上传银行卡反面复印件图片', trigger: 'blur' },
    ],
    bankNumber: [
        { required: true, message: '请输入银行卡卡号', trigger: 'blur' },
        { validator: validateBankNumber, trigger: "blur" },
    ],
    bankUserFont: [
        { required: true, message: '请上传收款人身份证正面复印件图片', trigger: 'blur' },
    ],
    bankUserReverse: [
        { required: true, message: '请上传收款人身份证反面复印件图片', trigger: 'blur' },
    ],
    bankUserCode: [
        { required: true, message: '请输入收款人身份证号', trigger: 'blur' },
        { validator: validateIdCard, trigger: "blur" },
    ],
    userPhone: [
        { required: true, message: '请输入收款人手机号', trigger: 'blur' },
        { validator: validatePhone, trigger: "blur" },
    ],
    authorizationImg: [
        { required: true, message: '请上传授权说明书', trigger: 'blur' },
    ],
}


