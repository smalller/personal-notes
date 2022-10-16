<template>
<div class="openAppHead" :class="[isTop?'top':'bottom']">
  <div class="logo">
    <img src="@/assets/image/logo.png" alt="">
    <span>金树丫</span>
  </div>
  <div class="openAppBtn" >
    打开
    <div class="btn" v-if="!isWeChat"  @click="openApp" ></div>
   <wx-open-launch-app
       v-if="isWeChat"
       id="launch-btn"
       class="launch-btn"
       appid="wxfddd3cd8dc959eb0"
       :extinfo="extinfoStr"
       @ready="ready"
       @error="err"
       @launch="launch"
   >
     <script type="text/wxtag-template">

       <style >
         .btn {
           opacity: 0;
           position: absolute;
           top: 0;
           left: 0;
           width: 100%;
           height: 100%;
           z-index: 2;
          }
        </style>
        <button class="btn" >打开</button>
     </script>
   </wx-open-launch-app>
  </div>
</div>
</template>

<script>
import qs from "qs";
import {getWeChatAppId} from "@/api/common";
export default {
  name: "openAppHead",
  props: {
    params: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      isTop: true,
      extinfoStr: '',
      isWeChat: false
    }
  },
  watch: {
    params: {
      handler: function () {
        this.extinfoStr = qs.stringify(this.params)
      },
      deep: true
    }
  },
  mounted() {
    const self = this;
    document.addEventListener('scroll',e => {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      self.isTop = scrollTop<self.$el.clientHeight+4
    })
  },
  created() {
    window.wx = wx
    if(micell.ua.isWeChat()) {
      this.init()
      // this.judgeNavigator()
    }
    // document.addEventListener('WeixinOpenTagsError', function (e) {
    //  alert(`WeixinOpenTagsError:${JSON.stringify(e.detail.errMsg)}`); // 无法使用开放标签的错误原因，需回退兼容。仅无法使用开发标签，JS-SDK其他功能不受影响
    // });
  },
  methods: {
    ready() {
      // alert('ready')
    },
    err (e) {
      if (micell.ua.isAndroid()) {
        location.href='https://a.app.qq.com/o/simple.jsp?pkgname=com.fltd.jyb&channel=0002160650432d595942&fromcase=60001'
      }
      if(micell.ua.isIOS()) {
        location.href = 'https://apps.apple.com/cn/app/%E9%87%91%E6%A0%91%E4%B8%AB/id1560759387#?platform=iphone'
      }
    },
    launch() {},
    init() {
      const self = this;
      document.addEventListener('WeixinOpenTagsError', e => {
        // alert(e.detail.errMsg)
      })
      getWeChatAppId(location.href).then(res => {
        if (+res.code === 0) {
          const {data} = res
          // alert(JSON.stringify(data))
          console.log("当前符合 h5 打开指定app", res);
          wx.config({
            debug: false,
            appId: data.appId,
            timestamp: data.timestamp,
            nonceStr: data.nonceStr,
            signature: data.signature,
            jsApiList: ['onMenuShareAppMessage','updateAppMessageShareData','updateTimelineShareData'],
            openTagList: ['wx-open-launch-app']
          })
          wx.ready(() => {
            self.isWeChat = true
          })
        }
      })
    },
    openApp() {
      if (micell.ua.isWeChat()) {
        // this.$router.push('/download')
        if (micell.ua.isAndroid()) {
          location.href='https://a.app.qq.com/o/simple.jsp?pkgname=com.fltd.jyb&channel=0002160650432d595942&fromcase=60001'
        }
        if(micell.ua.isIOS()) {
          location.href = 'https://apps.apple.com/cn/app/'
        }
        return
      }
      let str = ''
      console.log(123,this.params)
      if (this.params?.albumId) {
        str ='/homePage?'+ qs.stringify(this.params)
      }
      location.href=micell.ua.isIOS()?`https://www.jinshuy.com/app${str}`:`android://fltd.jyb/openwith?${str}`
      setTimeout(() => {
        location.href=`https://www.jinshuy.com/m${str}`
      },500)
    },
    request(url,data, headers = {}) {
      return new Promise((resolve, reject) => {
        if (JSON.stringify(data) !== '{}') {
          url+=`?${qs.stringify(data)}`
        }
        fetch(url, {
          method: 'get',
          headers: headers
        }).then(res => {
          resolve( res.json())
        }).catch(err => {
          reject(err)
        })
      })
    },
  }
}
</script>

<style scoped lang="less">
.openAppHead{
  width: 100%;
  height: 44px;
  background: #ffffff;
  display:  flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  z-index: 10;
  left: 0;
  &.top{
    position: absolute;
    top: 0;
    box-shadow: 0 1px 0 rgba(0, 0, 0, 0.06);
  }
  &.bottom{
    position: fixed;
    bottom: 0;
    box-shadow: 0 -1px 0 rgba(0, 0, 0, 0.06);
  }
  .logo{
    display:  flex;
    align-items: center;
    img{
      width: 36px;
      height: 36px;
    }
    span{
      color: #FF9900;
      font-size: 16px;
      margin-left: 8px;
      font-weight: 800;
    }
  }
  .openAppBtn{
    position: relative;
    cursor: pointer;
    width: 72px;
    min-width: 72px;
    height: 28px;
    background: #FF9F01;
    border-radius: 14px;
    font-size: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #FFFFFF;
    .btn{
      position: absolute;
      top: 0;
      left: 0;
      width:100%;
      height: 100%;
      z-index:1;
    }
  }
  .launch-btn{
    position:absolute;
    left: 0;
    top: 0;
    width: 72px;
    min-width: 72px;
    height: 28px;
    .btn{
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
