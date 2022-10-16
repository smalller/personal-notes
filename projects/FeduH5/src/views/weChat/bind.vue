<template>
  <div class="wechatLogin">
    <div class="logoInfo">
      <img src="./assets/image/appLogo.png" alt="">
      <span>金树丫</span>
    </div>
    <div class="formTitle">
      <span>请输入手机号</span>
    </div>
    <div class="formSubTitle">
      <span>未注册的手机号验证通过后将直接注册</span>
    </div>
    <div class="inputBox">
      <input type="number" v-model="phone" placeholder="输入手机号">
      <span class="errMsg">{{phoneErrMsg}}</span>
    </div>
    <div class="inputBox">
      <input type="number" style="width:60%" v-model="smsCode" placeholder="输入验证码">
      <span class="errMsg">{{smsCodeStatus}}</span>
      <span class="btn" v-if="!smsLook" @click="getSms">{{smsStatus?'重新获取':'获取验证码'}}</span>
      <span class="btn" v-else>重新获取{{smsTime}}秒</span>
    </div>
    <div class="subBtn" @click="submit">确定</div>
  </div>
</template>

<script>
import axios from "axios"
import {mapActions, mapGetters} from 'vuex'
import {getFileUrl} from "@/api/common";
import qs from "qs";
export default {
  name: "wechatLogin",
  data() {
    return {
      phone: '',
      phoneErrMsg: false,
      phoneReg: /^[1]([3-9])[0-9]{9}$/,
      bindPhoneShow: false,
      smsCodeStatus: false,
      sms: '',
      smsCode: '',
      smsStatus: false,
      smsLook: false,
      smsTime: 120,
      isTeacher: 0
    }
  },
  watch: {
    phone: function (val) {
      this.phoneErrMsg = this.phoneReg.test(val)
    },
    smsCode: function (val) {
      this.smsCodeStatus = val === this.sms
    }
  },
  computed: {
    ...mapGetters(['schoolId'])
  },
  methods: {
    ...mapActions(['setUserInfo','setUserId','setToken','setSchoolInfo']),
    getSms() {
      if(this.smsLook) {
        return
      }
      if(this.phone&&this.phoneErrMsg) {
        this.smsLook = true

        this.$request(`/userserver/regLogin/getWxRegSms/app/${this.phone}`, {
          method: 'post'
        }).then(res => {
          this.startSmsTime()
          if(+res.code === 0) {
            vant.Toast('发送短信成功')
          } else {
            vant.Toast(res.msg)
          }

        })
      } else {
        if(!this.phone) {
          vant.Toast('请输入手机号')
        } else if(!this.phoneErrMsg) {
          vant.Toast('请输入正确的手机号')
        }
      }
    },
    startSmsTime() {
      this.smsTime = 120
      let timer = setInterval(() => {
        if(this.smsTime<=0) {
          clearInterval(timer)
          this.smsTime = 120
          this.smsLook = false
        }
        this.smsTime--
      },1000)
    },
    submit() {
      if(!this.phone&&this.phoneErrMsg) {
        vant.Toast('请输入正确的手机号')
      } else if(!this.smsCode) {
        vant.Toast('请输入短信验证码')
        this.smsCodeStatus = true
      } else {
      const formData = new FormData()
      formData.append('phone', this.phone)
      formData.append('openId', this.$route.query.openId)
      formData.append('smsCode', this.smsCode)
      this.$request('/userserver/regLogin/unAccess/wxBind', {
        method: 'post',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form'
        }
      }).then(async res => {
        if(+res.code === 0) {

          this.setUserId(res.data.userId)
          this.setToken(res.data.token)
          this.setUserInfo(res.data)
          const isSelectStudent = +sessionStorage.getItem('isSelectStudent')
          if(isSelectStudent) {
            if(+sessionStorage.getItem('isSelectTeacher') === 1) {
              await this.getUserIsTeacher()
            }
            await this.getSchoolInfo()
            this.$router.push({
              name: 'selectStudent'
            })
          } else {
            this.jump()
          }

          this.setUserId(res.data.userId)
          this.setToken(res.data.token)
          vant.Toast('绑定成功')
          this.setUserInfo(res.data)
          // console.log(res.data)
          await this.getSchoolInfo()
          if(+sessionStorage.getItem('isSelectTeacher') === 1) {
            await this.getUserIsTeacher()
          }
          this.jumpSelectStudent()
        } else {
          vant.Notify({ type: 'warning', message: res.msg });
        }
      })
      }
    },
    jump() {
      const path = sessionStorage.getItem('routerPath')
      const query = JSON.parse(sessionStorage.getItem('routerQuery'))
      location.href = location.origin+path+'?'+qs.stringify(query)
    },
    getUserIsTeacher() {
      return new Promise(resolve => {
        this.$request('/schools/api/schoolEmpRel/getRels', {
          method: 'get',
          params: {
            schoolId: this.schoolId
          },

        }).then(res => {
          if(+res.code === 0) {
            if(res.data.length === 0) {
              this.isTeacher = 0
            } else {
              const school = res.data.find(item => item.schoolId === this.schoolId)
              this.isTeacher = +!!school
            }
            sessionStorage.setItem('isTeacher',  this.isTeacher)
            resolve()
          }
        })
      })
    },
    getSchoolInfo() {
      return new Promise(resolve => {
        this.$request(`/schools/api/school/querybyId/${this.schoolId}`, {
          method: 'get'
        }) .then(res => {
          if(res.logo) {
            getFileUrl(res.logo).then(logo => {
              if(+logo.code === 0) {
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
    jumpSelectStudent() {
      const isSelectStudent = +sessionStorage.getItem('isSelectStudent')
      if(isSelectStudent) {
        this.$router.push({
          name: 'selectStudent'
        })
      } else {
        this.jump()
      }
    }
  },
  created() {
  },
  mounted() {
    vant.Toast('微信未绑定用户信息，请输入要绑定的手机号')
  }
}
</script>

<style scoped lang="less">
.wechatLogin{
  padding: 0 40px;
  *{
    box-sizing: border-box;
  }
  .logoInfo{
    margin-top: 24px;
    display: flex;
    align-items: center;
    img{
      width: 24px;
      height: 24px;
      margin-right: 8px;
    }
    span{
      font-size: 14px;
      color: #A2A5AF;
    }
  }
  .formTitle{
    margin-top: 12px;
    color: #2D3540;
    font-weight: bold;
    font-size: 28px;
  }
  .formSubTitle{
    margin-top: 10px;
    font-size: 16px;
    color: #A2A5AF;
    margin-bottom: 28px;
  }
  .inputBox{
    position: relative;
    height: 48px;
    width: 100%;
    padding: 0 20px;
    border-radius: 24px;
    overflow: hidden;
    background: #F6F7FB;
    margin-bottom: 16px;
    input{
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      border: none;
      outline: none;
      background: rgba(255, 255, 255, 0);
      font-size: 18px;
      color: #000000;
      &::placeholder {
        font-size: 16px;
        color: #BABFCE;
      }
    }
    .btn{
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: 20px;
      z-index:1;
      font-size: 16px;
      color: #A2A5AF;
    }
  }
  .subBtn{
    margin-top: 28px;
    height: 48px;
    background: linear-gradient(90deg, #FFC131 0%, #FF913D 100%);
    border-radius: 49px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    color: #FFFFFF;
  }
}
</style>
