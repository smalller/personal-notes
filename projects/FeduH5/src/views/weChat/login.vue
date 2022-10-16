<template>
  <div class="login">
    <div class="logoInfo">
      <img
        src="./assets/image/appLogo.png"
        alt=""
      >
      <span>金树丫</span>
    </div>
    <div
      v-show="!isWeChat"
      class="info"
    >
      <span>请用“微信”打开本页面</span>
    </div>
  </div>
</template>

<script>

import { mapGetters, mapActions } from 'vuex'
import { getFileUrl } from "@/api/common";
import qs from "qs";

export default {
  name: "login",
  data() {
    return {
      appId: '',
      wxCode: '',
      openId: '',
      isTeacher: 0,
      isWeChat: micell.ua.isWeChat()
    }
  },
  computed: {
    ...mapGetters(['schoolId'])
  },
  methods: {
    ...mapActions(['setSchoolInfo', 'setToken', 'setUserId', 'setUserInfo']),
    async getWechatCode() {
      const wxInfo = await this.getWeChatAppId()
      const url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${wxInfo.appId}&redirect_uri=${location.origin}${location.pathname}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`
      location.href = url
    },
    getUserIsTeacher() {
      return new Promise(resolve => {
        this.$request('/schools/api/schoolEmpRel/getRels', {
          method: 'get',
          params: {
            schoolId: this.schoolId
          },

        }).then(res => {
          if (+res.code === 0) {
            if (res.data.length === 0) {
              this.isTeacher = 0
            } else {
              const school = res.data.find(item => item.schoolId === this.schoolId)
              this.isTeacher = +!!school
            }
            resolve()
          }
        })
      })
    },
    wechatLogin() {
      this.$request('/userserver/regLogin/unAccess/wxLogin', {
        method: 'post',
        params: {
          openId: this.openId
        },
      }).then(async res => {
        if (+res.code === 0) {
          this.setUserId(res.data.userId)
          this.setToken(res.data.token)
          this.setUserInfo(res.data)
          const isSelectStudent = +sessionStorage.getItem('isSelectStudent')
          if (isSelectStudent) {
            await this.getUserIsTeacher()
            await this.getSchoolInfo()
            sessionStorage.setItem('isTeacher', this.isTeacher)
            this.$router.push({
              name: 'selectStudent'
            })
          } else {
            this.jump()
          }
        } else {

          this.$router.push({
            name: 'weChatBind',
            query: {
              openId: this.openId
            }
          })
        }
      })
    },
    jump() {
      const path = sessionStorage.getItem('routerPath')
      const query = JSON.parse(sessionStorage.getItem('routerQuery'))
      location.href = location.origin + path + '?' + qs.stringify(query)
    },
    getOpenId(code) {
      this.$request(`/pays/paycert/unAccess/getOpenId`, {
        method: 'get',
        params: {
          code: code
        }
      }).then(res => {
        if (res.code === 0) {
          sessionStorage.setItem('openId', res.data.openid)
          this.openId = res.data.openid
          this.wechatLogin()
        } else {
          this.getWechatCode()
        }
      })
    },
    getSchoolInfo() {
      return new Promise(resolve => {
        this.$request(`/schools/api/school/querybyId/${this.schoolId}`, {
          method: 'get'
        }).then(res => {
          if (res.logo) {
            getFileUrl(res.logo).then(logo => {
              if (+logo.code === 0) {
                res.logoUrl = logo.data
                this.setSchoolInfo(res)
                resolve()
              }
            })
          } else {
            res.logoUrl = ''
            this.setSchoolInfo(res)
            resolve()
          }

        })
      })
    },
    getWeChatAppId() {
      return this.$request(`/pays/paycert/unAccess/getWXJsSDK`, {
        method: 'get',
        params: {
          url: location.href,
        }
      }).then(res => res.data)
    },
    async opensys() {
      const wxInfo = await this.getWeChatAppId()
      wx.config({
        appId: wxInfo.appId,
        timestamp: wxInfo.timestamp, // 必填，生成签名的时间戳
        nonceStr: wxInfo.nonceStr, // 必填，生成签名的随机串
        signature: wxInfo.signature,// 必填，签名
        jsApiList: ['scanQRCode']
      })
      wx.ready(function () {
        wx.scanQRCode({
          needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
          scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
          success: function (res) {
            var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
            console.log(res);
          }
        })
      })
    }
  },
  created() {
    if (micell.ua.isWeChat()) {
      if (this.$route.query?.code) {
        this.getOpenId(this.$route.query.code)
      } else {
        this.getWechatCode()
      }
    }
  }
}
</script>

<style scoped lang="less">
.login {
  width: 100vw;
  height: 100vh;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;

  .logoInfo {
    margin-top: 142px;
    display: flex;
    align-items: center;

    img {
      width: 24px;
      height: 24px;
      margin-right: 8px;
    }

    span {
      font-size: 14px;
      color: #a2a5af;
    }
  }

  .info {
    margin-top: 16px;
    font-size: 18px;
    color: #a2a5af;
  }
}
</style>
