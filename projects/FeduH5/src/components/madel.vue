<template>
<div class="madel" v-show="show">
  <div class="mask"></div>
  <div class="content">
    <div>
      <div class="btn" @click="close"></div>
    </div>
    <div>
      <h1>金树丫，家校共育互动平台</h1>
      <div class="imgList">
        <img src="../assets/image/madel/a.png" alt="">
        <img src="../assets/image/madel/b.png" alt="">
        <img src="../assets/image/madel/c.png" alt="">
        <img src="../assets/image/madel/d.png" alt="">
      </div>
      <span>随时随地掌握孩子动态</span>
      <div class="btn" >
        去下载
        <div @click="openApp" v-if="!isWeChat"></div>
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
            <button class="btn" >去下载</button>
          </script>
        </wx-open-launch-app>
      </div>
    </div>
  </div>
</div>
</template>

<script>

import qs from "qs";
import {getWeChatAppId} from "@/api/common";

export default {
  name: "madel",
  data() {
    return {
      show: false,
      isWeChat: false,
      extinfoStr: ''
    }
  },
  props: {
    params: {
      type: Object,
      default: {}
    }
  },
  watch: {
    appParams: {
      handler: function () {
        this.extinfoStr = qs.stringify(this.appParams)
      },
      deep: true
    }
  },
  created() {
    if(micell.ua.isWeChat()) {
      this.init()
    }
  },
  methods: {
    init() {
      const self = this;
      getWeChatAppId(location.href).then(res => {
       if(+res.code === 0) {
         const {data} = res
         // alert(JSON.stringify(data))
         console.log("当前符合 h5 打开指定app", res);
         wx.config({
           debug: false,
           appId: data.appId,
           timestamp: data.timestamp,
           nonceStr:data.noncestr,
           signature: data.sign,
           jsApiList: ['onMenuShareAppMessage','updateAppMessageShareData','updateTimelineShareData'],
           openTagList: ['wx-open-launch-app']
         })
         wx.ready(() => {
           self.isWeChat = true
         })
       }
      })

    },
    open() {
      this.show = true
      this.$emit('open')
    },
    close() {
      this.show = false
      this.$emit('close')
    },
    openApp() {
      if (micell.ua.isWeChat()) {
        // this.$router.push('/download')
        if (micell.ua.isAndroid()) {
          location.href='https://a.app.qq.com/o/simple.jsp?pkgname=com.fltd.jyb&channel=0002160650432d595942&fromcase=60001'
        }
        if(micell.ua.isIOS()) {
          location.href = 'https://apps.apple.com/cn/app/%E9%87%91%E6%A0%91%E4%B8%AB/id1560759387#?platform=iphone'
        }
        return
      }
      let str = ''
      if (this.appParams?.albumId) {
        str = qs.stringify(this.appParams)
        if (micell.ua.isIOS()) {
          str ='/homePage?'+ str
        }
      }
      location.href=micell.ua.isIOS()?`https://www.jinshuy.com/app${str}`:`android://fltd.jyb/openwith?${str}`
      setTimeout(() => {
        location.href=`https://www.jinshuy.com/m${str}`
      },500)
      // location.href=micell.ua.isIOS()?'https://www.jinshuy.com/app/':`android://fltd.jyb/openwith?albumId=${this.params.albumId}&albumItemId=${this.params.albumItemId}`
      // setTimeout(() => {
      //   location.href='https://www.jinshuy.com/m'
      // },500)
    }
  }
}
</script>

<style scoped lang="less">
.madel{
  position: relative;
  .mask{
    position: fixed;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.3);
    z-index: 100;
  }
  .content{
    position: fixed;
    z-index: 101;
    width: 76.27vw;
    height: 98.67vw;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    border-radius: 5.6vw;
    overflow: hidden;
    >div {
      &:first-child{
        position: relative;
        height: 40.67vw;
        width: 100%;
        background: url("../assets/image/madel/bj.png");
        background-size: 100% 100%;
        .btn{
          background: url("../assets/image/madel/close.png");
          background-size: 100% 100%;
          width: 11.85vw;
          height: 11.85vw;
          position: absolute;
          top: -4px;
          right: -4px;
        }
      }
      &:last-child{
        background: #FFFFFF;
        height: 58vw;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        h1{
          margin-top: 16px;
          font-size: 16px;
          color: #f19f4d;
        }
        .imgList{
          margin-top: 18px;
          display: flex;
          justify-content: space-between;
          width: 67.73vw;
          img{
            width: 12.8vw;
            height: 12.8vw;
          }
        }
        span{
          margin-top: 16px;
          font-size: 14px;
          color: #6a6a6a;
        }
        .btn{
          margin-top: 18px;
          width: 65.07vw;
          height: 11.73vw;
          border-radius: 60px;
          background: linear-gradient(180deg, #F5BD7D 0%, #F19F4D 100%);
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 16px;
          color: #ffffff;
          position: relative;
          >div {
            width: 100%;
            height: 100%;
            opacity:0;
            position: absolute;
            top: 0;
            left: 0;
          }
        }
      }
    }
  }
}
</style>
