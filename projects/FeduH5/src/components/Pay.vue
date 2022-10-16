<template>
  <div class="home">
    <!-- <h1>pay</h1> -->
    <!-- <el-button @click="test">测试</el-button> -->
    <!-- <el-button @click="submitOrder">测试1</el-button> -->
    <div class="payresult"></div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "HelloWorld",
  data() {
    return {
      payData: {},
      isIos: 0,
      testData:{}
    };
  },
  mounted() {
    let code = window.location.href
    let data = decodeURIComponent(code)
    let datas = this.UrlParamHash(data)
    this.isAndroidOrIOS()
    if (datas.amount) {
      this.payData = { ...datas }
      this.getUser()
    }
  },
  methods: {
    getUser() {
      if (this.payData.amount) {
        this.submitOrder(this.payData)
      }
    },
    UrlParamHash(url) {
      var params = {}
      var h
      var hash = url.slice(url.indexOf("?") + 1).split(" ")
      for (var i = 0; i < hash.length; i++) {
        h = hash[i].split("=")
        params[h[0]] = h[1]
      }
      return params
    },
    submitOrder(dataInfo) {
      if (dataInfo) {
      axios
        .post(
          `${process.env['VUE_APP_BASE_API']}/pays/pay/payUrl`,
          {
            amount: dataInfo.amount,
            body: "body",
            orderDesc: dataInfo.orderDesc,
            orderId: dataInfo.orderId,
            openId: dataInfo.openid,
            payGatewayType: "YOP",
            payTradeType: "ZFB_SHH",
            receipt: "IOS凭证",
            schoolId: "学校id",
          },
            {
              headers: {
                userId: dataInfo.userId,
                token: dataInfo.token,
                "Content-Type": "application/json",
              },
            }
        )
      .then(async (res) => {
          // alert(JSON.stringify(res),'订单信息')
        let resData = res.data;
        if (resData.code == 0) {
          console.log('返回数据')
        await this.toPay(resData.data.extraMsg.tradeNo);
        } else {
          this.$message.warning("支付宝支付订单提交失败,系统未响应");
        }
      })
      .catch((err) => {
        this.$message.warning(err.message);
      });
    }
    },
   	    toPay(data) {
      let that = this 
      if (data) {
        ap.tradePay(
          {
            tradeNO: data,
          },
          function (res){

          }
        );
      } else {
        this.$message.warning("支付宝支付订单失败")
      }
    },
    isAndroidOrIOS() {
      var u = navigator.userAgent;
      var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1 //android终端
      var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)//ios终端
      if (isAndroid) {
        this.isIos = 0
      }
      if (isiOS) {
        this.isIos = 1
      }
    },
    test() {
      // alert( JSON.stringify(this.testData))
      // alert(this.isIos)
      if (this.isIos) {
        window.location.href = "https://www.jinshuy.com/app/"
      } else {
        window.location.href = 'http://fltd.jyb/openwith/'
      }
    },
    //  ready(callback) {
    //     if (AlipayJSBridge) {
    //         callback && callback();
    //     } else {
    //         document.addEventListener('AlipayJSBridgeReady', callback, false);
    //     }
    // },

    //  tradePay() {
    //   //  alert()
    //    this.ready(function(){
    //         // 通过传入交易号唤起快捷调用方式(注意tradeNO大小写严格)
    //         AlipayJSBridge.call("tradePay", {
    //             tradeNO: 2021071422001410391445085809
    //         }, function (data) {
    //             document.getElementsByClassName('payresult')[0].style.display = 'block';
    //             alert(JSON.stringify(data));
    //             if ("9000" == data.resultCode) {
    //                 // 支付成功
    //             } else {
    //                 // 支付失败
    //             }
    //         });
    //     });
    // }
    // toPay(payInfo) {
    //   console.log(payInfo, "352323213");
    //   if (payInfo) {
    //     window.ap.tradePay(
    //       {
    //          tradeNo: payInfo,
    //           //  orderStr:'app_id=2021002152633056&charset=utf-8&format=json&method=alipay.trade.app.pay&notify_url=http://rc2uky.natappfree.cc/pays/unAccess/paynotify/yopOrderNotify&sign_type=RSA2&timestamp=2021-07-14 10:12:31&version=1.0&biz_content=%7B%22timeout_express%22%3A%2230m%22%2C%22product_code%22%3A%22QUICK_MSECURITY_PAY%22%2C%22total_amount%22%3A%220.01%22%2C%22subject%22%3A%22%E6%9C%88%E5%BA%A6%E4%BC%9A%E5%91%98%22%2C%22body%22%3A%22%E6%88%91%E6%98%AF%E6%B5%8B%E8%AF%95%E6%95%B0%E6%8D%AE%22%2C%22out_trade_no%22%3A%22IQJZSRC1YMQB5HU%22%7D&sign=zsDIrrZIPCZtv66s3xkcwgC39XPP45/4Sm9U4yLbxb+uRsrnu2VKP23pxJabqC4kx87GlZk1OJcbSJNc6WV/NAEWIPlvpSN7fg8+4En0nmGoY80SR01sdD5rG78jBOpQSpMeZ+/INVHgID7VDPLJfxCfElDtjISga1N85+LDEWKGtiY0/J8dhyFfY08K6SGcU5JlK7CInmEB2SaIPEVDosMAOTOxWIYQaFArzwE8XbeH09UDRNZeUpYsnQS7R0azm+SGsw6HkvRXb0siA5GoLtY1W9UpycbBRLY9RK/+Hzo4CIE2ANnfBrPGiC+oWsmRsJ5Ec+4T44vBh0VENQxrcA=='
    //       },
    //       function (res) {
    //         alert( JSON.stringify(res),'支付信息')
    //         console(res,'655464524564564564569')
    //         // window.ap.alert(res.resultCode);
    //       }
    //     );
    //     // const div = document.createElement("div"); // 创建div
    //     // div.innerHTML = payInfo; // 将返回的form 放入div
    //     // document.body.appendChild(div);
    //     // 向支付发起支付
    //     // document.forms[0].submit();
    //   } else {
    //     this.Message.warning("支付宝发起支付失败,订单信息不存在");
    //   }
    // },
  }
};
</script>

<style scoped>
.home{
   background: url("../assets/zhifubao.png") no-repeat;
    width: 100%;
    height: 100%;
    background-size: 100% 100%;
    position: absolute;
    filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(src='../assets/zhifubao.png',sizingMethod='scale');
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
