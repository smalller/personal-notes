<template>
<div class="authorInfo">
  <div>
    <img :src="info.img" alt="">
  </div>
  <div>
    <div class="userName">{{info.userName}}</div>
    <div class="date">{{info.date}}</div>
  </div>
</div>
</template>

<script>
export default {
  name: "authorInfo",
  props: {
    info: {
      type: Object,
      default: {}
    }
  }
}
</script>

<style scoped lang="less">
.authorInfo{
  height: 42px;
  display: flex;
  align-items: center;
  >div {
    &:first-child {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      overflow: hidden;
      img{
        width: 100%;
        height: 100%;
      }
    }
    &:last-child {
      height: 42px;
      margin-left: 12px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      text-align: left;
      .userName {
        color: #333333;
        font-size: 16px;
      }
      .date{
        color: #999999;
        font-size: 12px;
      }
    }
  }
}
</style>
