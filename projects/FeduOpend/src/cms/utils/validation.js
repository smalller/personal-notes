import Vue from 'vue'
Vue.prototype.filterRules = function (item) {
  let rules = []
  let message = item.msg || '该项不可为空'
  let validateCheckPass = null
  if (item.type === 'checkPassword') {
    validateCheckPass = (rule, value, callback) => {
      if (value !== item.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
  }
  if (item.required) {
    if (item.trigger) {
      rules.push({
        required: true,
        message,
        trigger: item.trigger,
      })
    } else {
      rules.push({
        required: true,
        message,
        trigger: 'blur',
      })
    }
  }
  if (item.max) {
    rules.push({
      min: 1,
      max: item.maxLength,
      message: '最多输入' + item.maxLength + '个字符!',
      trigger: 'blur',
    })
  }
  if (item.min && item.max) {
    rules.push({
      min: item.min,
      max: item.max,
      message: '字符长度在' + item.min + '至' + item.max + '之间!',
      trigger: 'blur',
    })
  }
  if (item.type) {
    let type = item.type
    switch (type) {
      case 'password':
        rules.push(
          {
            message: '密码不能为空',
            required: 1,
          },
          {
            pattern: /^\w{6,20}$/,
            message: '请输入6-20位数字字母',
            trigger: 'blur',
          }
        )
        break
      case 'checkPassword':
        rules.push(
          {
            message: '密码不能为空',
            required: 1,
          },
          {
            validator: validateCheckPass,
            trigger: 'blur',
          }
        )
        break
      case 'email':
        rules.push({
          type: 'email',
          message: '请输入正确的邮箱地址',
          trigger: 'blur',
        })
        break
      case 'num':
        rules.push(
          {
            message: '不能为空',
            required: 1,
          },
          {
            pattern: /^[0-9]*$/,
            message: '请输入数字！',
            trigger: 'blur',
          }
        )
        break
      case 'mobile':
        rules.push({
          pattern: /^\d{11}$/,
          message: '请输入正确的手机号',
          trigger: 'blur',
        })
        break
      case 'regexn':
        rules.push({
          pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]+$/,
          message: '只限输入字母汉字数字！',
          trigger: 'blur',
        })
        break
      case 'idCard':
        rules.push({
          pattern: /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
          message: '请输入正确的身份证号！',
          trigger: 'blur',
        })
        break
      case 'coordinate': // 坐标
        rules.push({
          pattern: /^\d{3}[.]\d{5,6}[,]\d{2,3}[.]\d{5,6}$/,
          message: '请输入正确的坐标！',
          trigger: 'blur',
        })
        break
      case 'price':
        rules.push(
          {
            required: true,
            message: '现金定价不能为空并且不为0',
            trigger: 'change',
          },
          {
            pattern: /(^[0-9]{1,6}$)/,
            message: '输入必须小于等于6位数且为整数',
            trigger: 'change',
          }
        )
        break
      case 'sequence':
        rules.push(
          {
            required: true,
            message: '栏目序号不能为空并且不为0',
            trigger: 'change',
          },
          {
            pattern: /(^[0-9]{1,2}$)/,
            message: '输入必须小于等于2位数且为整数',
            trigger: 'change',
          }
        )
        break
      case 'integral':
        rules.push(
          {
            required: true,
            message: '积分定价不能为空并且不为0',
            trigger: 'blur',
          },
          {
            pattern: /(^[0-9]{1,8}$)/,
            message: '输入必须小于等于8位数且为整数',
            trigger: 'blur',
          }
        )
        break
      default:
        rule.push({})
        break
    }
  }
  return rules
}
