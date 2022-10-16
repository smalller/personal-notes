
import qs from "qs";
import {mapGetters, mapActions} from "vuex";

export default  {
  name: 'openId',
  data() {
    return {
      getOpenIdApi: '/pays/paycert/getOpenId', //获取微信openID
      openId: '',
    }
  },
  computed: {
    ...mapGetters(['userId','token'])
  },
  methods: {
    ...mapActions(['setUserId','setToken','setStudentInfo','setSchoolId']),
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
    getWeChatAppId() {
      this.requests(`${process.env['VUE_APP_BASE_API']}/pays/paycert/unAccess/getWXJsSDK`, {
        url: 'url',
      },{
      }).then(res => {
        console.log("当前符合 h5 打开指定app", res);
        this.getWechatCode(res.appId)
      })
    },
    getWechatCode(appId) {
      location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${location.origin}${location.pathname}&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect`;
    },

    getOpenId(code) {
      this.$request('/pays/paycert/getOpenId', {
        method: 'GET',
        params: {
          code: code
        }
      }).then(res => {
        if(+res.code === 0) {
          this.openId = res.data.openid
          sessionStorage.setItem('openId', res.data.openid)
        } else {
          this.getWeChatAppId()
        }
      })
    },
    async requests(url,data, options = {},headers={}) {
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
  },
  created() {
    if(this.$route.query.userId) {
      this.setUserId(this.$route.query.userId)
    }
    if(this.$route.query.token) {
      this.setToken(this.$route.query.token)
    }
    if(this.$route.query.studentId) {
      sessionStorage.setItem('studentId', this.$route.query.studentId)
      this.setStudentInfo({
        studentId: this.$route.query.studentId
      })
    }
    if(micell.ua.isWeChat()&&!this.$route.query?.upload) {
     if( this.userId&&this.token&&!sessionStorage.getItem('openId')) {
        if(this.$route.query.code) {
         this.getOpenId(this.$route.query.code)
         sessionStorage.setItem('photo', '')
       } else {
         this.getWeChatAppId()
       }
     }

    }
  }
}
