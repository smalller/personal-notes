// 验证手机
export const validatePhone = (val) => {
    if (/(^1[3|4|5|6|7|8|9][0-9]{9}$)/.test(val)) {
        return true
    } else {
        return '请输入正确格式的手机号'
    }
}

// 验证邮箱
export const validateEmail = (val) => {
    if (/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/.test(val)) {
        return true
    } else {
        return '请输入正确格式的邮箱'
    }
}

// 不能有特殊字符，仅可包含汉字、数字、字母，括号
export const validateStr = (val) => {
    if (/^[\u4E00-\u9FA5A-Za-z0-9\()（）]+$/.test(val)) {
        return true
    } else {
        return '不能有特殊字符，仅可包含汉字、数字、字母'
    }
}





export const addMerRules = {
    mName: [
        { required: true, message: '请输入商户名称' },
        { validator: validateStr },
    ],
    contactAddr: [
        { required: true, message: '请输入商户经营地联系地址' },
    ],
    contactPhone: [
        { required: true, message: '请输入申请人手机号' },
        { validator: validatePhone },
    ],
    contactEmail: [
        { required: true, message: '请输入申请人邮箱' },
        { validator: validateEmail },
    ],
    businessLicenseImg: [
        { required: true, message: '请上传营业执照图片' },
    ],
}