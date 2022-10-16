<template>
  <div class="studentApply">
    <my-head title="申请宝宝入园">
      <template #right>
        <div
          class="head-btn"
          @click="showHistory"
        >申请记录</div>
      </template>
    </my-head>
    <div class="apply-content">
      <div class="info">
        <span>请联系老师获取班级邀请码，老师在园丁端-宝宝 管理-邀请入园中可查看邀请码。</span>
      </div>
      <div class="content">
        <van-field
          class="code"
          v-model="sms"
          center
          clearable
          placeholder="输入或扫描邀请码"
        >
          <template #button>
            <img
              style="width:24px;height:24px;cursor:pointer"
              src="../../assets/scan.png"
              @click="openScan"
            >
          </template>
        </van-field>
        <span
          v-if="codeErr"
          class="err"
        >未查询到邀请信息，请重新输入，或联系幼儿园老师获取 班级邀请码。</span>
      </div>
      <div class="submit">
        <van-button
          class="next"
          @click="getStudent"
        >下一步</van-button>
      </div>
      <van-popup v-model="show">
        <div class="tips">
          <span>不支持此二维码</span>
          <van-button
            class="btn"
            type="info"
            @click="show = !show"
          >
            <span>确定</span>
          </van-button>
        </div>
      </van-popup>
    </div>
  </div>

</template>

<script>
import MyHead from "@/views/userCamera/component/head";
import qs from "qs";
export default {
  name: "studentApply",
  components: { MyHead },
  data() {
    return {
      sms: '',
      show: false,
      codeErr: false,
    }
  },
  computed: {
    // ...mapGetters(['excelData'])
  },
  watch: {
    // 'formData.studentName': function (val) {
    //   this.formData.pinyin = this.getPY(val).replaceAll(' ', '')
    // }
  },
  created() {
    this.sms = ""
    const url = location.href.split('?')[1]
    let data = qs.parse(url)
    this.sms = data.code
    console.log(data, this.$route.params)
    if (micell.ua.isWeChat()) {
      if (!this.$store.state.userId || !this.$store.state.token) {
        this.$bus.$emit('wechatLogin', {
          title: '申请宝宝入园',
          isSelectStudent: 0,
          isSelectTeacher: 0
        })
      } else {
        console.log(this.$router.query)
        this.getWeChatAppId()
      }
      // if (this.sms) {
      //   this.getStudent()
      // }
    }
  },
  methods: {
    getStudent() {
      this.codeErr = false
      if (this.sms) {
        this.$request(`/schools/api/stuApply/checkCode?code=${this.sms}`, {
          methods: 'get',
        }).then(res => {
          if (+res.code === 0) {
            this.$router.push({
              name: 'student',
              query: { code: this.sms }
            })
            this.codeErr = false
          } else {
            this.codeErr = true
          }
        })
      }
    },
    async openScan() {
      let that = this
      that.show = false
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
            if (res.resultStr) {
              let data = res.resultStr.split('|')
              that.sms = data[3]
              that.getStudent()
            }
          },
          fail: function (res) {
            if (res) {
              that.show = true
            }
          }
        })
      })
    },
    getWeChatAppId() {
      return this.$request(`/pays/paycert/unAccess/getWXJsSDK`, {
        methods: 'get',
        params: { url: location.href }
      }).then(res => res.data)
    },
    showHistory() {
      this.$router.push({
        name: 'record'
      })
    },
  }
}
</script>

<style  lang="less">
.studentApply {
  background: #f6f7f9;
  min-height: 100vh;
  .head-btn {
    cursor: pointer;
  }
  .apply-content {
    .info {
      width: 80%;
      margin: auto;
      margin-top: 15px;
      margin-bottom: 25px;
      font-size: 14px;
      line-height: 25px;
      /* font-family: PingFang SC; */
      font-weight: 400;
      color: #b0b0b0;
    }
    .content {
      .code {
        width: 350px;
        margin: auto;
        height: 46px;
        background: rgba(255, 255, 255);
        opacity: 1;
        border-radius: 46px;
        font-size: 16px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #b0b0b0;
      }
      .err {
        display: block;
        width: 300px;
        margin: auto;
        margin-top: 10px;
        font-size: 12px;
        font-weight: 400;
        line-height: 25px;
        color: #f82e2e;
      }
    }
    .submit {
      width: 100%;
      text-align: center;
      .next {
        width: 205px;
        margin-top: 30px;
        height: 46px;
        background: rgba(255, 170, 83);
        opacity: 1;
        border-radius: 25px;
        color: #ffffff;
        border: none;
      }
    }
    .tips {
      width: 260px;
      height: 190px;
      background: rgba(255, 255, 255, 0.39);
      opacity: 1;
      border-radius: 32px;
      text-align: center;
      padding-top: 45px;
      span {
        // display: block;
        font-size: 16px;
        font-weight: 400;
        color: #1c1c1c;
      }
      .btn {
        width: 175px;
        height: 48px;
        margin-top: 50px;
        background: rgba(241, 240, 245);
        border: none;
        opacity: 1;
        border-radius: 49px;
        span {
          font-size: 16px;
          font-weight: 400;
          color: #ffaa53;
        }
      }
    }
  }
}
.van-popup--center {
  border-radius: 16px;
}
</style>
