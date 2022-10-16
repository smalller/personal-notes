<template>
<div class="shareDetails">

  <div class="content">
    <div class="title">{{ data.title }}</div>
    <div class="info">
      作者:
      <span>{{ data.author }}</span>
      ·
      <span>{{ data.publishTime }}</span>
    </div>
<!--    <div class="video"></div>-->
    <player class="video" v-show="data.videoPath" ref="liveVideo"></player>
    <div class="html" v-html="data.content"></div>
    <div class="source">{{data.source}}</div>

  </div>

</div>
</template>

<script>
import OpenAppHead from "@/components/openAppHead";
import Player from "@/components/player";
export default {
  name: "shareDetails",
  components: {Player, OpenAppHead},
  props: {
    data: {
      type: Object,
      default: {}
    }
  },
  mounted() {
  },
  watch: {
    data: {
      handler: function () {
        // this.author = {
        //   userName: this.data.userNikeName,
        //   date: this.data.createTime,
        //   img: this.data.headPortrait
        // }
        if (this.data?.videoPath) {
          this.$refs.liveVideo.setPlay(this.data.videoPath, {
            autoPlay: false,
          })
        }
      },
      deep: true
    }
  }
}
</script>

<style lang="less">
.shareDetails {
  //padding-bottom: 80px;
  .content{
    padding:0 16px 0;
    position: relative;
    >div {
      text-align: left;
    }
    .title{
      font-weight: bold;
      color: #1C1C1C;
      line-height: 28px;
      font-size: 18px;
    }
    .info{
      font-size: 12px;
      color: #a4a4a4;
      font-weight: 400;
    }
    .source{
      margin-top: 50px;
      padding-bottom: 16px;
      font-size: 12px;
      color: #c1c1c1;
    }
    .html{
      img{
        max-width: 100% !important;
      }
      video {
        max-width: 100% !important;
      }
    }
  }

}
</style>
