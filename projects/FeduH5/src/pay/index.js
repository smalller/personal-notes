import qs from 'qs'

import {mapGetters} from 'vuex'
// import wx from "weixin-js-sdk"

window.paySuccess = function (type=1) {
  // alert(`支付结果:${type}`)
  if(+type === 1) {
    window.$bus.$emit('pay:success')
  } else {
    window.$bus.$emit('pay:fail')
  }
}
export default {
  name: 'pay',
  computed: {
    ...mapGetters(['userId','token'])
  },
  data() {
    return {
      isApple: micell.ua.isIPhone() || micell.ua.isIPad() || micell.ua.isIOS() || micell.ua.isMacOS(),
      isWeChat: micell.ua.isWeChat(),
      isApp: false,
      getProductsApi: '/orders/order/getProducts', //获取商品列表
      addProductByOneApi: '/orders/order/addProductByOne', //创建订单
      startPay: '/pays/pay/payUrl', //支付接口
      productId: '',
      orderInfo: {},
      payTypeList: [
        {
          icon: require('./assets/weChatPay.png'),
          title: '微信支付',
          type: 'weChatPay'
        },
        // {
        //   icon: require('./assets/aliPay.png'),
        //   title: '支付宝支付',
        //   type: 'aliPay'
        // }
      ],
      payType: 'weChatPay',
      openId: sessionStorage.getItem('openId'),
      appId: '',
      studentId: '',
      loading: null,
    }
  },
  methods: {
    getProductsList() {
      const data = {
        productType: 'Photo',
        schoolId: '1'
      }
      this.request(process.env['VUE_APP_BASE_API']+this.getProductsApi, data,{
        method: 'get',
      }).then(res => {
        if(res.length > 0) {
          this.productId = res[0].id
          this.orderInfo = {
            amount: res[0].amount,
            originalAmout: res[0].originalAmout
          }
        }
      })
    },
    createOrder() {
      this.request(process.env['VUE_APP_BASE_API']+this.addProductByOneApi, {
        number: 1,
        productId: this.productId,
        productType: 'Camera',
      }, {
        method: 'post',

      }, {
        'Content-Type': 'application/json'
      }).then(res => {
        this.orderInfo = Object.assign(this.orderInfo, res)
        console.log(this.orderInfo)
      })
    },
    pay() {

      if(this.loading) {
        this.loading.clear()
        this.loading = null
      }
      this.loading = vant.Toast.loading({
        duration: 0,
        message: '支付中...',
        forbidClick: true,
        loadingType: 'spinner',
      })
      if(micell.ua.isWeChat()) {
        this.wechatPay()
        return
      }
      if(this.isApp &&micell.ua.isAndroid()) {
        if(this.payType === 'weChatPay') {
          this.appWeChatPay()
        }
        if(this.payType === 'aliPay') {}

      }
      if(this.isApple) {
        // window.webkit.messageHandlers.postMessage("pay")
        window.webkit.messageHandlers.pay.postMessage(this.orderInfo.id)
        return
      }
    },
    appWeChatPay() {
      this.request(process.env['VUE_APP_BASE_API']+this.startPay, {
        amount: this.orderInfo.amount,
        orderDesc: `金树丫-${this.orderInfo.description}`,
        orderId: this.orderInfo.id,
        payTradeType: 'APP',
        payGatewayType: '0',
        returnUrl: location.href,
        schoolId: '1'
      }, {
        method: 'post',
      }, {
        'Content-Type': 'application/json',
      }).then(payInfo => {
        payInfo.type = 'weChatPay'
        window.WebViewJavascriptBridge.pay(JSON.stringify(payInfo))
      })
    },
    copy (str) {
      // this.$refs.clipboardBrn.click()
      const copy = function (e) {
        e.clipboardData.setData('text/plain', str)// clipboardData对象
        e.preventDefault()// 阻止默认行为
      }
      // alert('复制成功')
      document.addEventListener('copy', copy)
      return document.execCommand('copy')
    },
    wechatPay() {
      this.request(process.env['VUE_APP_BASE_API']+this.startPay, {
        amount: this.orderInfo.amount,
        openId: this.openId,
        orderDesc: `金树丫-${this.orderInfo.description}`,
        orderId: this.orderInfo.id,
        payTradeType: 'JSAPI',
        payGatewayType: '0',
        returnUrl: location.href,
        schoolId: '1'
      }, {
        method: 'post',
      }, {
        'Content-Type': 'application/json',
      }).then(wxInfo => {
        if(wxInfo.code === 0) {
          const {extraMsg} = wxInfo
          const params = {
            "appId": extraMsg.appId,
            "timeStamp": extraMsg.timeStamp,
            "nonceStr": extraMsg.nonceStr,
            "package": extraMsg.package,
            "signType": extraMsg.signType,
            "paySign": extraMsg.paySign
          }

          wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: params.appId, // 必填，公众号的唯一标识
            timestamp: params.timeStamp, // 必填，生成签名的时间戳
            nonceStr: params.nonceStr, // 必填，生成签名的随机串
            signature: params.signature,// 必填，签名
            jsApiList: ['chooseWXPay'] // 必填，需要使用的JS接口列表
          });

          wx.ready(function () {
            wx.chooseWXPay({
              timestamp: params.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
              nonceStr: params.nonceStr, // 支付签名随机串，不长于 32 位
              package: params.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
              signType: params.signType, // 微信支付V3的传入RSA,微信支付V2的传入格式与V2统一下单的签名格式保持一致
              paySign: params.paySign, // 支付签名
              success: function (res) {
                // 支付成功后的回调函数
                // window.paySuccess(1, res)
                this.$bus.$emit('pay:success',)
              },
              fail:function (res) {
                // window.paySuccess(0, res)
                this.$bus.$emit('pay:fail')
              },
              cancel: function () {
                window.paySuccess(0, )
              }
            });
          })
        }
      })
    },
    async request(url,data, options = {},headers={}) {
      const method = options?.method?options.method:'get'
      if(method === 'get') {
        url+=`?${qs.stringify(data)}`
      }
      const opt = Object.assign(options, {
        method: method,
        body: method === 'post'?JSON.stringify(data):null,
        headers: Object.assign(headers, {
          userId: this.userId,
          token: this.token,
          version: '1.4.0',
          firmId: 'zdyjb'
        }),
      })
      const res = await fetch(url, opt).then(response => response.json())
      if(+res.code === 0) {
        return Promise.resolve(res.data)
      } else {
        return  Promise.resolve(res)
      }
    },
    getIsApp () {
      const ua = navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) === 'micromessenger') { // 微信浏览器判断
        return false
      } else if (ua.match(/QQ/i) === 'qq') { // QQ浏览器判断
        return false
      } else if (ua.match(/WeiBo/i) === "weibo") {
        return false
      } else {
        if (ua.match(/Android/i) != null) {
          return ua.match(/browser/i) == null
        } else if (ua.match(/iPhone/i) != null) {
          return ua.match(/safari/i) == null
        } else {
          return (ua.match(/macintosh/i) == null && ua.match(/windows/i) == null)
        }
      }
    },
  },
  created() {
    this.getProductsList()
    this.isApp = this.getIsApp()
    const params = qs.parse(location.search.split('?')[1])
    if(micell.ua.isWeChat()) {
      this.openId = sessionStorage.getItem('openId')
    }

    this.$bus.$on('pay:success', () => {
      if(this.loading) {
        this.loading.clear()
        this.loading = null
      }
      vant.Toast.success('支付成功')
    })
    if(this.getIsApp()) {
      // this.userId = params.userId
      // this.token = params.token
      // this.studentId = params.studentId
    }
  }
}
