<template>
  <div  class="loading">
    <my-head title="证件照录入" />
    <div class="loadingContent">
      <div class="loadingBox">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div class="info">证件照生成中...</div>
    </div>
  </div>
</template>

<script>
import MyHead from "@/views/userCamera/component/head";
export default {
  name: "myLoading",
  components: {MyHead}
}
</script>

<style scoped lang="less">
.loading {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 30;
  background: rgba(255, 255, 255, 0.9);

  display: flex;
  flex-direction: column;
.loadingContent{
  width: 100%;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  .info{
    margin-top: 30px;
  }
}
  .loadingBox{
    width: 50px;
    display: flex;
    justify-content: space-between;
  }
  @-webkit-keyframes load {
    0%,
    100% {

    }
    50% {
      transform: translateY(10px);
    }
  }

  span {
    display: inline-block;
    width: 10px;
    height: 10px;
    background: lightgreen;
    -webkit-animation: load 1s ease infinite;
    border-radius: 50%;
    &:nth-child(1) {
      -webkit-animation-delay: 0s;
      background: #F84242;
    }
    &:nth-child(2) {
      -webkit-animation-delay: 0.3s;
      background: #3B87F7;
    }
    &:nth-child(3) {
      -webkit-animation-delay: 0.7s;
      background: #FFBC21;
    }
  }
}
</style>
