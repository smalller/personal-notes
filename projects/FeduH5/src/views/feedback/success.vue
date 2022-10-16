<template>
  <div class="sendSuccess">
    <my-head
        title="投诉反馈"
        @leftClick="$router.back()"
        closeBtn
        @closeClick="backClick"
    >
      <template #right>
        <div class="headBtn" @click="onClickRight">反馈列表</div>
      </template>
    </my-head>
    <div class="icon">
      <img src="@/assets/image/feedback/success.png" alt="">
    </div>
    <div class="title">反馈成功</div>
    <div class="tips">感谢您对金树丫的关注与支持，我们已经收到您的反馈，
      会尽快修复和完善相关的功能。</div>
    <div class="btn" @click="backClick">关闭</div>
  </div>
</template>

<script>
import MyHead from "../userCamera/component/head";
export default {
  name: "success",
  components: {MyHead},
  methods: {
    backClick() {
      // if (micell.ua.isWeChat()) {
      //   document.addEventListener('WeixinJSBridgeReady', function () { WeixinJSBridge.call('closeWindow'); }, false);
      //
      //   WeixinJSBridge.call('closeWindow');
      // }

      if (micell.ua.isAndroid()) {
        window.WebViewJavascriptBridge.closeWindow()
      } else {
        window.webkit.messageHandlers.closeWindow.postMessage("closeWindow")
      }
    },
    onClickRight() {
      this.$router.push('/feedback/list')
    }
  }
}
</script>

<style scoped lang="less">
.sendSuccess{
  width: 100vw;
  height: 100vh;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  .headBtn{
    color: #1C1C1C !important;
  }
  .icon{
    margin-top: 90px;
    width: 72px;
    height: 72px;
    img{
      width: 100%;
      height: 100%;
    }
  }
  .title{
    margin-top: 20px;
    font-weight: bold;
    font-size: 20px;
    color: #1C1C1C;
  }
  .tips{
    padding:0 38px;
    box-sizing: border-box;
    text-align: center;
    margin-top: 6px;

    font-size: 12px;
    font-weight: 400;
    color: #C1C1C1;
  }
  .btn{
    margin-top: 26px;
    width: 240px;
    height: 46px;
    background: #FFAA53;
    border-radius: 24px;
    color: #FFFFFF;
    font-weight: 500;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.3s;
    &:active{
      background: #fd972e;
    }
  }
}
</style>
